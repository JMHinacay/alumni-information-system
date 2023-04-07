package com.backend.gbp.graphqlservices


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.ServiceStep
import com.backend.gbp.domain.UploadedFiles
import com.backend.gbp.domain.User
import com.backend.gbp.domain.UserActivity
import com.backend.gbp.domain.enums.UserActivityStatus
import com.backend.gbp.domain.enums.LotTransactionStatus

import com.backend.gbp.domain.enums.UserActivityType
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.lot.LotAreaInfo
import com.backend.gbp.domain.lot.LotTransaction
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.ServiceRepository
import com.backend.gbp.repository.ServiceStepRepository
import com.backend.gbp.repository.UploadedFilesRepository
import com.backend.gbp.repository.UserActivityRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.lot.LotAreaInfoRepository
import com.backend.gbp.repository.lot.LotTransactionRepository
import com.backend.gbp.rest.dto.UserActivityTabDto
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

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.transaction.Transactional

@TypeChecked
@Component
@GraphQLApi
class UserActivityService extends AbstractDaoService<UserActivity> {
    UserActivityService() {
        super(UserActivity.class)
    }
    @Autowired
    ServiceRepository serviceRepository

    @Autowired
    GeneratorService generatorService

    @Autowired
    ServiceStepRepository serviceStepRepository

    @Autowired
    LotAreaInfoRepository lotAreaInfoRepository

    @Autowired
    LotTransactionRepository lotTransactionRepository

    @Autowired
    UserActivityRepository userActivityRepository

    @Autowired
    UploadedFilesService uploadedFilesService

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager


    //============== All Queries ====================

//    @GraphQLQuery(name = "serviceList", description = "Get All Services")
//    List<Service> findAll() {
//        serviceRepository.findAll().sort { it.serviceName }//equivalent to select *
//    }
//


    @GraphQLQuery(name = "userActivityById", description = "Get Position By Id")
    UserActivity findById(@GraphQLArgument(name = "id") UUID id) {
        return id ? userActivityRepository.findById(id).get() : null
    }

    @GraphQLQuery(name = "userActivityByLotTransactionId", description = "Get Position By Id")
    List<UserActivity> userActivityByLotTransactionId(@GraphQLArgument(name = "lotTransactionId") UUID id) {
        return id ? userActivityRepository.findByLotTransactionId(id).sort { it.createdDate }.reverse() : null
    }


    @GraphQLQuery(name = "userActivityByFilter", description = "Get User Activity By Filter")
    Page<UserActivity> userActivityByFilter(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "service") UUID service,
            @GraphQLArgument(name = "startDate") String startDate,
            @GraphQLArgument(name = "endDate") String endDate,
            @GraphQLArgument(name = "province") UUID province,
            @GraphQLArgument(name = "city") UUID city,
            @GraphQLArgument(name = "barangay") UUID barangay,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "activityType") String activityType,
            @GraphQLArgument(name = "isPending") Boolean isPending,
            @GraphQLArgument(name = "userId") Long userId
    ) {


        String query = "Select a from UserActivity a where 1 = 1"
        String countQuery = "Select count(a) from UserActivity a where 1 = 1 "

        Map<String, Object> params = new HashMap<>()
        if (userId) {
            query += ''' and a.user.id = :userId '''
            countQuery += ''' and a.user.id = :userId '''
            params.put('userId', userId)
        }

        if (filter != null) {
//            List<UUID> lotInfoIds = lotAreaInfoRepository.getLotInfoIdsByFilter(filter)
//
//            query += ''' and a.lotTransaction.lotInfo.id in :lotInfoIds'''
//            countQuery += ''' and a.lotTransaction.lotInfo.id in :lotInfoIds'''
//            params.put('lotInfoIds', lotInfoIds)


            List<UUID> lotInfoIds = lotAreaInfoRepository.getLotInfoIdsByFilter(filter)
            List<UUID> lotInfoIds2 = lotTransactionRepository.getLotInfoIdsFilterByTransactionId(filter)

            lotInfoIds2.addAll(lotInfoIds)
            lotInfoIds2 = lotInfoIds2.unique()
            query += ''' and a.lotTransaction.lotInfo.id in :lotInfoIds'''
            countQuery += ''' and a.lotTransaction.lotInfo.id in :lotInfoIds'''
            params.put('lotInfoIds', lotInfoIds2)
        }

        if (activityType != null) {
            query += ''' and a.activityType = :activityType'''
            countQuery += ''' and a.activityType = :activityType'''
            params.put('activityType', activityType)
        }

        if (isPending == true) {
            query += ''' and a.isPending = true'''
            countQuery += ''' and a.isPending = true'''
        }

        if (status != null) {
            query += ''' and a.status = :status'''
            countQuery += ''' and a.status = :status'''
            params.put('status', status)
        }

        if (service != null) {
            query += ''' and a.lotTransaction.service.id = :service'''
            countQuery += ''' and a.lotTransaction.service.id = :service'''
            params.put('service', service)
        }

        if (startDate != null && endDate != null) {


            query += ''' and to_date(to_char(a.lotTransaction.createdDate, 'YYYY-MM-DD'),'YYYY-MM-DD')	between to_date(:startDate,'YYYY-MM-DD')'''
            countQuery += ''' and to_date(to_char(a.lotTransaction.createdDate, 'YYYY-MM-DD'),'YYYY-MM-DD')	between to_date(:startDate,'YYYY-MM-DD') '''
            query += '''   and  to_date(:endDate,'YYYY-MM-DD')'''
            countQuery += ''' and  to_date(:endDate,'YYYY-MM-DD') '''
            params.put('startDate', startDate)
            params.put('endDate', endDate)

        }

        if (province != null) {

            if (city != null) {

                if (barangay != null) {
                    query += ''' and a.lotTransaction.lotInfo.barangay.id = :barangay'''
                    countQuery += ''' and a.lotTransaction.lotInfo.barangay.id = :barangay'''
                    params.put('barangay', barangay)
                } else {
                    query += ''' and a.lotTransaction.lotInfo.city.id = :city'''
                    countQuery += ''' and a.lotTransaction.lotInfo.city.id = :city'''
                    params.put('city', city)
                }

            } else {
                query += ''' and a.lotTransaction.lotInfo.province.id = :province'''
                countQuery += ''' and a.lotTransaction.lotInfo.province.id = :province'''
                params.put('province', province)
            }
        }
        query += ''' group by a.id order by a.createdDate desc'''
        countQuery += ''' group by a.id order by a.createdDate desc'''

        Page<UserActivity> res = getPageable(query, countQuery, page, size, params)
        if (res) {
            return res
        } else {
            return null
        }
    }


    //============== All Mutations ====================
    @GraphQLMutation(name = "upsertUserActivity")
    @Transactional
    GraphQLRetVal<UserActivity> upsertUserActivity(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "nextStep") String nextStep,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "forwardedBy") String forwardedBy,

            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "lotTransactionId") UUID lotTransactionId,
            @GraphQLArgument(name = "isOverride") Boolean isOverride,

            @GraphQLArgument(name = "isPending") Boolean isPending,
            @GraphQLArgument(name = "pendingType") String pendingType,
            @GraphQLArgument(name = "remarks") String remarks


    ) {


        if (nextStep) {
//            LotTransaction lotTransaction = entityManager.createQuery("""
//                Select lt from LotTransaction lt
//                where lt.id = :id
//            """, LotTransaction.class).setParameter("id", lotTransactionId)
//                    .singleResult


//            Employee employee = entityManager.createQuery("""
//                Select e from Employee e
//                where e.id = :id
//            """, Employee.class).setParameter("id", employeeId)
//                    .singleResult


//            UserActivity userActivityOld = entityManager.createQuery("""
//                Select ua from UserActivity ua
//                where ua.id = :id
//            """, UserActivity.class).setParameter("id", id)
//                    .singleResult
            LotTransaction lotTransaction = lotTransactionRepository.findById(lotTransactionId).get()
            Employee employee = employeeRepository.findById(employeeId).get()
            UserActivity userActivityOld = userActivityRepository.findById(id).get()

            if (userActivityOld.activityType == "TRANSMIT_SKETCH_PLAN" || //check if userActivity involves file uploads
                    "TRANSMIT_DENR_SKETCH_PLAN" ||
                    "TRANSMIT_BL_PLAN" ||
                    "TRANSMIT_LDC_AND_CAD_MAP") {

                //check if required files exists
                def result = uploadedFilesService.checkRequiredFiles(lotTransactionId, userActivityOld.activityType)
                if (result == false) {
                    return new GraphQLRetVal<UserActivity>(null, false, "Failed to save changes.")
                }

            }

            if (userActivityOld.activityType == "APPROVE_LOT_TRANSACTION") {// if act. type is approve lot transaction
                lotTransaction.status = LotTransactionStatus.PROCESSING//set lot transaction status to processing
                userActivityOld.status = UserActivityStatus.APPROVED
            } else {// if activity type is normal types


                if (status == "REROUTE") {
                    userActivityOld.status = UserActivityStatus.REROUTED
                } else {
                    userActivityOld.status = UserActivityStatus.TRANSMITTED
                }
            }
            userActivityRepository.save(userActivityOld)


            //create new userActivity for the next step

            UserActivity userActivity = new UserActivity()
            userActivity.activityType = nextStep
            userActivity.lotTransaction = lotTransaction
            userActivity.forwardedBy = forwardedBy
            userActivity.user = employee.user
            userActivity.status = UserActivityStatus.FOR_TRANSMISSION
            userActivity.isOverride = isOverride


            if(nextStep == lotTransaction.lastStep)
            {
                userActivity.status = UserActivityStatus.FINAL_STEP
                lotTransaction.status = LotTransactionStatus.READY_FOR_COMPLETION
            }else{
                userActivity.status = UserActivityStatus.FOR_TRANSMISSION
            }

            lotTransactionRepository.save(lotTransaction)
            userActivity = userActivityRepository.save(userActivity)
            return new GraphQLRetVal<UserActivity>(userActivity, true, "Changes Saved")
        } else {
//            UserActivity userActivity = entityManager.createQuery("""
//                Select ua from UserActivity ua
//                where ua.id = :id
//            """, UserActivity.class).setParameter("id", id)
//                    .singleResult
            UserActivity userActivity = userActivityRepository.findById(id).get()

//            userActivity.activityType = nextStep
            if (isPending == true) {
                userActivity.isPending = isPending
                userActivity.pendingBy = forwardedBy
                userActivity.status = UserActivityStatus.PENDING
                userActivity.pendingType = pendingType
                userActivity.remarks = remarks
            }
            userActivity.isOverride = isOverride

            return new GraphQLRetVal<UserActivity>(userActivity, true, "Changes Saved")
        }


    }


    @GraphQLMutation(name = "updateTrackingNo")
    @Transactional
    GraphQLRetVal<UserActivity> updateTrackingNo(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "trackingNo") String trackingNo
    ) {

        def userActivity = userActivityRepository.findById(id).get()
        userActivity.denrTrackingNo = trackingNo
        userActivityRepository.save(userActivity)
        return new GraphQLRetVal<UserActivity>(userActivity, true, "Changes Saved")


    }

    @GraphQLMutation(name = "forwardMultipleActivities")
    @Transactional
    GraphQLRetVal<String> forwardMultipleActivities(
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "userActivityIds") List<UUID> userActivityIds
    ) {

        Employee employee = employeeRepository.findById(employeeId).get()

        userActivityIds.each {
            UserActivity userActivity = userActivityRepository.findById(it).get()
            userActivity.user = employee.user
            userActivityRepository.save(userActivity)

        }
        return new GraphQLRetVal<String>("Success", true, "Changes Saved")


    }


}
