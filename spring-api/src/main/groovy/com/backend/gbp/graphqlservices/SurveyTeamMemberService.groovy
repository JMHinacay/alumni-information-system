package com.backend.gbp.graphqlservices

import com.backend.gbp.domain.Agent
import com.backend.gbp.domain.SurveyTeam
import com.backend.gbp.domain.SurveyTeamMember
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.repository.AgentRepository
import com.backend.gbp.repository.SurveyTeamMemberRepository
import com.backend.gbp.repository.SurveyTeamRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
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
class SurveyTeamMemberService {

    @Autowired
    SurveyTeamMemberRepository surveyTeamMemberRepository

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    GeneratorService generatorService

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================

    @GraphQLQuery(name = "surveyTeamMemberByFilter", description = "Filter Agents")
    List<SurveyTeamMember> findByFilterStatus(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status
    ) {
            if(status != null){
                return surveyTeamMemberRepository.surveyTeamMembersByFilterStatus(filter,status).sort { it.fullName }

            }
            else {
                return surveyTeamMemberRepository.surveyTeamMembersByFilter(filter).sort { it.fullName }

            }
    }





    //============== All Mutations ====================
    @GraphQLMutation(name = "upsertSurveyTeamMember")
    @Transactional
     SurveyTeamMember upsertSurveyTeamMember(
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "isActive") Boolean isActive

    ) {

        Employee employee = employeeRepository.findById(employeeId).get()
        SurveyTeamMember surveyTeamMember  = new SurveyTeamMember()
        surveyTeamMember.employee = employee
        surveyTeamMember.isActive = isActive

        surveyTeamMemberRepository.save(surveyTeamMember)
    }

    @GraphQLMutation(name = "updateSurveyTeamMemberStatus")
    @Transactional
    SurveyTeamMember updateSurveyTeamMemberStatus(
            @GraphQLArgument(name = "id") UUID id

    ) {
        SurveyTeamMember surveyTeamMember  = surveyTeamMemberRepository.findById(id).get()
        surveyTeamMember.isActive = !surveyTeamMember.isActive
        surveyTeamMemberRepository.save(surveyTeamMember)
    }

}
