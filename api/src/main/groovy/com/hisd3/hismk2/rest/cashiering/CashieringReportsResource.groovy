package com.hisd3.hismk2.rest.cashiering

import com.hisd3.hismk2.domain.cashiering.PaymentTracker
import com.hisd3.hismk2.domain.cashiering.PaymentTrackerDetails
import com.hisd3.hismk2.domain.cashiering.PaymentType
import com.hisd3.hismk2.domain.cashiering.ReceiptType
import com.hisd3.hismk2.domain.cashiering.dto.CollectionReportCsvDownloadDto
import com.hisd3.hismk2.graphqlservices.cashiering.CdctrServices
import com.hisd3.hismk2.graphqlservices.cashiering.ChequeEncashmentServices
import com.hisd3.hismk2.graphqlservices.cashiering.ShiftingServices
import com.hisd3.hismk2.graphqlservices.hospital_config.HospitalConfigService
import com.hisd3.hismk2.repository.UserRepository
import com.hisd3.hismk2.repository.hrm.EmployeeRepository
import com.hisd3.hismk2.security.SecurityUtils
import groovy.transform.Canonical
import net.sf.jasperreports.engine.JRException
import net.sf.jasperreports.engine.JasperFillManager
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource
import net.sf.jasperreports.engine.export.JRPdfExporter
import net.sf.jasperreports.export.SimpleExporterInput
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput
import net.sf.jasperreports.export.SimplePdfExporterConfiguration
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.apache.commons.io.IOUtils
import org.apache.commons.lang3.BooleanUtils
import org.apache.commons.lang3.StringUtils
import org.apache.pdfbox.io.MemoryUsageSetting
import org.apache.pdfbox.multipdf.PDFMergerUtility
import org.apache.xmlbeans.impl.xb.xsdschema.AnyDocument
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.concurrent.Callable

@Canonical
class CashDto {
	String denomination
	int noofpieces = 0
	BigDecimal total
	
}

@Canonical
class CheckCC {
	String bank = ""
	String type = ""
	String chnumber = ""
	BigDecimal amount = BigDecimal.ZERO
	
}

@Canonical
class DCTRItems {
	String description = ""
	BigDecimal totalpayments = BigDecimal.ZERO
	BigDecimal descriptionAmount = BigDecimal.ZERO
	String paymentType = ""
	String details = ""
	String receiptTypeStr = ""
	String category = ""
	Integer order = 0
}

@RestController
@RequestMapping("/cashieringreports")
class CashieringReportsResource {

	@Autowired
	ApplicationContext applicationContext

	@Autowired
	HospitalConfigService hospitalConfigService

	@Autowired
	ShiftingServices shiftingServices

	@Autowired
	UserRepository userRepository

	@Autowired
	EmployeeRepository employeeRepository

	@Autowired
	ChequeEncashmentServices chequeEncashmentServices

	@Autowired
	CdctrServices cdctrServices

	@Autowired
	NamedParameterJdbcTemplate namedParameterJdbcTemplate

	@RequestMapping(value = "/printcdctr", produces = ["application/pdf"])
	ResponseEntity<byte[]> printcdctr(
			@RequestParam UUID cdctrId
	) {

		def cdctr = cdctrServices.findOne(cdctrId)

		def res = applicationContext.getResource("classpath:/reports/cashier/printcdctr.jasper")
		def os = new ByteArrayOutputStream()
		def logo = applicationContext.getResource("classpath:/reports/logo.png")

		if (!res.exists()) {
			return ResponseEntity.notFound().build()
		}
		def hospitalInfo = hospitalConfigService.hospitalInfo
		def parameters = [:] as Map<String, Object>

		parameters.put("logo", logo.inputStream)
		parameters.put("hospitalname", hospitalInfo?.hospitalName ?: "No hospital name")

		def fulladdress = (hospitalInfo?.address ?: "") + " " +
				(hospitalInfo?.addressLine2 ?: "") + "\n" +
				(hospitalInfo?.city ?: "") + " " +

				(hospitalInfo?.zip ?: "") + " " +
				(hospitalInfo?.country ?: "")

		parameters.put("hospitalfulladdress", fulladdress)

		parameters.put("contactline",
				"T: " + (hospitalInfo?.telNo ?: "No hospital contact") + " " +
						"E: " + (hospitalInfo?.email ?: "No hospital email")
		)

		List<CashDto> cash = []

		cash.add(new CashDto("1000", 0, BigDecimal.ZERO))
		cash.add(new CashDto("500", 0, BigDecimal.ZERO))
		cash.add(new CashDto("100", 0, BigDecimal.ZERO))
		cash.add(new CashDto("50", 0, BigDecimal.ZERO))
		cash.add(new CashDto("20", 0, BigDecimal.ZERO))
		cash.add(new CashDto("10", 0, BigDecimal.ZERO))
		cash.add(new CashDto("5", 0, BigDecimal.ZERO))
		cash.add(new CashDto("1", 0, BigDecimal.ZERO))
		cash.add(new CashDto(".25", 0, BigDecimal.ZERO))
		cash.add(new CashDto(".1", 0, BigDecimal.ZERO))
		cash.add(new CashDto(".05", 0, BigDecimal.ZERO))

		def dataSourceTable = new JRBeanCollectionDataSource(cash)

		parameters.put("tablesource", dataSourceTable)

		parameters.put("recno", cdctr.recno)

		List<CheckCC> checkscc = []

		cdctr.shiftings.each {

			it.payments.each {
				PaymentTracker pt = it

				pt.paymentDetails.each {
					pd ->

						if (pd.type == PaymentType.BANKDEPOSIT ||
								pd.type == PaymentType.CARD ||
								pd.type == PaymentType.CHECK
						) {
							checkscc << new CheckCC(pd.bank ?: (pd.bankEntity?.bankname ?: "N/A"), pd.type.name(), pd.reference, pd.amount)
						}
				}

			}

			def encashmentShift = chequeEncashmentServices.cheqEncashmentByOneShiftId(it.id)
			if(encashmentShift)
				encashmentShift.each {
					ce ->
						if(ce.shifting.id == it.id) {
							checkscc << new CheckCC(ce.bank ? ce.bank?.bankname : "N/A", PaymentType.CHECK.name(), ce.chequeNo, ce.amount)
						}
				}

		}


		def username = SecurityUtils.currentLogin()
		def user = userRepository.findOneByLogin(username)
		def emp = employeeRepository.findOneByUser(user)

		parameters.put("preparedby", emp.fullName)
		parameters.put("preparedbyempno", emp.employeeNo)

		try {
			def jrprint = JasperFillManager.fillReport(res.inputStream, parameters, new JRBeanCollectionDataSource(checkscc))

			def pdfExporter = new JRPdfExporter()

			def outputStreamExporterOutput = new SimpleOutputStreamExporterOutput(os)

			pdfExporter.setExporterInput(new SimpleExporterInput(jrprint))
			pdfExporter.setExporterOutput(outputStreamExporterOutput)
			def configuration = new SimplePdfExporterConfiguration()
			pdfExporter.setConfiguration(configuration)
			pdfExporter.exportReport()

		} catch (JRException e) {
			e.printStackTrace()
		} catch (IOException e) {
			e.printStackTrace()
		}

		def ut = new PDFMergerUtility()
		def outputStream = new ByteArrayOutputStream()

		def inputStream = new ByteArrayInputStream(os.toByteArray())
		ut.addSource(inputStream)
		IOUtils.closeQuietly(os)

		ut.destinationStream = outputStream

		cdctr.shiftings.each {

			def shift = printSalesReportForShift(it.id)
			def is = new ByteArrayInputStream(shift.body)
			ut.addSource(is)
			IOUtils.closeQuietly(is)

		}

		ut.mergeDocuments(MemoryUsageSetting.setupTempFileOnly())

		def data = outputStream.toByteArray()
		def params = new LinkedMultiValueMap<String, String>()
		params.add("Content-Disposition", "inline;filename=ConsolidatedDailyCollection-${cdctr.recno}.pdf".toString())
		return new ResponseEntity(data, params, HttpStatus.OK)
	}

	static DCTRItems addDCTRItems(PaymentTrackerDetails ptd, String category,cards,checks,deposits,Integer order=0,Boolean voided=false){
		if(ptd.type == PaymentType.CASH) {
			return new DCTRItems(
					"     - CASH ${(ptd.reference ?: "")}",
					null,
					ptd.amount,
					"",
					"",
					"",
					category,
					order
			)
		}
		if(ptd.type == PaymentType.CHECK) {
			if(!voided)
				checks << ptd

			return new DCTRItems(
					"     - CHECK: ${(ptd.reference ?: "")}",
					null,
					ptd.amount,
					"",
					"",
					"",
					category,
					order
			)
		}

		if(ptd.type == PaymentType.CARD) {
			if(!voided)
				cards << ptd

			return new DCTRItems(
					"     - CARD: ${(ptd.reference ?: "")}",
					null,
					ptd.amount,
					"",
					"",
					"",
					category,
					order
			)
		}

		if(ptd.type == PaymentType.BANKDEPOSIT) {
			if(!voided)
				deposits << ptd

			return new DCTRItems(
					"     - BANKDEPOSIT: ${(ptd.reference ?: "")}",
					null,
					ptd.amount,
					"",
					"",
					"",
					category,
					order
			)
		}
	}

	@RequestMapping(value = "/printSalesReportForShift", produces = ["application/pdf"])
	ResponseEntity<byte[]> printSalesReportForShift(
			@RequestParam UUID shiftId
	) {

		def shift = shiftingServices.findOne(shiftId)
		def encashmentShift = chequeEncashmentServices.cheqEncashmentByOneShiftId(shiftId)

		def res = applicationContext.getResource("classpath:/reports/cashier/printdctr.jasper")
		def os = new ByteArrayOutputStream()
		//def logo = applicationContext.getResource("classpath:/reports/logo.jpg")
		def logo = applicationContext?.getResource("classpath:/reports/logo.png")

		if (!res.exists()) {
			return ResponseEntity.notFound().build()
		}
		def hospitalInfo = hospitalConfigService.hospitalInfo
		def parameters = [:] as Map<String, Object>

		//parameters.put("logo", logo.inputStream)

		if (logo.exists()) {
			parameters.put("logo", logo?.inputStream)
		}

		parameters.put("hospitalname", hospitalInfo?.hospitalName ?: "No hospital name")

		def fulladdress = (hospitalInfo?.address ?: "") + " " +
				(hospitalInfo?.addressLine2 ?: "") + "\n" +
				(hospitalInfo?.city ?: "") + " " +

				(hospitalInfo?.zip ?: "") + " " +
				(hospitalInfo?.country ?: "")

		parameters.put("hospitalfulladdress", fulladdress)

		parameters.put("contactline",
				"Contact No: " + (hospitalInfo?.telNo ?: "No hospital contact") + " " +
						"Email: " + (hospitalInfo?.email ?: "No hospital email")
		)

		List<CashDto> cash = []

		cash.add(new CashDto("1000", 0, BigDecimal.ZERO))
		cash.add(new CashDto("500", 0, BigDecimal.ZERO))
		cash.add(new CashDto("100", 0, BigDecimal.ZERO))
		cash.add(new CashDto("50", 0, BigDecimal.ZERO))
		cash.add(new CashDto("20", 0, BigDecimal.ZERO))
		cash.add(new CashDto("10", 0, BigDecimal.ZERO))
		cash.add(new CashDto("5", 0, BigDecimal.ZERO))
		cash.add(new CashDto("1", 0, BigDecimal.ZERO))
		cash.add(new CashDto(".25", 0, BigDecimal.ZERO))
		cash.add(new CashDto(".1", 0, BigDecimal.ZERO))
		cash.add(new CashDto(".05", 0, BigDecimal.ZERO))

		def dataSourceTable = new JRBeanCollectionDataSource(cash)

		parameters.put("tablesource", dataSourceTable)

		// shift
		def formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a")
		parameters.put("title", "Daily Collection Report")
		parameters.put("shiftno", shift.shiftno ?: "")
		parameters.put("terminal", shift.terminal?.terminalId ?: "")
		parameters.put("terminalremarks", shift.terminal?.remarks ?: "")
		parameters.put("shiftstart", shift.startshift ? formatter.format(shift.startshift.atZone(ZoneId.systemDefault())) : "")
		parameters.put("shiftend", shift.endshift ? formatter.format(shift.endshift.atZone(ZoneId.systemDefault())) : "")

		parameters.put("status", shift.active ? "OPEN" : "CLOSED")

		// Fill Report Items

		List<DCTRItems> items = []
		List<PaymentTrackerDetails> cards = []
		List<PaymentTrackerDetails> checks = []
		List<PaymentTrackerDetails> deposits = []

		// Calculate Total Amount
		def totalchecks = 0.0
		def totalchecksEncashment = 0.0
		def totalbankdeposit = 0.0
		def totalcards = 0.0
		def totalcash = 0.0
		def totalchange = 0.0


		def sortedActiveOr = shift.payments.findAll { PaymentTracker a -> BooleanUtils.isNotTrue(a.voided) && a.receiptType == ReceiptType.OR }.toSorted {
			PaymentTracker a, PaymentTracker b ->
				a.ornumber <=> b.ornumber
		}

		Integer order = 0
		sortedActiveOr.each {
			PaymentTracker pt ->

				items << new DCTRItems(
						StringUtils.upperCase(pt.description),
						pt.totalpayments,
						null,
						"",
						"",
						"${pt.receiptType.name()}: ${pt.ornumber} [${pt.createdBy}]",
						"Official Receipts",
						order++
				)

				pt.paymentDetails.each {
					ptd ->
						def dCTRItems = addDCTRItems(ptd,"Official Receipts",cards,checks,deposits,order++)
						if(ptd.type == PaymentType.CASH)
							totalcash += ptd.amount

						if(dCTRItems)
							items << dCTRItems
				}

				totalchange += pt.change
		}

		def sortedVoidedOr = shift.payments.findAll { PaymentTracker a -> BooleanUtils.isTrue(a.voided) }.toSorted {
			PaymentTracker a, PaymentTracker b ->
				a.ornumber <=> b.ornumber
		}

		sortedVoidedOr.each {
			PaymentTracker pt ->
				items << new DCTRItems(
						StringUtils.upperCase(pt.description),
						pt.totalpayments,
						null,
						"",
						"",
						"${pt.receiptType.name()}: ${pt.ornumber} [${pt.createdBy}]",
						"Voided Official Receipts",
						order++
				)

				pt.paymentDetails.each {
					ptd ->
						def dCTRItems = addDCTRItems(ptd,"Voided Official Receipts",cards,checks,deposits,order++,true)
						if(dCTRItems)
							items << dCTRItems

				}
		}

		// AR Payments
		def sortedActiveAr = shift.payments.findAll { PaymentTracker a -> BooleanUtils.isNotTrue(a.voided) && a.receiptType == ReceiptType.AR }.toSorted {
			PaymentTracker a, PaymentTracker b ->
				a.ornumber <=> b.ornumber
		}

		sortedActiveAr.each {
			PaymentTracker pt ->

				items << new DCTRItems(
						StringUtils.upperCase(pt.description),
						pt.totalpayments,
						null,
						"",
						"",
						"${pt.receiptType.name()}: ${pt.ornumber} [${pt.createdBy}]",
						"Acknowledgement Receipts",
						order++
				)

				pt.paymentDetails.each {
					ptd ->
						def dCTRItems = addDCTRItems(ptd,"Acknowledgement Receipts",cards,checks,deposits,order++)

						if(ptd.type == PaymentType.CASH)
							totalcash += ptd.amount

						if(dCTRItems)
							items << dCTRItems
				}

				totalchange += pt.change
		}

		// Details of Checks and Card
		// Cards
		cards.each {
			card ->
				totalcards += card.amount

				items << new DCTRItems(
						StringUtils.upperCase(card.paymentTracker.description)+" ${(card.bankEntity ? [card.bankEntity.bankname] : "")}",
						card.amount,
						null,
						"",
						"",
						card.reference ? "REFNUM: ${card.reference}" : ""+"[${card.paymentTracker.createdBy}]",
						"Cards",
						order++

				)
		}

		// Checks
		checks.each {
			check ->
				totalchecks += check.amount

				items << new DCTRItems(
						StringUtils.upperCase(check.paymentTracker.description)+" [${check.bank}]",
						check.amount,
						null,
						"",
						"",
						check.reference ? "REFNUM: ${check.reference}" : ""+"[${check.paymentTracker.createdBy}]",
						"Checks",
						order++

				)
		}

		// Deposits
		deposits.each {
			deposit ->
				totalbankdeposit += deposit.amount

				items << new DCTRItems(
						StringUtils.upperCase(deposit.paymentTracker.description)+" ${(deposit.bankEntity ? [deposit.bankEntity.bankname] : "")}",
						deposit.amount,
						null,
						"",
						"",
						deposit.reference ? "REFNUM: ${deposit.reference}" : ""+"[${deposit.paymentTracker.createdBy}]",
						"Bank Deposits",
						order++

				)
		}

		encashmentShift.each {
			ce ->

				if(ce.returnedShifting) {
					if (ce.shifting.id == shiftId && ce.returnedShifting.id != shiftId) {
						totalchecksEncashment += ce.amount
						def recordNo = ce.recordNo.replaceFirst('^0+(?!$)', "")
						items << new DCTRItems(
								"[${recordNo}]-${ce.bank.bankname}",
								ce.amount,
								null,
								"",
								"",
								"${PaymentType.CHECK.name()}: ${ce.chequeNo ?: ""} [${ce.createdBy}]",
								"Checks Encashment",
								order++
						)
					}

					if (ce.returnedShifting.id == shiftId && ce.shifting.id != shiftId) {
						totalcash += ce.amount
						def recordNo = ce.recordNo.replaceFirst('^0+(?!$)', "")
						items << new DCTRItems(
								"[${recordNo}] - CASH",
								ce.amount,
								null,
								"",
								"",
								"${PaymentType.CHECK.name()}: ${ce.chequeNo ?: ""} [RETURNED] [${ce.createdBy}]",
								"Checks Encashment",
								order++
						)
					}
				}
				else {
					if(ce.shifting.id == shiftId) {
						totalchecksEncashment += ce.amount
						def recordNo = ce.recordNo.replaceFirst('^0+(?!$)', "")
						items << new DCTRItems(
								"[${recordNo}]-${ce.bank.bankname}",
								ce.amount,
								null,
								"",
								"",
								"${PaymentType.CHECK.name()}: ${ce.chequeNo ?: ""} [${ce.createdBy}]",
								"Checks Encashment",
								order++
						)
					}
				}
		}

		parameters.put("totalchecks", totalchecks)
		parameters.put("totalCheckEncashment", totalchecksEncashment)
		parameters.put("totalbankdeposit", totalbankdeposit)
		parameters.put("totalcards", totalcards)
		parameters.put("totalhardcash", totalcash + totalchange)
		parameters.put("netRemainingCash", (totalcash + totalchange) - totalchecksEncashment)

		BigDecimal amountReceived = totalchecks + totalcards + (totalcash + totalchange) + totalbankdeposit
		parameters.put("totalamountreceived", amountReceived)

		def username = SecurityUtils.currentLogin()
		def user = userRepository.findOneByLogin(username)
		def emp = employeeRepository.findOneByUser(user)

		parameters.put("preparedby", emp.fullName)
		parameters.put("preparedbyempno", emp.employeeNo)

		items = items.sort{ s -> s.order}
		try {
			def jrprint = JasperFillManager.fillReport(res.inputStream, parameters, new JRBeanCollectionDataSource(items))
			
			def pdfExporter = new JRPdfExporter()
			
			def outputStreamExporterOutput = new SimpleOutputStreamExporterOutput(os)
			
			pdfExporter.setExporterInput(new SimpleExporterInput(jrprint))
			pdfExporter.setExporterOutput(outputStreamExporterOutput)
			def configuration = new SimplePdfExporterConfiguration()
			pdfExporter.setConfiguration(configuration)
			pdfExporter.exportReport()
			
		} catch (JRException e) {
			e.printStackTrace()
		} catch (IOException e) {
			e.printStackTrace()
		}
		
		def data = os.toByteArray()
		def params = new LinkedMultiValueMap<String, String>()
		params.add("Content-Disposition", "inline;filename=DailyCollection-${shift.shiftno}.pdf".toString())
		return new ResponseEntity(data, params, HttpStatus.OK)
		
	}



	@RequestMapping(method = RequestMethod.GET, value = "/downloadSalesReportForShift")
	Callable<ResponseEntity<byte []>> downloadSalesReportForShift(
			@RequestParam UUID shiftId
	) {
		return new Callable<ResponseEntity<byte[]>>() {
			@Override
			ResponseEntity<byte[]> call() throws Exception {
				def encashmentShift = chequeEncashmentServices.cheqEncashmentByOneShiftId(shiftId)


				StringBuffer buffer = new StringBuffer()

				CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV.withHeader(
						"Allied Care Experts (ACE) Medical Center-Bohol, Inc."))
				csvPrinter.printRecord('COLLECTION REPORT')
				csvPrinter.printRecord('')
				csvPrinter.printRecord('Shift Number', 'Date SFT Start', 'Date SFT End','SFT Status','Terminal ID','OR Number','AR Number','Name of Payee','Transaction Description','Mode of Payment','Card Number','Check Number','Bank Deposit Number','Amount')

				def recordsRaw = namedParameterJdbcTemplate.queryForList(
						"""
				select  
				s.shiftno,
				to_char(date(s.startshift+interval'8 hours'),'YYYY-MM-DD') as "sftStart",
				to_char(date(s.endshift+interval'8 hours'),'YYYY-MM-DD') as "sftEnd",
				case when s.active then 'OPEN' else 'CLOSED' end as "sftStatus",
				concat(c.terminal_id,' ',c.remarks) as "terminalId",
				pt.ornumber,
				split_part(pt.description,'-','2') as "payee",
				bi.description,
				ptd."type",
				ptd.reference,
				ptd.amount
				from cashiering.payment_tracker_details ptd 
				left join cashiering.payment_tracker pt on pt.id  = ptd.payment_tracker
				left join cashiering.shifting s on s.id = pt.shiftid
				left join cashiering.cashierterminals c on c.id  = s.cashier 
				left join billing.billing_item_details bid on cast(bid.field_value as UUID) = pt.id  and bid.field_name = 'PAYTRACKER_ID'
				left join billing.billing_item bi on bi.id = bid.billingitem 
				where (pt.voided is null or pt.voided is false )
				and pt.shiftid = :shiftId	
				"""
				,
				[
						shiftId:shiftId
				])

				recordsRaw.each {

					String shiftNumber = it.get("shiftno","") as String
					String dateSFTStart = it.get("sftStart","") as String
					String dateSFTEnd = it.get("sftEnd","") as String
					String SFTStatus = it.get("sftStatus","") as String
					String terminalID = it.get("terminalId","") as String
					String orNumber = ''
					String arNumber = ''

					String receiptNo = it.get("ornumber","") as String
					switch (receiptNo){
						case 'OR':
							orNumber = receiptNo;
							break;
						case 'AR':
							arNumber = receiptNo;
							break;
						default:
							break;
					}


					String nameOfPayee = it.get("payee","") as String
					String transactionDescription = it.get("shiftno","") as String
					String modeOfPayment =  it.get("type","") as String
					String cardNumber = ''
					String checkNumber = ''
					String depositNumber = ''

					String reference = it.get("reference","")
					switch (modeOfPayment){
						case 'CARD':
							cardNumber = reference;
							break;
						case 'CHECK':
							checkNumber = reference;
							break;
						case 'BANKDEPOSIT':
							depositNumber = reference;
							break;
						default:
							break;
					}

					String amount =  it.get("amount","") as String
					csvPrinter.printRecord(shiftNumber, dateSFTStart, dateSFTEnd,SFTStatus,terminalID,orNumber,arNumber,nameOfPayee,transactionDescription,modeOfPayment,cardNumber,checkNumber,depositNumber,amount)

				}

				LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
				extHeaders.add("Content-Disposition",
						"attachment;filename=collection-report.csv".toString())
				return new ResponseEntity(buffer.toString().getBytes(), extHeaders, HttpStatus.OK)
			}
		}
	}
	
}
