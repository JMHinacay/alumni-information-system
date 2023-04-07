package com.backend.gbp.graphqlservices.lot


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.ServiceStep
import com.backend.gbp.domain.lot.Claimant
import com.backend.gbp.domain.lot.Map
import com.backend.gbp.repository.ServiceRepository
import com.backend.gbp.repository.ServiceStepRepository
import com.backend.gbp.repository.lot.LotAreaInfoRepository
import com.backend.gbp.repository.lot.MapRepository
import com.backend.gbp.rest.dto.LatLngDto
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@TypeChecked
@Component
@GraphQLApi
class MapService {

    @Autowired
    MapRepository mapRepository

    @Autowired
    LotAreaInfoRepository lotAreaInfoRepository

    @Autowired
    GeneratorService generatorService

    @Autowired
    ServiceStepRepository serviceStepRepository

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================

    @GraphQLQuery(name = "mapList", description = "Get All Services")
    List<Map> findAll() {
        mapRepository.findAll()
    }

//    @GraphQLQuery(name = "serviceById", description = "Get Service By Id")
//    Service findById(@GraphQLArgument(name = "id") UUID id) {//@GraphQLArgument come from graphql mismo
//        return id ? serviceRepository.findById(id).get() : null
//    }
//
//    @GraphQLQuery(name = "serviceByFilter", description = "Search Service")
//    List<Service> serviceRepository(
//            @GraphQLArgument(name = "filter") String filter,
//            @GraphQLArgument(name = "status") Boolean status,
//            @GraphQLArgument(name = "type") String type
//    ) {
//
//        if(status != null && type != null){
//            serviceRepository.serviceFilterStatusType(filter,status,type).sort { it.serviceName }
//        }else if(status != null && type == null){
//            serviceRepository.serviceFilterStatus(filter,status).sort { it.serviceName }
//        }else if(status == null && type != null){
//            serviceRepository.serviceFilterType(filter,type).sort { it.serviceName }
//        }else{
//            serviceRepository.serviceFilter(filter).sort { it.serviceName }
//        }
//
//    }
//
//
//    @GraphQLQuery(name = "activeService", description = "Search Service Active")
//    List<Service> activeServices() {
//        serviceRepository.activeService().sort { it.serviceName }
//        //sampleRepository.functionName().method
//    }
//
//    @GraphQLQuery(name = "mainService", description = "Search Service Type")
//    List<Service> serviceFilterType() {
//        serviceRepository.serviceFilterType("Main Services").sort { it.serviceName }
//        //sampleRepository.functionName().method
//    }

	//============== All Mutations ====================
    @GraphQLMutation(name = "upsertMap")
    @Transactional
    Map upsertMap(
            @GraphQLArgument(name = "id") UUID id,
//            @GraphQLArgument(name = "path") List<LatLngDto> path
            @GraphQLArgument(name = "path") ArrayList<java.util.Map<String, Object>> path,
            @GraphQLArgument(name = "lotAreaInfoId") UUID lotAreaInfoId


    ) {
        Map map = new Map()
        if(id){
            map = mapRepository.findById(id).get()

        }
        else{
            def lotAreaInfo =lotAreaInfoRepository.findById(lotAreaInfoId).get()
            map.lotInfo = lotAreaInfo.lotInfo
            map.lotAreaInfo = lotAreaInfo

        }

        def path2 = path as List<LatLngDto>


        map.path = path2
        map = mapRepository.save(map)
        return map
    }

}
