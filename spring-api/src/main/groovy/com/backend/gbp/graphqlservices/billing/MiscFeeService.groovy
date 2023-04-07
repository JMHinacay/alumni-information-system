package com.backend.gbp.graphqlservices.billing

import com.backend.gbp.domain.Position
import com.backend.gbp.domain.Service
import com.backend.gbp.domain.SurveyTeam
import com.backend.gbp.domain.UserActivity
import com.backend.gbp.domain.billing.MiscFee
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.SurveyTeamRepository
import com.backend.gbp.repository.billing.MiscFeeRepository
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
class MiscFeeService {

    @Autowired
    MiscFeeRepository miscFeeRepository


    @Autowired
    GeneratorService generatorService

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================
//        @GraphQLQuery(name = "findDuplicateSurveyTeam", description = "Get All Agents")
//        List<SurveyTeam> findDuplicateSurveyTeam(@GraphQLArgument(name = "id") UUID id) {
//        surveyTeamRepository.findBySurveyTeamMember(id)
//    }

    @GraphQLQuery(name = "miscFeeList", description = "Get All misc fees")
    List<MiscFee> findAll() {
        miscFeeRepository.findAll().sort { it.createdDate }
    }

    @GraphQLQuery(name = "miscFeeActive", description = "Get All active misc fees")
    List<MiscFee> miscFeeActive() {
        miscFeeRepository.activeMiscFees(true).sort { it.createdDate }
    }

    @GraphQLQuery(name = "miscFeeByFilter", description = "search miscfee")
    List<MiscFee> miscFeeByFilter(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        if(status == null){
           return miscFeeRepository.miscByFeeFilter(filter).sort { it.description }
        }else{
            return miscFeeRepository.miscByFeeFilterStatus(filter, status).sort { it.description }
        }

    }


    //============== All Mutations ====================
    @GraphQLMutation(name = "upsertMiscFee")
   @Transactional
    GraphQLRetVal<MiscFee> upsertMiscFee(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "description") String description,
            @GraphQLArgument(name = "cost") BigDecimal cost,
            @GraphQLArgument(name = "status") Boolean status


    ) {
        def duplicates = miscFeeRepository.findDuplicateDescription(description)
        if(duplicates){
            return new GraphQLRetVal<MiscFee>(null, false, "Billing item description already exists.")
        }
        MiscFee miscFee = new MiscFee()
        if(id){
            miscFee = miscFeeRepository.findById(id).get()
        }
        miscFee.description = description
        miscFee.cost = cost
        miscFee.status = status


        miscFee = miscFeeRepository.save(miscFee)


        return new GraphQLRetVal<MiscFee>(miscFee, true, "Changes Saved")

    }


    @GraphQLMutation(name = "updateMiscFeeStatus")
    @Transactional
    MiscFee updateMiscFeeStatus(
            @GraphQLArgument(name = "id") UUID id
    ) {
        MiscFee miscFee  = miscFeeRepository.findById(id).get()
        miscFee.status = !miscFee.status
        miscFeeRepository.save(miscFee)
    }
}
