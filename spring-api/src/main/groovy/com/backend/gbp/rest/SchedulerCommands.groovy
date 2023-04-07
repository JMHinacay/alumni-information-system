package com.backend.gbp.rest


import com.backend.gbp.services.scheduler.SchedulerService
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController

import java.security.Principal

@RestController
@RequestMapping("/api")
@Slf4j
class SchedulerCommands {
	
	@Autowired
	SchedulerService schedulerService




//	@RequestMapping(value = "/processArDeductFromBillingNo", produces = ["text/plain"] )
//	String processArDeductFromBillingNo(@RequestParam String folioNo){
//	 def billing=	billingService.findByFolioNo(folioNo)
//		 if(billing){
//			 billingService.postAccountsReceibleFromCompanyAccounts(billing)
//		 }
//		return "OK-${billing.patient?.fullName?:(billing?.otcname?:"")}"
//
//	}

	//curl --user "scheduler:password"   -X POST http://localhost:8080/api/testIntegrationBillingItem
	@RequestMapping(value = "/testIntegrationBillingItem", produces = ["text/plain"] )
	String testIntegrationBillingItem() { //@RequestParam String recno

		List<String> results = []
		//def billingItem = billingItemServices.getBillingItemsByRecno(recno)



		// 0a9f3954-09b8-47d1-82f7-261dc6bee57e 6B
		// 519f5f63-972d-4abd-838c-5534c61f9e5f 7A

		/*def header = integrationServices.generateAutoEntries(new IntegrationTemplate()){

			it.flagValue = "AP-SAMPLE"
			it.dept_a = departmentRepository.findById(UUID.fromString("0a9f3954-09b8-47d1-82f7-261dc6bee57e")).get()
			it.dept_b = departmentRepository.findById(UUID.fromString("519f5f63-972d-4abd-838c-5534c61f9e5f")).get()

			// 1000
			// 100
			it.value_a = 900
			it.value_b = 0

			it.value_c = 1000
			it.value_d = 100
		}*/

		/*def header = integrationServices.generateAutoEntries(new PaymentTracker()) { it, multiple ->


			it.shift = new Shifting().tap {
				 it.terminal = new CashierTerminal()
			}
			it.flagValue = "HOSPITAL_PAYMENTS"
			it.totalCash = 0.0
			it.totalCheck = 0.0


			it.erPayments = 0.0
			it.opdPayments = 0.0
			it.ipdPayments = 0.0
			it.pfPaymentsAll = 0.0
			it.otcPayments = -2000


			// First Multiple
			multiple << [
					new PaymentTracker().tap {
						it.bankForCreditCard = bankRepository.findById(UUID.fromString("3d4ff593-2024-4bc3-bf2c-c0c243400239")).get()
						it.amountForCreditCard = 500.0

					},
					new PaymentTracker().tap {
						it.bankForCreditCard = bankRepository.findById(UUID.fromString("41f4e0b4-87c0-4a4e-9160-f5c36b223fc2")).get()
						it.amountForCreditCard = 500.0
					}
			]

			// Second Multiple
			multiple << [
					new PaymentTracker().tap {
						it.bankForCashDeposit = bankRepository.findById(UUID.fromString("3d4ff593-2024-4bc3-bf2c-c0c243400239")).get()
						it.amountForCashDeposit = 600.0

					},
					new PaymentTracker().tap {
						it.bankForCashDeposit = bankRepository.findById(UUID.fromString("41f4e0b4-87c0-4a4e-9160-f5c36b223fc2")).get()
						it.amountForCashDeposit = 400.0
					}
			]

		}*/

//		   def header = integrationServices.generateAutoEntries(new BillingItem()) { it, multiple ->
//
//
//			it.flagValue = "DISCOUNTS_DEDUCT"
//
//			it.discountAmountArER = 0.0
//		    it.discountAmountArOPD = 5000
//		    it.discountAmountArIP = 2000
//		    it.discountAmountArOTC = 0.0
//
//
//
//			// First Multiple
//			multiple << [
//
//					new BillingItem().tap {
//						it.discount =discountsService.findOne(UUID.fromString("bae061a5-7132-4c78-a30e-f4fc436dcc9f"))
//						it.discountDepartment = departmentRepository.findById(UUID.fromString("0a9f3954-09b8-47d1-82f7-261dc6bee57e")).get()
//						it.discountAmount = -3500
//					},
//					new BillingItem().tap {
//						it.discount =discountsService.findOne(UUID.fromString("acd7088d-120a-410b-9536-c8d3e7c44eab"))
//						it.discountDepartment = departmentRepository.findById(UUID.fromString("519f5f63-972d-4abd-838c-5534c61f9e5f")).get()
//						it.discountAmount = -3500
//					}
//
//			]
//
//
//
//		}
//
//
//
//		header.ledger.each {
//			results.add( String.format("%100.100s  Debit:%s     Credit: %s", it.journalAccount.description,
//			new DecimalFormat("#,##0.00").format(it.debit),
//		    new DecimalFormat("#,##0.00").format(it.credit),
//			))
//		}
//
//
//
//
//
//
//		StringUtils.join(results,"\n")
	}


//	@RequestMapping(value = "/cleanNotifications", method = RequestMethod.POST)
//	ResponseEntity<String> cleanNotifications(Principal principal) {
//
//		log.info("cleanNotifications called by " + principal.name)
//
//		schedulerService.cleanNotifications()
//
//		return ResponseEntity.ok("OK")
//	}
//
//
//	@RequestMapping(value = "/autochargeRooms", method = RequestMethod.POST)
//	ResponseEntity<String> autochargeRooms(Principal principal) {
//
//		log.info("AutoCharged called by " + principal.name)
//		// Code Here to autocharge Room
//
//		schedulerService.autochargeRooms()
//		return ResponseEntity.ok("OK")
//	}
//
//	@RequestMapping(value = "/removeOldNotifications", method = RequestMethod.POST)
//	ResponseEntity<String> removeOldNotifications(Principal principal) {
//
//		log.info("Remove old notifications called by " + principal.name)
//		// Code Here to autocharge Room
//		schedulerService.autoRemoveNotifications()
//		return ResponseEntity.ok("OK")
//	}
	






}
