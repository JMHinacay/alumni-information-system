package com.backend.gbp.graphqlservices.billing

import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.billing.BillingItem
import com.backend.gbp.domain.billing.Deduction
import com.backend.gbp.domain.billing.Payment
import com.backend.gbp.domain.lot.Claimant
import com.backend.gbp.domain.lot.LotAreaInfo
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.billing.BillingItemRepository
import com.backend.gbp.repository.billing.BillingRepository
import com.backend.gbp.repository.billing.DeductionRepository
import com.backend.gbp.repository.billing.MiscFeeRepository
import com.backend.gbp.repository.billing.PaymentRepository
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
class BillingItemService {

    @Autowired
    MiscFeeRepository miscFeeRepository

    @Autowired
    BillingRepository billingRepository

    @Autowired
    BillingItemRepository billingItemRepository

    @Autowired
    PaymentRepository paymentRepository

    @Autowired
    DeductionRepository deductionRepository

    @Autowired
    GeneratorService generatorService

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================
    //payment queries
    @GraphQLQuery(name = "getPaymentsByBillingId", description = "Get All payments by billing id")
    List<Payment> getPaymentsByBillingId(@GraphQLArgument(name = "billingId") UUID billingId) {
        paymentRepository.getByBillingId(billingId).sort { it.createdDate }
    }

    //deduction queries
    @GraphQLQuery(name = "getDeductionsByBillingId", description = "Get All deductions by billing id")
    List<Deduction> getDeductionsByBillingId(@GraphQLArgument(name = "billingId") UUID billingId) {
        deductionRepository.getByBillingId(billingId).sort { it.createdDate }
    }


    //============== All Mutations ====================
    @GraphQLMutation(name = "addBillingItems")
    @Transactional
    GraphQLRetVal<String> addBillingItems(
            @GraphQLArgument(name = "billingId") UUID billingId,
            @GraphQLArgument(name = "billingItems") ArrayList<Map<String, Object>> billingItemsTemp,
            @GraphQLArgument(name = "total") BigDecimal total


    ) {
        def billingItems = billingItemsTemp as List<BillingItem>

        List<BillingItem> newBillingItems = new ArrayList<BillingItem>()

        billingItems.each {
            BillingItem billingItem = new BillingItem()
            billingItem.cost = it.cost
            billingItem.debit = it.cost
            billingItem.credit = 0
            billingItem.type = it.type
            billingItem.description = it.description
            billingItem.quantity = it.quantity
            billingItem.status = 'ACTIVE'
            billingItem.billing = billingRepository.findById(billingId).get()
            newBillingItems.add(billingItem)
        }
        billingItemRepository.saveAll(newBillingItems)

//        Billing billing = billingRepository.findById(billingId).get()
//
//
//        billing.balance = billing.balance + total
//        billingRepository.save(billing)


        return new GraphQLRetVal<String>("Success", true, "Changes Saved")

    }


    @GraphQLMutation(name = "updateBillingItemStatus")
    @Transactional
    GraphQLRetVal<String> updateBillingItemStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "itemType") String itemType

    ) {


        if (itemType == "PAYMENT") {
            def payment = paymentRepository.findById(id).get()
            payment.status = status
            paymentRepository.save(payment)

            def billingItem = billingItemRepository.findById(payment.billingItemId).get()
            billingItem.status = status
            billingItemRepository.save(billingItem)

        } else if (itemType == "DEDUCTION") {
            def deduction = deductionRepository.findById(id).get()
            deduction.status = status
            deductionRepository.save(deduction)

            def billingItem = billingItemRepository.findById(deduction.billingItemId).get()
            billingItem.status = status
            billingItemRepository.save(billingItem)
        } else {
            def billingItem = billingItemRepository.findById(id).get()
            billingItem.status = status
        }
        return new GraphQLRetVal<String>("Success", true, "Changes Saved")

    }


    @GraphQLMutation(name = "addPayment")
    @Transactional
    GraphQLRetVal<String> addPayment(
            @GraphQLArgument(name = "billingId") UUID billingId,
            @GraphQLArgument(name = "amount") BigDecimal amount,
            @GraphQLArgument(name = "paymentMethod") String paymentMethod

    ) {


        BillingItem billingItem = new BillingItem()
        billingItem.cost = null
        billingItem.debit = 0
        billingItem.credit = amount
        billingItem.type = "PAYMENT"
        billingItem.description = "PAYMENT"
        billingItem.quantity = 1
        billingItem.status = 'ACTIVE'
        billingItem.billing = billingRepository.findById(billingId).get()
        billingItem = billingItemRepository.save(billingItem)


        Payment payment = new Payment()
        payment.billing = billingRepository.findById(billingId).get()
        payment.billingItem = billingItem
        payment.amount = amount
        payment.paymentMethod = paymentMethod
        payment.status = "ACTIVE"
        paymentRepository.save(payment)


        return new GraphQLRetVal<String>("Success", true, "Changes Saved")

    }

//    checkBalance(){
//        Billing billing = billingRepository.findById(billingId).get()
//        BigDecimal balance = billing.balance - amount
//
//        if(balance <= 0 ){
//            billing.status = "CLOSED"
//            billingRepository.save(billing)
//        }
//    }

    @GraphQLMutation(name = "addDeduction")
    @Transactional
    GraphQLRetVal<String> addDeduction(
            @GraphQLArgument(name = "billingId") UUID billingId,
            @GraphQLArgument(name = "amount") BigDecimal tempAmount,
            @GraphQLArgument(name = "remarks") String remarks,
            @GraphQLArgument(name = "type") String type,
            @GraphQLArgument(name = "discountRate") String discountRate


    ) {
        Billing billing = billingRepository.findById(billingId).get()
        Deduction deduction = new Deduction()
        BigDecimal amount = tempAmount

        if (type == "BY_PERCENTAGE") {
            amount = 0
            billing.billingItems.each {
                amount = amount + (it.debit * it.quantity)

            }
//            def discount = discountRate.toBigDecimal() / 100.toBigDecimal()
//            amount = amount * discount

            amount = amount * (discountRate.toBigDecimal() / 100.toBigDecimal())
            deduction.discountRate = discountRate
        }

        BillingItem billingItem = new BillingItem()
        billingItem.cost = null
        billingItem.debit = 0
        billingItem.credit = amount
        billingItem.type = "DEDUCTION"
        billingItem.description = "DEDUCTION"
        billingItem.quantity = 1
        billingItem.status = 'ACTIVE'
        billingItem.billing = billing

        deduction.billing = billing
        deduction.billingItem = billingItem
        deduction.amount = amount
        deduction.remarks = remarks
        deduction.status = "ACTIVE"
        deduction.type = type

        billingItemRepository.save(billingItem)
        deductionRepository.save(deduction)

        BigDecimal balance = billing.balance - amount
        if (balance <= 0) {
            billing.status = "CLOSED"
            billingRepository.save(billing)
        }
        return new GraphQLRetVal<String>("Success", true, "Changes Saved")

    }
}