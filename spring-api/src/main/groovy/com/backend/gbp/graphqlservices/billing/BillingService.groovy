package com.backend.gbp.graphqlservices.billing

import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.billing.BillingItem
import com.backend.gbp.domain.billing.Deduction
import com.backend.gbp.domain.billing.MiscFee
import com.backend.gbp.domain.lot.LotTransaction
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.billing.BillingItemRepository
import com.backend.gbp.repository.billing.BillingRepository
import com.backend.gbp.repository.billing.DeductionRepository
import com.backend.gbp.repository.billing.MiscFeeRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
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

@TypeChecked
@Component
@GraphQLApi
class BillingService extends AbstractDaoService<Billing> {

    BillingService() {
        super(Billing.class)
    }

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    BillingRepository billingRepository

    @Autowired
    DeductionRepository deductionRepository

    @Autowired
    BillingItemRepository billingItemRepository

    //============== All Queries ====================

    @GraphQLQuery(name = "billingList", description = "Get All misc fees")
    List<Billing> findAll() {
        billingRepository.findAll().sort { it.createdDate }.reverse()
    }

    @GraphQLQuery(name = "billingByFilter", description = "Get All Lot Transaction")
    Page<Billing> billingByFilter(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "service") UUID service,
            @GraphQLArgument(name = "startDate") String startDate,
            @GraphQLArgument(name = "endDate") String endDate,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        String query = "Select a from Billing a where 1 = 1 "
        String countQuery = "Select count(a) from Billing a where 1 = 1 "
        Map<String, Object> params = new HashMap<>()



        if (status != null) {
            query += ''' and a.status = :status'''
            countQuery += ''' and a.status = :status'''
            params.put('status', status)
        }

        if (startDate != null && endDate != null) {
            query += ''' and to_date(to_char(a.createdDate, 'YYYY-MM-DD'),'YYYY-MM-DD')	between to_date(:startDate,'YYYY-MM-DD')'''
            countQuery += ''' and to_date(to_char(a.createdDate, 'YYYY-MM-DD'),'YYYY-MM-DD')	between to_date(:startDate,'YYYY-MM-DD') '''
            query += '''   and  to_date(:endDate,'YYYY-MM-DD')'''
            countQuery += ''' and  to_date(:endDate,'YYYY-MM-DD') '''
            params.put('startDate', startDate)
            params.put('endDate', endDate)

        }
        if (filter != null) {
            query += ''' and ((lower(a.billingNo) like lower(concat('%',:filter,'%'))) or (lower(a.lotTransaction.transactionId) like lower(concat('%',:filter,'%')))) '''
            countQuery += ''' and ((lower(a.billingNo) like lower(concat('%',:filter,'%'))) or (lower(a.lotTransaction.transactionId) like lower(concat('%',:filter,'%'))))  '''
            params.put('filter', filter)
        }

//        query += '''   ORDER BY a.createdDate desc '''
//        countQuery += '''   ORDER BY a.createdDate desc '''

       return getPageable(query, countQuery, page, size, params)

    }

    @GraphQLQuery(name = "billingById", description = "Get All misc fees")
    Billing billingById(@GraphQLArgument(name = "id") UUID id) {
        billingRepository.findById(id).get()
    }





    //============== All Mutations ====================
    @GraphQLMutation(name = "changeBillingLockStatus")
   @Transactional
    GraphQLRetVal<String> changeBillingLockStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "isLocked") Boolean isLocked


    ) {
        Billing billing = billingRepository.findById(id).get()
        billing.isLocked = isLocked
        billing.lockedBy = employeeRepository.findById(employeeId).get().fullName

        if(isLocked == false){
            List <Deduction> deletedDeductions = deductionRepository.getByBillingId(billing.id)
            deductionRepository.deleteAll(deletedDeductions)

//            List <BillingItem> billingItems = []
//            billing.billingItems.each {
//                if(it.type != "DEDUCTION") {
//                    billingItems.push(it)
//                }
//            }
//
//            billing.billingItems.clear()
//
//
//            billingRepository.save(billing)
//            billingItemRepository.saveAll(billingItems)

            List <BillingItem> deletedBillingItems = billingItemRepository.getDeductionsByBillingId(billing.id)

//            billing.billingItems.each {
//                println(it.type)
//                if(it.type == "DEDUCTION") {
//                    deletedBillingItems.push(it)
//                }
//            }
            billingItemRepository.deleteAll(deletedBillingItems)

        }

        return new GraphQLRetVal<String>("Success", true, "Lock status updated successfully.")
    }

}
