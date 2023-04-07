package com.backend.gbp.graphqlservices


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.ServiceStep
import com.backend.gbp.domain.UploadedFiles
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.ServiceRepository
import com.backend.gbp.repository.ServiceStepRepository
import com.backend.gbp.repository.UploadedFilesRepository
import com.backend.gbp.repository.lot.LotTransactionRepository
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@TypeChecked
@Component
@GraphQLApi
class UploadedFilesService {

    @Autowired
    UploadedFilesRepository uploadedFilesRepository

    @Autowired
    GeneratorService generatorService

    @Autowired
    ServiceStepRepository serviceStepRepository


    @Autowired
    LotTransactionRepository lotTransactionRepository

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================

//    @GraphQLQuery(name = "getLdcAndCadMaps", description = "Get All Services")
//    List<UploadedFiles> getLdcAndCadMaps(@GraphQLArgument(name = "lotTransactionId") UUID lotTransactionId)) {
//        List docTypes = ["CAD_MAP", "LDC"]
//        uploadedFilesRepository.findLdcAndCadMaps(lotTransactionId, docTypes).sort {  }//equivalent to select *
//    }

    @GraphQLQuery(name = "getFilesByDocTypes", description = "Get Service By Id")
    List<UploadedFiles> getFilesByDocTypes(@GraphQLArgument(name = "lotTransactionId") UUID lotTransactionId,
                                           @GraphQLArgument(name = "docTypes") List<String> docTypes) {
        return uploadedFilesRepository.findByDocTypes(lotTransactionId, docTypes).sort { it.docType }
    }


    //============== All Mutations ====================


    @GraphQLMutation(name = "deleteFile")
    @Transactional
    GraphQLRetVal<UploadedFiles> deleteFile(
            @GraphQLArgument(name = "id") UUID id
    ) {
        UploadedFiles file = uploadedFilesRepository.findById(id).get()
        uploadedFilesRepository.delete(file)
        if (!file)
            return new GraphQLRetVal<UploadedFiles>(null, false, "Failed to delete file.")
        else {
            def delete = new File("C:/xampp/htdocs/uploads/" + file.id + file.fileExtension)
            delete.delete()

            updateFlags(file.lotTransaction.id, file.docType)

            return new GraphQLRetVal<UploadedFiles>(file, true, "File deleted successfully.")
        }

    }

    @GraphQLMutation(name = "editFile")
    @Transactional
    GraphQLRetVal<UploadedFiles> editFile(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fileName") String fileName,
            @GraphQLArgument(name = "docType") String docType

    ) {
        UploadedFiles file = uploadedFilesRepository.findById(id).get()
        if (!file)
            return new GraphQLRetVal<UploadedFiles>(null, false, "File not found.")
        else {
            def oldDocType = file.docType

//            println("docType: "+docType)
//            println("file.docType: " + file.docType)

            file.fileName = fileName
            file.docType = docType

            uploadedFilesRepository.save(file)

            updateFlags(file.lotTransaction.id, oldDocType)
            updateFlags(file.lotTransaction.id, docType)

            return new GraphQLRetVal<UploadedFiles>(file, true, "File updated successfully.")
        }

    }


    String updateFlags(
            UUID lotTransactionId,
            String docType

    ) {
        def lotTransaction = lotTransactionRepository.findById(lotTransactionId).get()

        if (docType == "CAD_MAP") {
            def file = uploadedFilesRepository.findByDocTypes(lotTransactionId, ["CAD_MAP"])
            if (file) {
                lotTransaction.uploadedFileFlags.hasCad = true
            } else {
                lotTransaction.uploadedFileFlags.hasCad = false

            }

        } else if (docType == "LDC") {
            def file = uploadedFilesRepository.findByDocTypes(lotTransactionId, ["LDC"])
            if (file) {
                lotTransaction.uploadedFileFlags.hasLdc = true
            } else {
                lotTransaction.uploadedFileFlags.hasLdc = false

            }

        } else if (docType == "BL_PLAN") {
            def file = uploadedFilesRepository.findByDocTypes(lotTransactionId, ["BL_PLAN"])
            if (file) {
                lotTransaction.uploadedFileFlags.hasBLPlan = true
            } else {
                lotTransaction.uploadedFileFlags.hasBLPlan = false

            }

        } else if (docType == "SKETCH_PLAN") {
            def file = uploadedFilesRepository.findByDocTypes(lotTransactionId, ["SKETCH_PLAN"])
            if (file) {
                lotTransaction.uploadedFileFlags.hasSketchPlan = true
            } else {
                lotTransaction.uploadedFileFlags.hasSketchPlan = false

            }

        } else if (docType == "DENR_SKETCH_PLAN") {
            def file = uploadedFilesRepository.findByDocTypes(lotTransactionId, ["DENR_SKETCH_PLAN"])
            if (file) {
                lotTransaction.uploadedFileFlags.hasDenrSketchPlan = true
            } else {
                lotTransaction.uploadedFileFlags.hasDenrSketchPlan = false

            }
            lotTransactionRepository.save(lotTransaction)
        }
    }

    Boolean checkRequiredFiles(
            UUID lotTransactionId,
            String activityType

    ) {
        if (activityType == "TRANSMIT_LDC_AND_CAD_MAP") {
            def LDC = uploadedFilesRepository.findByDocTypes(lotTransactionId, ["LDC"])
            def CAD = uploadedFilesRepository.findByDocTypes(lotTransactionId, ["CAD_MAP"])

            if (LDC && CAD) {
                return true
            }
            else {
                return false
            }

        } else if (activityType == "TRANSMIT_SKETCH_PLAN") {
            def SKETCH_PLAN = uploadedFilesRepository.findByDocTypes(lotTransactionId, ["SKETCH_PLAN"])

            if (SKETCH_PLAN) {
                return true
            }
            else {
                return false
            }

        } else if (activityType == "TRANSMIT_DENR_SKETCH_PLAN") {
            def DENR_SKETCH_PLAN = uploadedFilesRepository.findByDocTypes(lotTransactionId, ["DENR_SKETCH_PLAN"])

            if (DENR_SKETCH_PLAN) {
                return true
            }
            else {
                return false
            }

        } else if (activityType == "TRANSMIT_BL_PLAN") {
            def BL_PLAN = uploadedFilesRepository.findByDocTypes(lotTransactionId, ["BL_PLAN"])

            if (BL_PLAN) {
                return true
            }
            else {
                return false
            }
        }

    }
}


