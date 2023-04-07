package com.backend.gbp.graphqlservices.lot


import com.backend.gbp.domain.lot.LotAreaInfo
import com.backend.gbp.domain.lot.LotInfo
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.lot.LotAreaInfoRepository
import com.backend.gbp.repository.lot.LotInfoRepository
import com.backend.gbp.repository.lot.MapRepository
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
class LotAreaInfoService {


    @Autowired
    LotAreaInfoRepository lotAreaInfoRepository

    @Autowired
    LotInfoRepository lotInfoRepository

    @Autowired
    MapRepository mapRepository


    @Autowired
    GeneratorService generatorService


    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================

    @GraphQLQuery(name = "lotAreaList", description = "Get All Services")
    List<LotAreaInfo> findAll() {
        lotAreaInfoRepository.findAll().sort { it.createdDate }//equivalent to select *
    }

    @GraphQLQuery(name = "lotAreaInfoByLotNo", description = "Get All Services")
    List<LotAreaInfo> lotAreaInfoByLotNo( @GraphQLArgument(name = "filter") String filter) {
        if(filter){
            lotAreaInfoRepository.getByLotNoFilter(filter).sort { it.createdDate}//equivalent to select *

        }
        else{
            lotAreaInfoRepository.findAll().sort { it.createdDate }
        }
    }
//
//    @GraphQLQuery(name = "serviceById", description = "Get Service By Id")
//    Service findById(@GraphQLArgument(name = "id") UUID id) {//@GraphQLArgument come from graphql mismo
//        return id ? serviceRepository.findById(id).get() : null
//    }


    //============== All Mutations ====================
    @GraphQLMutation(name = "upsertLotAreaInfo")
    @Transactional
    GraphQLRetVal<LotAreaInfo> upsertLotAreaInfo(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "lotInfoId") UUID lotInfoId,
            @GraphQLArgument(name = "fields") Map<String, Object> fields

    ) {
        LotAreaInfo lotAreaInfo = new LotAreaInfo()
        if (id) {
            lotAreaInfo = lotAreaInfoRepository.findById(id).get()
        } else {
            lotAreaInfo.lotInfo = lotInfoRepository.findById(lotInfoId).get()
        }
        def obj = objectMapper.convertValue(fields, LotAreaInfo.class)

        lotAreaInfo.lotNo = obj.lotNo
        lotAreaInfo.surveyNo = obj.surveyNo
        lotAreaInfo.lotAreaSize = obj.lotAreaSize

        lotAreaInfoRepository.save(lotAreaInfo)
        return new GraphQLRetVal<LotAreaInfo>(lotAreaInfo, true, "Changes Saved")

    }

    @GraphQLMutation(name = "deleteLotAreaInfo")
    @Transactional
    GraphQLRetVal<LotAreaInfo> deleteLotAreaInfo(
            @GraphQLArgument(name = "id") UUID id


    ) {
        if (id) {
            LotAreaInfo lotAreaInfo = lotAreaInfoRepository.findById(id).get()

            lotAreaInfoRepository.deleteById(id)
            if (lotAreaInfo.map) {
                mapRepository.deleteById(lotAreaInfo.map.id)

            }

            return new GraphQLRetVal<LotAreaInfo>(lotAreaInfo, true, "Lot Area Information Deleted")
        } else {
            return new GraphQLRetVal<LotAreaInfo>(null, false, "Failed to save Changes")

        }

    }

}
