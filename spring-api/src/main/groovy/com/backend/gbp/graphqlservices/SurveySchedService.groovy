package com.backend.gbp.graphqlservices


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.ServiceStep
import com.backend.gbp.domain.SurveySched
import com.backend.gbp.domain.SurveyTeam
import com.backend.gbp.domain.SurveyTeamMember
import com.backend.gbp.domain.lot.LotTransaction
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.ServiceRepository
import com.backend.gbp.repository.ServiceStepRepository
import com.backend.gbp.repository.SurveySchedRepository
import com.backend.gbp.repository.SurveyTeamMemberRepository
import com.backend.gbp.repository.SurveyTeamRepository
import com.backend.gbp.repository.lot.LotTransactionRepository
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.time.Instant

@TypeChecked
@Component
@GraphQLApi
class SurveySchedService extends AbstractDaoService<SurveySched> {

    SurveySchedService() {
        super(SurveySched.class)
    }

    @Autowired
    ServiceRepository serviceRepository

    @Autowired
    SurveyTeamRepository surveyTeamRepository

    @Autowired
    SurveyTeamMemberRepository surveyTeamMemberRepository

    @Autowired
    SurveySchedRepository surveySchedRepository

    @Autowired
    LotTransactionRepository lotTransactionRepository

    @Autowired
    GeneratorService generatorService

    @Autowired
    ServiceStepRepository serviceStepRepository

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================

    @GraphQLQuery(name = "surveySchedByFilter", description = "Get Survey Schedule by Filter")
    Page<SurveySched> surveySchedByFilter(
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "startDate") String startDate,
            @GraphQLArgument(name = "endDate") String endDate,
            @GraphQLArgument(name = "service") UUID service,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {


        String query = "Select a from SurveySched a where 1 = 1 "
        String countQuery = "Select count(a) from SurveySched a where 1 = 1 "
        Map<String, Object> params = new HashMap<>()


        if (status) {
            query += ''' and a.status = :status'''
            countQuery += ''' and a.status = :status'''

            params.put('status', status)

        }


        if (service != null) {
            query += ''' and a.service.id = :service'''
            countQuery += ''' and a.service.id = :service'''
            params.put('service', service)
        }

        if (startDate != null && endDate != null) {
            query += ''' and to_date(to_char(a.createdDate, 'YYYY-MM-DD'),'YYYY-MM-DD')	between to_date(:startDate,'YYYY-MM-DD')'''
            countQuery += ''' and to_date(to_char(a.createdDate, 'YYYY-MM-DD'),'YYYY-MM-DD')	between to_date(:startDate,'YYYY-MM-DD') '''
            query += '''   and  to_date(:endDate,'YYYY-MM-DD')'''
            countQuery += ''' and  to_date(:endDate,'YYYY-MM-DD') '''
            params.put('startDate', startDate)
            params.put('endDate', endDate)
        }

//        query += '''   ORDER BY a.createdDate desc '''
//        countQuery += '''   ORDER BY a.createdDate desc '''

        getPageable(query, countQuery, page, size, params)//equivalent to select *
    }

    @GraphQLQuery(name = "surveySchedByLotTransaction", description = "Get Survey Schedule by lotTransction ID")
    List<SurveySched> surveySchedByLotTransaction(
            @GraphQLArgument(name = "lotTransactionId") UUID lotTransactionId) {
        surveySchedRepository.findByLotTransactionId(lotTransactionId).sort { it.createdDate }.reverse()
//equivalent to select *
    }

//    @GraphQLQuery(name = "checkSurveySchedConflict", description = "Check if surveyteam has a conflicting survey sched")
//    List<SurveySched> checkSurveySchedConflict(
//            @GraphQLArgument(name = "surveyTeamMemberId") UUID surveyTeamMemberId) {
//        surveySchedRepository.findConflict(lotTransactionId).sort { it.createdDate }//equivalent to select *
//    }

    @GraphQLQuery(name = "findSurveySchedConflict", description = "Get Survey Schedule by survey Team memeber ID")
    List<SurveySched> findSurveySchedConflict(
            @GraphQLArgument(name = "surveyTeamMemberId") UUID id,
            @GraphQLArgument(name = "date") Instant date) {
        List<SurveyTeam> surveyTeams = surveyTeamRepository.findBySurveyTeamMember(id).sort { it.createdDate }
        List<SurveySched> surveySchedList = new ArrayList<SurveySched>()

        surveyTeams.each {
            if (it.surveySched.surveyDateStart == date
                    && it.surveySched.status == "FOR_SURVEY"
            ) {
                SurveySched surveySched = it.surveySched
                surveySchedList.add(surveySched)
            }


        }
        return surveySchedList
    }


    @GraphQLQuery(name = "surveySchedBySurveyTeamMember", description = "Get Survey Schedule by survey Team memeber ID")
    List<SurveySched> surveySchedBySurveyTeamMember(
            @GraphQLArgument(name = "id") UUID id) {
        List<SurveyTeam> surveyTeams = surveyTeamRepository.findBySurveyTeamMember(id).sort { it.createdDate }
        List<SurveySched> surveySchedList = new ArrayList<SurveySched>()

        surveyTeams.each {
            SurveySched surveySched = it.surveySched
            surveySchedList.add(surveySched)

        }
        return surveySchedList
    }
    //============== All Mutations ====================
    @GraphQLMutation(name = "upsertSurveySched")
    @Transactional
    SurveySched upsertSurveySched(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "surveyDateStart") Instant surveyDateStart,
            @GraphQLArgument(name = "surveyDateEnd") Instant surveyDateEnd,
            @GraphQLArgument(name = "surveyTeamIds") List<UUID> surveyTeamIds,
            @GraphQLArgument(name = "lotTransactionId") UUID lotTransactionId,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "surveyRemarks") String surveyRemarks


    ) {
        SurveySched surveySched = new SurveySched()
        if (id) {
            surveySched = surveySchedRepository.findById(id).get()
            if (status == "SURVEYED") {
                surveySched.surveyDateEnd = surveyDateEnd

                surveySched.surveyRemarks = surveyRemarks

            } else {
                surveySched.surveyTeams.clear()

            }

        } else {
            surveySched.surveyDateStart = surveyDateStart
            surveySched.lotTransaction = lotTransactionRepository.findById(lotTransactionId).get()


        }
        surveySched.status = status


        List<SurveyTeam> surveyTeams = new ArrayList<SurveyTeam>()
        surveyTeamIds.each {
            SurveyTeam person = new SurveyTeam()
            person.surveyTeamMember = surveyTeamMemberRepository.findById(it).get()
            person.surveySched = surveySched
            surveyTeams.add(person)
        }

        surveySchedRepository.save(surveySched)

        surveyTeamRepository.saveAll(surveyTeams)

        return surveySched;
    }

}
