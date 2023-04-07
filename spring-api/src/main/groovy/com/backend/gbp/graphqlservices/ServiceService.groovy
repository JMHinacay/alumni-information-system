package com.backend.gbp.graphqlservices


import com.backend.gbp.domain.Position
import com.backend.gbp.domain.Service
import com.backend.gbp.domain.ServiceStep
import com.backend.gbp.domain.SurveyTeamMember
import com.backend.gbp.domain.lot.Claimant
import com.backend.gbp.domain.lot.LotAreaInfo
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.ServiceRepository
import com.backend.gbp.repository.ServiceStepRepository
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
class ServiceService{

    @Autowired
    ServiceRepository serviceRepository

    @Autowired
    GeneratorService generatorService

    @Autowired
    ServiceStepRepository serviceStepRepository

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================

    @GraphQLQuery(name = "serviceList", description = "Get All Services")
    List<Service> findAll() {
        serviceRepository.findAll().sort { it.serviceName }//equivalent to select *
    }

    @GraphQLQuery(name = "serviceById", description = "Get Service By Id")
    Service findById(@GraphQLArgument(name = "id") UUID id) {//@GraphQLArgument come from graphql mismo
        return id ? serviceRepository.findById(id).get() : null
    }

    @GraphQLQuery(name = "serviceByFilter", description = "Search Service")
    List<Service> serviceRepository(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "type") String type
    ) {

        if(status != null && type != null){
            serviceRepository.serviceFilterStatusType(filter,status,type).sort { it.serviceName }
        }else if(status != null && type == null){
            serviceRepository.serviceFilterStatus(filter,status).sort { it.serviceName }
        }else if(status == null && type != null){
            serviceRepository.serviceFilterType(filter,type).sort { it.serviceName }
        }else{
            serviceRepository.serviceFilter(filter).sort { it.serviceName }
        }

    }


    @GraphQLQuery(name = "activeService", description = "Search Service Active")
    List<Service> activeServices() {
        serviceRepository.activeService().sort { it.serviceName }
        //sampleRepository.functionName().method
    }

    @GraphQLQuery(name = "mainService", description = "Search Service Type")
    List<Service> serviceFilterType() {
        serviceRepository.serviceFilterType("Main Services").sort { it.serviceName }
        //sampleRepository.functionName().method
    }

	//============== All Mutations ====================
    @GraphQLMutation(name = "upsertService")
    @Transactional
    Service upsertService(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "steps") List<Map<String, Object>> steps

    ) {
        Service service = new Service()
        def obj = objectMapper.convertValue(fields, Service.class)
        if(id){
            service = serviceRepository.findById(id).get()
            service.serviceSteps.clear()

        }
        def stepsTemp = steps as List<ServiceStep>

        List<ServiceStep> serviceSteps = new ArrayList<ServiceStep>()

        stepsTemp.each {
            ServiceStep step = new ServiceStep()
            step.stepNo = it.stepNo
            step.step = it.step
            step.service = service
            step.isEndOfSteps = it.isEndOfSteps
            serviceSteps.add(step)
            if(it.isEndOfSteps == true){
                service.lastStep = it.step
            }
        }

        service.serviceName = obj.serviceName
        service.serviceCost = obj.serviceCost
        service.excessCornerCost = obj.excessCornerCost
        service.excessHectareCost = obj.excessHectareCost
        service.allowMultipleLot = obj.allowMultipleLot
        service.status = obj.status
        service.serviceType = obj.serviceType


        serviceStepRepository.saveAll(serviceSteps)
        serviceRepository.save(service)
    }


    @GraphQLMutation(name = "updateServiceStatus")
    @Transactional
    Service updateServiceStatus(
            @GraphQLArgument(name = "id") UUID id
    ) {
        Service service  = serviceRepository.findById(id).get()
        service.status = !service.status
        serviceRepository.save(service)
    }

}
