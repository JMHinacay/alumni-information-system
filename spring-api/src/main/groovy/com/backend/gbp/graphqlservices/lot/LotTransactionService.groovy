package com.backend.gbp.graphqlservices.lot

import com.backend.gbp.domain.Jurisdiction
import com.backend.gbp.domain.Position
import com.backend.gbp.domain.SurveySched
import com.backend.gbp.domain.SurveyTeam
import com.backend.gbp.domain.UploadedFiles
import com.backend.gbp.domain.User
import com.backend.gbp.domain.UserActivity
import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.billing.BillingItem
import com.backend.gbp.domain.enums.LotTransactionStatus
import com.backend.gbp.domain.enums.UserActivityStatus
import com.backend.gbp.domain.enums.UserActivityType
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.lot.Claimant
import com.backend.gbp.domain.lot.LotAreaInfo
import com.backend.gbp.domain.lot.LotInfo
import com.backend.gbp.domain.lot.LotTransaction
import com.backend.gbp.graphqlservices.SurveySchedService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.JurisdictionRepository
import com.backend.gbp.repository.PositionRepository
import com.backend.gbp.repository.ServiceRepository
import com.backend.gbp.repository.SurveySchedRepository
import com.backend.gbp.repository.SurveyTeamMemberRepository
import com.backend.gbp.repository.SurveyTeamRepository
import com.backend.gbp.repository.UserActivityRepository
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.billing.BillingItemRepository
import com.backend.gbp.repository.billing.BillingRepository
import com.backend.gbp.repository.lot.ClaimantRepository
import com.backend.gbp.repository.lot.LotAreaInfoRepository
import com.backend.gbp.repository.lot.LotInfoRepository
import com.backend.gbp.repository.lot.LotTransactionRepository
import com.backend.gbp.rest.dto.UploadFilesDto
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLContext
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import net.bytebuddy.implementation.bytecode.collection.ArrayAccess
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Component
import com.backend.gbp.graphqlservices.base.AbstractDaoService

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.transaction.Transactional
import java.time.Instant

@TypeChecked
@Component
@GraphQLApi
class LotTransactionService extends AbstractDaoService<LotTransaction> {

    LotTransactionService() {
        super(LotTransaction.class)
    }
    @Autowired
    PositionRepository positionRepository

    @Autowired
    LotInfoRepository lotInfoRepository

    @Autowired
    LotAreaInfoRepository lotAreaInfoRepository

    @Autowired
    LotTransactionRepository lotTransactionRepository

    @Autowired
    ClaimantRepository claimantRepository

    @Autowired
    UserActivityRepository userActivityRepository

    @Autowired
    UserRepository userRepository

    @Autowired
    SurveySchedRepository surveySchedRepository

    @Autowired
    SurveyTeamRepository surveyTeamRepository

    @Autowired
    SurveyTeamMemberRepository surveyTeamMemberRepository

    @Autowired
    JurisdictionRepository jurisdictionRepository

    @Autowired
    BillingRepository billingRepository

    @Autowired
    BillingItemRepository billingItemRepository

    @Autowired
    ServiceRepository serviceRepository

    @Autowired
    GeneratorService generatorService

    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager


//============== All Queries ====================


    @GraphQLQuery(name = "lotTransaction", description = "Get All Lot Transaction")
    List<LotTransaction> findAll() {
        lotTransactionRepository.findAll().sort { it.createdDate }
    }

    @GraphQLQuery(name = "getTransactionById", description = "Get Transaction by id")
    LotTransaction getTransactionById(@GraphQLArgument(name = "id") UUID id) {
        if(id){
            return findOne(id)
        }else{
            return null
        }
    }

    @GraphQLQuery(name = "lotTransactionByFilter", description = "Get All Lot Transaction")
    Page<LotTransaction> lotTransactionByFilter(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "service") UUID service,
            @GraphQLArgument(name = "startDate") String startDate,
            @GraphQLArgument(name = "endDate") String endDate,
            @GraphQLArgument(name = "province") UUID province,
            @GraphQLArgument(name = "city") UUID city,
            @GraphQLArgument(name = "barangay") UUID barangay,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {


        String query = "Select a from LotTransaction a where 1 = 1 "
        String countQuery = "Select count(a) from LotTransaction a where 1 = 1 "
        Map<String, Object> params = new HashMap<>()


        if (filter != null) {
            List<UUID> lotInfoIds = lotAreaInfoRepository.getLotInfoIdsByFilter(filter)
            List<UUID> lotInfoIds2 = lotTransactionRepository.getLotInfoIdsFilterByTransactionId(filter)

            lotInfoIds2.addAll(lotInfoIds)
            lotInfoIds2 = lotInfoIds2.unique()
            query += ''' and a.lotInfo.id in :lotInfoIds'''
            countQuery += ''' and a.lotInfo.id in :lotInfoIds'''
            params.put('lotInfoIds', lotInfoIds2)

        }

        if (status != null) {
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

        if (province != null) {

            if (city != null) {

                if (barangay != null) {
                    query += ''' and a.lotInfo.barangay.id = :barangay'''
                    countQuery += ''' and a.lotInfo.barangay.id = :barangay'''
                    params.put('barangay', barangay)
                } else {
                    query += ''' and a.lotInfo.city.id = :city'''
                    countQuery += ''' and a.lotInfo.city.id = :city'''
                    params.put('city', city)
                }

            } else {
                query += ''' and a.lotInfo.province.id = :province '''
                countQuery += ''' and a.lotInfo.province.id = :province '''
                params.put('province', province)
            }
        }
//        query += '''   ORDER BY a.createdDate desc '''
//        countQuery += '''   ORDER BY a.createdDate desc '''

        getPageable(query, countQuery, page, size, params)

    }



    @GraphQLQuery(name = "lotTransactionByFilterJurisdiction", description = "Get All Lot Transaction By Jurisdiction")
    Page<LotTransaction> lotTransactionByFilterJurisdiction(
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
            @GraphQLArgument(name = "officeId") UUID officeId

    ) {
        Map<String, Object> params = new HashMap<>()


        List<UUID> barangayIds = jurisdictionRepository.getBarangayIdsByOfficeId(officeId)

//        println(barangayIds)

        String query = "Select a from LotTransaction a where a.lotInfo.barangay.id in :barangayIds "
        String countQuery = "Select count(a) from LotTransaction a where a.lotInfo.barangay.id in :barangayIds "
        params.put('barangayIds', barangayIds)



        if (filter != null) {
            List<UUID> lotInfoIds = lotAreaInfoRepository.getLotInfoIdsByFilter(filter)
            List<UUID> lotInfoIds2 = lotTransactionRepository.getLotInfoIdsFilterByTransactionId(filter)

            lotInfoIds2.addAll(lotInfoIds)
            lotInfoIds2 = lotInfoIds2.unique()
            query += ''' and a.lotInfo.id in :lotInfoIds'''
            countQuery += ''' and a.lotInfo.id in :lotInfoIds'''
            params.put('lotInfoIds', lotInfoIds2)
        }

        if (status != null) {
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

        if (province != null) {

            if (city != null) {

                if (barangay != null) {
                    query += ''' and a.lotInfo.barangay.id = :barangay'''
                    countQuery += ''' and a.lotInfo.barangay.id = :barangay'''
                    params.put('barangay', barangay)
                } else {
                    query += ''' and a.lotInfo.city.id = :city'''
                    countQuery += ''' and a.lotInfo.city.id = :city'''
                    params.put('city', city)
                }

            } else {
                query += ''' and a.lotInfo.province.id = :province'''
                countQuery += ''' and a.lotInfo.province.id = :province'''
                params.put('province', province)
            }
        }
        getPageable(query, countQuery, page, size, params)

    }


    @GraphQLQuery(name = "lotTransactionById", description = "Get Position By Id")
    LotTransaction findById(@GraphQLArgument(name = "id") UUID id) {
        return id ? lotTransactionRepository.findById(id).get() : null
    }

    //============== All Mutations ====================
    @GraphQLMutation(name = "upsertLotTransaction")
    @Transactional
    LotTransaction upsertLotTransaction(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "lotTransaction") Map<String, Object> lotTransactionParam,
            @GraphQLArgument(name = "lotInfo") Map<String, Object> lotInfoParam,
            @GraphQLArgument(name = "claimant") ArrayList<Map<String, Object>> claimantParam,
            @GraphQLArgument(name = "lotArea") ArrayList<Map<String, Object>> lotAreaParam,
            @GraphQLArgument(name = "empId") UUID empId,
            @GraphQLArgument(name = "surveyDateStart") Instant surveyDateStart,
            @GraphQLArgument(name = "surveyTeamIds") List<UUID> surveyTeamIds



    ) {


        if (id) {

            LotTransaction lotTransaction = entityManager.createQuery("""
                Select lt from LotTransaction lt 
                where lt.id = :id
            """, LotTransaction.class).setParameter("id", id)
                    .singleResult

            lotTransaction = objectMapper.updateValue(lotTransaction, lotTransactionParam)

            LotInfo lotInfo = entityManager.createQuery("""
                Select li from LotInfo li 
                where li.id = :id
            """, LotInfo.class).setParameter("id", lotTransaction.lotInfo.id)
                    .singleResult

            lotInfo = objectMapper.updateValue(lotInfo, lotInfoParam)
            lotInfoRepository.save(lotInfo)
//================================================================================================


            lotTransaction.lotInfo = objectMapper.updateValue(lotTransaction.lotInfo, lotInfoParam)

//            lotTransaction.lotInfo.lotAreaInfos.clear()
            lotTransaction.claimants.clear()


//            def lotAreasInfosTemp = lotAreaParam as List<LotAreaInfo>
//            List<LotAreaInfo> lotAreaInfos = new ArrayList<LotAreaInfo>()
//            lotAreasInfosTemp.each {
//                LotAreaInfo lotAreaInfo = new LotAreaInfo()
//                lotAreaInfo.lotInfo = lotTransaction.lotInfo
//                lotAreaInfo.lotNo = it.lotNo
//                lotAreaInfo.surveyNo = it.surveyNo
//
//                lotAreaInfo.deleted = it.deleted
//                lotAreaInfo.lotAreaSize = it.lotAreaSize
//                lotAreaInfos.add(lotAreaInfo)
//            }


            def claimantsTemp = claimantParam as List<Claimant>
            List<Claimant> claimants = new ArrayList<Claimant>()

            claimantsTemp.each {
                Claimant claimant = new Claimant()
                claimant.lotTransaction = lotTransaction
                claimant.claimantAddress = it.claimantAddress
                claimant.claimantContactNo = it.claimantContactNo
                claimant.claimantFullName = it.claimantFullName
                claimants.add(claimant)
            }
//            lotTransaction.lotInfo.lotAreaInfos.each {
//                def lotAreaInfo = it
//                def i = 0
//                lotAreaParam.each{
//
//                    if(lotAreaInfo.id == it.id)
//                    {
//                     i++
//                    }
//
//                }
//                if (i>0){
//                 lotAreaInfoRepository.delete(it)
//                }
//            }

//            lotAreaInfoRepository.saveAll(lotTransaction.lotInfo.lotAreaInfos)

//            lotAreaInfoRepository.saveAll(lotAreaInfos)

            claimantRepository.saveAll(claimants)
            lotTransactionRepository.save(lotTransaction)


            return lotTransaction
        } else {
            //create new lotTransaction
            LotTransaction lotTransaction = objectMapper.convertValue(lotTransactionParam, LotTransaction.class)
            LotInfo lotInfo = objectMapper.convertValue(lotInfoParam, LotInfo.class)
            def claimantsTemp = claimantParam as List<Claimant>
            def lotAreasInfosTemp = lotAreaParam as List<LotAreaInfo>
            List<Claimant> claimants = new ArrayList<Claimant>()
            List<LotAreaInfo> lotAreaInfos = new ArrayList<LotAreaInfo>()

            claimantsTemp.each {
                Claimant claimant = new Claimant()
                claimant.lotTransaction = lotTransaction
                claimant.claimantAddress = it.claimantAddress
                claimant.claimantContactNo = it.claimantContactNo
                claimant.claimantFullName = it.claimantFullName
                claimants.add(claimant)
            }
            lotAreasInfosTemp.each {
                LotAreaInfo lotAreaInfo = new LotAreaInfo()
                lotAreaInfo.lotInfo = lotInfo
                lotAreaInfo.lotNo = it.lotNo
                lotAreaInfo.surveyNo = it.surveyNo

                lotAreaInfo.deleted = it.deleted
                lotAreaInfo.lotAreaSize = it.lotAreaSize
                lotAreaInfos.add(lotAreaInfo)
            }

            lotTransaction.lotInfo = lotInfo

//            User user = userRepository.findById(userId)

            Employee employee = entityManager.createQuery("""
                Select e from Employee e 
                where e.id = :id
            """, Employee.class).setParameter("id", empId)
                    .singleResult

            lotTransaction.transactionId = "TRXN" + generatorService.getNextValue(GeneratorType.POSITION) { Long no ->
                StringUtils.leftPad(no.toString(), 6, "0")
            }




            //==================create user activity===================
            UserActivity userActivity = new UserActivity()
            userActivity.lotTransaction = lotTransaction
            userActivity.activityType = UserActivityType.APPROVE_LOT_TRANSACTION
            userActivity.status = UserActivityStatus.FOR_APPROVAL

            userActivity.user = employee.user
            userActivity.forwardedBy = employee.fullName
            userActivity.lotTransaction = lotTransaction

            //===================create survey sched====================
            SurveySched surveySched = new SurveySched()
            if (id) {
                surveySched = surveySchedRepository.findById(id).get()
            }
            surveySched.status = "FOR_SURVEY"
            surveySched.surveyDateStart = surveyDateStart
            surveySched.lotTransaction = lotTransaction

            List<SurveyTeam> surveyTeams = new ArrayList<SurveyTeam>()
            surveyTeamIds.each {
                SurveyTeam person = new SurveyTeam()
                person.surveyTeamMember = surveyTeamMemberRepository.findById(it).get()
                person.surveySched = surveySched
                surveyTeams.add(person)
            }
            def default_flags = new UploadFilesDto(
                    hasLdc: false,
                    hasCad: false,
                    hasSketchPlan: false,
                    hasDenrSketchPlan: false,
                    hasBLPlan: false,
            )
            lotTransaction.uploadedFileFlags = default_flags

            surveyTeamRepository.saveAll(surveyTeams)
            surveySchedRepository.save(surveySched)


            userActivityRepository.save(userActivity)
            lotInfoRepository.save(lotInfo)
            lotAreaInfoRepository.saveAll(lotAreaInfos)
            claimantRepository.saveAll(claimants)
            lotTransaction = lotTransactionRepository.save(lotTransaction)

            //==================create billing===================
            def service = serviceRepository.findById(lotTransaction.service.id).get()

            Billing billing = new Billing()
            billing.lotTransaction = lotTransaction
            billing.billingNo = "BILL" + generatorService.getNextValue(GeneratorType.POSITION) { Long no ->
                StringUtils.leftPad(no.toString(), 6, "0")
            }
            billing.status = "OPEN"
            billing.balance = service.serviceCost
            billing = billingRepository.save(billing)
            //Create Billing Item for service type
            def billingItem = new BillingItem()


            billingItem.type = "SERVICE"
            billingItem.description = service.serviceName
            billingItem.quantity = 1
            billingItem.billing = billing
            billingItem.cost = service.serviceCost
            billingItem.debit = service.serviceCost
            billingItem.credit = 0
            billingItem.status = 'ACTIVE'
            billingItemRepository.save(billingItem)


            return lotTransaction
        }

    }

    @GraphQLMutation(name = "updateDocReleasedStatus")
    @Transactional
    GraphQLRetVal<String> updateDocReleasedStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "activityType") String activityType
    ) {
        LotTransaction lotTransaction = lotTransactionRepository.findById(id).get()
        if(activityType == "RELEASE_SKETCH_PLAN"){
            lotTransaction.isReleasedSketchPlan = true
        }else if(activityType == "RELEASE_APPROVED_PLAN"){
            lotTransaction.isReleasedApprovedPlan = true
        }

//        if(lotTransaction.lastStep == activityType){
//
//            lotTransaction.status = LotTransactionStatus.COMPLETED
//        }

        lotTransactionRepository.save(lotTransaction)

        return new GraphQLRetVal<String>("Success", true, "Changes Saved")
    }

    @GraphQLMutation(name = "setToCompleted")
    @Transactional
    GraphQLRetVal<String> setToCompleted(
            @GraphQLArgument(name = "id") UUID id
    ) {
        LotTransaction lotTransaction = lotTransactionRepository.findById(id).get()
        if(lotTransaction){
            lotTransaction.status = LotTransactionStatus.COMPLETED
        }else{
            return new GraphQLRetVal<String>("Fail", false, "Unable to save changes.")
        }


        lotTransactionRepository.save(lotTransaction)

        return new GraphQLRetVal<String>("Success", true, "Lot Transaction set to Completed.")
    }


}


