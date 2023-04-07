package com.backend.gbp.graphqlservices

import com.backend.gbp.domain.Agent
import com.backend.gbp.domain.SurveyTeam
import com.backend.gbp.repository.AgentRepository
import com.backend.gbp.repository.SurveyTeamRepository
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
class SurveyTeamService {

    @Autowired
    SurveyTeamRepository surveyTeamRepository


    @Autowired
    GeneratorService generatorService

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================
        @GraphQLQuery(name = "findDuplicateSurveyTeam", description = "Get All Agents")
        List<SurveyTeam> findDuplicateSurveyTeam(@GraphQLArgument(name = "id") UUID id) {
        surveyTeamRepository.findBySurveyTeamMember(id)
    }

//    @GraphQLQuery(name = "surveyTeamList", description = "Get All Agents")
//    List<Agent> findAll() {
//        surveyTeamRepository.findAll().sort { it.agentName }//equivalent to select *
//    }
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
//    @GraphQLMutation(name = "upsertAgent")
//    @Transactional
//     Agent upsertAgent(
//            @GraphQLArgument(name = "id") UUID id,
//            @GraphQLArgument(name = "fields") Map<String, Object> fields
//    ) {
//
//
//        Agent temp = new Agent()
//        def obj = objectMapper.convertValue(fields, Agent.class)
//        if(id){
//            temp = agentRepository.findById(id).get()
//        }
//        temp.agentName = obj.agentName
//        temp.agentOrganization = obj.agentOrganization
//        temp.status = obj.status
//
//        agentRepository.save(temp)
//    }

}
