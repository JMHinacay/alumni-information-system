package com.backend.gbp.graphqlservices


import com.backend.gbp.domain.SurveyTeam
import com.backend.gbp.domain.UserActivity
import com.backend.gbp.domain.WeeklyUpdates
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.SurveyTeamRepository
import com.backend.gbp.repository.WeeklyUpdatesRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
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
class WeeklyUpdatesService {


    @Autowired
    GeneratorService generatorService


    @Autowired
    WeeklyUpdatesRepository weeklyUpdatesRepository

    @Autowired
    LotTransactionRepository lotTransactionRepository

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================
//        @GraphQLQuery(name = "findDuplicateSurveyTeam", description = "Get All Agents")
//        List<SurveyTeam> findDuplicateSurveyTeam(@GraphQLArgument(name = "id") UUID id) {
//        surveyTeamRepository.findBySurveyTeamMember(id)
//    }

    @GraphQLQuery(name = "weeklyUpdates", description = "Get All weekly updates")
    List<WeeklyUpdates> findAll() {
        weeklyUpdatesRepository.findAll().sort { it.createdDate }//equivalent to select *
    }

    @GraphQLQuery(name = "weeklyUpdatesByLotTransaction", description = "Get All weekly updates by lot Transaction")
    List<WeeklyUpdates> weeklyUpdatesByLotTransaction(@GraphQLArgument(name = "lotTransactionId") UUID lotTransactionId) {
        def weeklyUpdates = weeklyUpdatesRepository.findByLotTransactionId(lotTransactionId).sort { it.createdDate }.reverse()
        if (weeklyUpdates)
            return weeklyUpdates
        else return null
    }
//
//    @GraphQLQuery(name = "agentActive", description = "Get All Agents")
//    List<Agent> findActive() {
//        agentRepository.findActive().sort { it.agentName }//equivalent to select *
//    }
//
//    @GraphQLQuery(name = "agentById", description = "Get Agent By Id")
//    Agent findById(@GraphQLArgument(name = "id") UUID id) {//@GraphQLArgument come from graphql mismo
//        return id ? agentRepository.findById(id).get() : null
//    }
//
//    @GraphQLQuery(name = "agentByFilter", description = "Filter Agents")
//    List<Agent> findByFilterStatus(
//            @GraphQLArgument(name = "filter") String filter,
//            @GraphQLArgument(name = "status") Boolean status
//    ) {
//            if(status != null){
//                return agentRepository.agentByFilterStatus(filter,status).sort { it.agentName }
//
//            }
//            else {
//                return agentRepository.agentByFilter(filter).sort { it.agentName }
//
//            }
//    }


//    @GraphQLQuery(name = "agentByFilter", description = "Search Service")
//    List<Agent> agentByFilter(
//            @GraphQLArgument(name = "filter") String filter
//    ) {
//        if(filter){
//            return agentRepository.agentByFilter(filter).sort { it.agentName }
//        }
//        else {
//            agentRepository.findAll().sort { it.agentName }
//        }
//
//
//    }


    //============== All Mutations ====================
    @GraphQLMutation(name = "upsertWeeklyUpdate")
    @Transactional
    GraphQLRetVal<WeeklyUpdates> upsertWeeklyUpdate(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "lotTransactionId") UUID lotTransactionId,
            @GraphQLArgument(name = "remarks") String remarks,
            @GraphQLArgument(name = "employeeId") UUID employeeId


    ) {
        WeeklyUpdates weeklyUpdate = new WeeklyUpdates()
        if(id)
        {
            weeklyUpdate = weeklyUpdatesRepository.findById(id).get()
        }
        def employee = employeeRepository.findById(employeeId).get()

        weeklyUpdate.remarks = remarks
        weeklyUpdate.lotTransaction = lotTransactionRepository.findById(lotTransactionId).get()
        weeklyUpdate.user = employee.user

        weeklyUpdatesRepository.save(weeklyUpdate)


        return new GraphQLRetVal<WeeklyUpdates>(weeklyUpdate, true, "Changes Saved")
    }
}