package com.backend.gbp.graphqlservices

import com.backend.gbp.domain.Office
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@TypeChecked
@Component
@GraphQLApi
class OfficeService {

    @Autowired
    private OfficeRepository officeRepository

    @Autowired
    GeneratorService generatorService

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================

    @GraphQLQuery(name = "officesList", description = "Get All Offices")
    List<Office> findAll() {
        officeRepository.findAll().sort { it.officeCode }
    }

    @GraphQLQuery(name = "activeOffices", description = "Get All Offices Active")
    List<Office> activeOffices() {
        officeRepository.activeOffices().sort { it.officeCode }
    }

    @GraphQLQuery(name = "officeListByFilter", description = "Search Offices")
    List<Office> officeListByFilter(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        if(status != null){
            officeRepository.officeListByFilterStatus(filter,status).sort { it.officeCode }
        }else{
            officeRepository.officeListByFilter(filter).sort { it.officeCode }
        }

    }

    @GraphQLQuery(name = "officeById", description = "Get Office By Id")
    Office findById(@GraphQLArgument(name = "id") UUID id) {
        if(id)
        {
          return  officeRepository.findById(id).get()
        }
        else{
            return null
        }
//        return id ? officeRepository.findById(id).get() : null
    }

	//============== All Mutations ====================

    @GraphQLMutation(name = "upsertOffice")
    @Transactional
    Office upsertOffice(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        Office op = new Office()
        def obj = objectMapper.convertValue(fields, Office.class)
        if(id){
            op = officeRepository.findById(id).get()
        }
        if(!id){
            op.officeCode = "OFFICE" + generatorService.getNextValue(GeneratorType.OFFICE) { Long no ->
                StringUtils.leftPad(no.toString(), 6, "0")
            } //indicate another variable in generatorType in another table
            //example GeneratorType.OFFICE for office then GeneratorType.VARIABLE for auto increment
        }
        op.officeDescription = obj.officeDescription
        op.officeType = obj.officeType
        op.telNo = obj.telNo
        op.phoneNo = obj.phoneNo
        op.emailAdd = obj.emailAdd
        op.officeCountry = obj.officeCountry
        op.officeProvince = obj.officeProvince
        op.officeMunicipality = obj.officeMunicipality
        op.officeBarangay = obj.officeBarangay
        op.officeStreet = obj.officeStreet
        op.officeZipcode = obj.officeZipcode
        op.status = obj.status

        officeRepository.save(op)
    }

}
