package com.backend.gbp.graphqlservices

import com.backend.gbp.domain.DenrUpdates
import com.backend.gbp.domain.WeeklyUpdates
import com.backend.gbp.domain.enums.DenrUpdateType
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.DenrUpdatesRepository
import com.backend.gbp.repository.UserActivityRepository
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
import java.time.Instant

@TypeChecked
@Component
@GraphQLApi
class DenrUpdatesService {


    @Autowired
    GeneratorService generatorService


    @Autowired
    UserActivityRepository userActivityRepository

    @Autowired
    LotTransactionRepository lotTransactionRepository

    @Autowired
    DenrUpdatesRepository denrUpdatesRepository


    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================
//        @GraphQLQuery(name = "findDuplicateSurveyTeam", description = "Get All Agents")
//        List<SurveyTeam> findDuplicateSurveyTeam(@GraphQLArgument(name = "id") UUID id) {
//        surveyTeamRepository.findBySurveyTeamMember(id)
//    }

//    @GraphQLQuery(name = "weeklyUpdates", description = "Get All weekly updates")
//    List<WeeklyUpdates> findAll() {
//        weeklyUpdatesRepository.findAll().sort { it.createdDate }//equivalent to select *
//    }

    @GraphQLQuery(name = "denrUpdatesByLotTransactionUpdateType", description = "Get All weekly updates by lot Transaction")
    List<DenrUpdates> denrUpdatesByLotTransactionUpdateType(
            @GraphQLArgument(name = "lotTransactionId") UUID lotTransactionId,
            @GraphQLArgument(name = "updateType") String updateType
    ) {
        def update = denrUpdatesRepository.findByLotTransactionIdUpdateType(lotTransactionId, updateType).sort { it.createdDate }.reverse()
        if (update)
            return update
        else return null
    }



    //============== All Mutations ====================
    @GraphQLMutation(name = "upsertDenrUpdate")
    @Transactional
    GraphQLRetVal<DenrUpdates> upsertDenrUpdate(
            @GraphQLArgument(name = "lotTransactionId") UUID lotTransactionId,
            @GraphQLArgument(name = "userActivityId") UUID userActivityId,

            @GraphQLArgument(name = "currentlyHandledBy") String currentlyHandledBy,
            @GraphQLArgument(name = "updateType") String updateType,
//            @GraphQLArgument(name = "date") Instant date,

            @GraphQLArgument(name = "currentUnit") String currentUnit,
            @GraphQLArgument(name = "remarks") String remarks,
            @GraphQLArgument(name = "status") String status



    ) {
        DenrUpdates denrUpdates = new DenrUpdates()


        denrUpdates.lotTransaction = lotTransactionRepository.findById(lotTransactionId).get()
        denrUpdates.currentUnit = currentUnit
        denrUpdates.updateType = updateType
//        denrUpdates.date = date

        if(status){
            denrUpdates.status = status
        }
        if(remarks){
            denrUpdates.remarks = remarks
        }
        if(currentlyHandledBy){
            denrUpdates.currentlyHandledBy = currentlyHandledBy
        }

        denrUpdatesRepository.save(denrUpdates)
        if(userActivityId){
            def userActivity = userActivityRepository.findById(userActivityId).get()
            if(updateType == "LOT_STATUS"){
                userActivity.lotStatus=currentUnit
            }else  if(updateType == "LAND_STATUS"){
                userActivity.landStatus=currentUnit
            }else  if(updateType == "DENR_REGION_UPDATE"){
                userActivity.denrUpdateStatus=status
            }
            userActivityRepository.save(userActivity)
        }



        return new GraphQLRetVal<DenrUpdates>(denrUpdates, true, "Changes Saved")
    }
}