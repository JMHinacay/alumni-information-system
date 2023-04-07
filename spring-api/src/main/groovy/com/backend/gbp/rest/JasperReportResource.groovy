package com.backend.gbp.rest

import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.lot.LotTransaction
import com.backend.gbp.repository.billing.BillingRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.lot.LotTransactionRepository
import com.backend.gbp.rest.dto.BillingItemDto
import com.backend.gbp.rest.dto.LotAreaInfoDto
import com.backend.gbp.rest.dto.jo.JobOrderDto
import com.backend.gbp.rest.dto.jo.JobOrderListDto
import com.backend.gbp.security.SecurityUtils
import com.google.gson.Gson
import groovy.transform.TypeChecked
import net.sf.jasperreports.engine.JRException
import net.sf.jasperreports.engine.JasperFillManager
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource
import net.sf.jasperreports.engine.data.JsonDataSource
import net.sf.jasperreports.engine.export.JRPdfExporter
import net.sf.jasperreports.export.SimpleExporterInput
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput
import net.sf.jasperreports.export.SimplePdfExporterConfiguration
import org.apache.commons.io.IOUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import java.time.ZoneId
import java.time.format.DateTimeFormatter

@TypeChecked
@RestController
@RequestMapping('/print')
class JasperReportResource {
	
	@Autowired
	ApplicationContext applicationContext

	@Autowired
	EmployeeRepository employeeRepository

	@Autowired
	BillingRepository billingRepository

	@Autowired
	LotTransactionRepository lotTransactionRepository
	
	//job order print
	@RequestMapping(value = ['/job-order/{id}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> prReport(@PathVariable('id') String id) {
		//get data

		Employee emp = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()

		def res = applicationContext?.getResource("classpath:/reports/joborders/job_order.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/logo.png")
//		def itemsDto = new ArrayList<JobOrderListDto>() //list
//		def list = ["Relocation","Subdivision","Consolidation"]

		LotTransaction lotTransaction = lotTransactionRepository.findById(UUID.fromString(id)).get()
		Billing billing = billingRepository.findByLotTransactionId(lotTransaction.id)

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())

		def dto = new JobOrderDto(
				title: "Sample Title",
		
		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).bytes)
		def dataSource = new JsonDataSource(dataSourceByteArray)

		def billingItems = new ArrayList<BillingItemDto>() //list
		if (billing) {
			billing.billingItems.each {
			if(it.type == "SERVICE" || "BILLING_ITEM")
			{
				def item = new BillingItemDto(
						description: it.description,
						quantity: it.quantity,
						costPerUnit: it.cost,
						totalCost: it.totalCost,
						type:  it.type,
				)
				billingItems.add(item)
			}
			}
		}
		if (billingItems) {
			parameters.put('billing_items', new JRBeanCollectionDataSource(billingItems))
		}


		def lotAreaInfos = new ArrayList<LotAreaInfoDto>() //list
		if (lotTransaction) {
			lotTransaction.lotInfo.lotAreaInfos.each {
					def lotArea = new LotAreaInfoDto(
							lotNo: it.lotNo,
							surveyNo: it.surveyNo,
							lotAreaSize: it.lotAreaSize
					)
				lotAreaInfos.add(lotArea)
			}
		}
		if (lotAreaInfos) {
			parameters.put('lot_area_information', new JRBeanCollectionDataSource(lotAreaInfos))
		}

//		if (list) {
//			list.each {
//
//					def itemDto = new JobOrderListDto(
//							serviceName: it,
//							cost: BigDecimal.valueOf(6000),
//					)
//					itemsDto.add(itemDto)
//			}
//		}

//		if (itemsDto) {
//			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
//		}


		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}
		String lotLocation = lotTransaction.lotInfo.barangayName + ', ' + lotTransaction.lotInfo.cityName + ', ' + lotTransaction.lotInfo.provinceName

		//header
		//if(query_varaible){
		parameters.put('client_name', lotTransaction.claimants[0].claimantFullName)
		parameters.put('lot_location', lotLocation)


			parameters.put('company_address', "Address 1") //variable name , value
			parameters.put('company_address2', "Address 1")
			parameters.put('company_email', "email@email.com")
			parameters.put('company_name', "Company Name")
			parameters.put('company_contacy_no', "09876567843")


		//}

		//printing
		try {
			def jrprint = JasperFillManager.fillReport(res.inputStream, parameters, dataSource)
			
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
		
		if (bytearray != null)
			IOUtils.closeQuietly(bytearray)
		//end
		
		def data = os.toByteArray()
		def params = new LinkedMultiValueMap<String, String>()
		params.add("Content-Disposition", "inline;filename=JOB-ORDER-\"" + "ORDER-NO" + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}


//	@RequestMapping(value = ['/lot-transaction/{id}'], produces = ['application/pdf'])
//	ResponseEntity<byte[]> lotTransactionReport(@PathVariable('id') String id) {
//		//get data
//
//		Employee emp = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()
//
//		def res = applicationContext?.getResource("classpath:/reports/joborders/transaction.jasper")
//		def bytearray = new ByteArrayInputStream()
//		def os = new ByteArrayOutputStream()
//		def parameters = [:] as Map<String, Object>
//		def logo = applicationContext?.getResource("classpath:/reports/logo.png")
////		def itemsDto = new ArrayList<JobOrderListDto>() //list
////		def list = ["Relocation","Subdivision","Consolidation"]
//
//		LotTransaction lotTransaction = lotTransactionRepository.findById(UUID.fromString(id)).get()
//		Billing billing = billingRepository.findByLotTransactionId(lotTransaction.id)
//
//		DateTimeFormatter dateFormat =
//				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
//
//		def dto = new JobOrderDto(
//				title: "Sample Title",
//
//		)
//		def gson = new Gson()
//		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).bytes)
//		def dataSource = new JsonDataSource(dataSourceByteArray)
//
//		def billingItems = new ArrayList<BillingItemDto>() //list
//		if (billing) {
//			billing.billingItems.each {
//				if(it.type == "SERVICE" || "BILLING_ITEM")
//				{
//					def item = new BillingItemDto(
//							description: it.description,
//							quantity: it.quantity,
//							cost: it.cost,
//							type:  it.type,
//					)
//					billingItems.add(item)
//				}
//			}
//		}
//		if (billingItems) {
//			parameters.put('billingItems', new JRBeanCollectionDataSource(billingItems))
//		}
//
//
//		def lotAreaInfos = new ArrayList<LotAreaInfoDto>() //list
//		if (lotTransaction) {
//			lotTransaction.lotInfo.lotAreaInfos.each {
//				def lotArea = new LotAreaInfoDto(
//						lotNo: it.lotNo,
//						surveyNo: it.surveyNo,
//						lotAreaSize: it.lotAreaSize
//				)
//				lotAreaInfos.add(lotArea)
//			}
//		}
//		if (lotAreaInfos) {
//			parameters.put('lot_area_information', new JRBeanCollectionDataSource(lotAreaInfos))
//		}
//
////		if (list) {
////			list.each {
////
////					def itemDto = new JobOrderListDto(
////							serviceName: it,
////							cost: BigDecimal.valueOf(6000),
////					)
////					itemsDto.add(itemDto)
////			}
////		}
//
////		if (itemsDto) {
////			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
////		}
//
//
//		if (logo.exists()) {
//			parameters.put("logo", logo?.getURL())
//		}
//		String lotLocation = lotTransaction.lotInfo.barangayName + ', ' + lotTransaction.lotInfo.cityName + ', ' + lotTransaction.lotInfo.provinceName
//
//		//header
//		//if(query_varaible){
//		parameters.put('client_name', lotTransaction.claimants[0].claimantFullName)
//		parameters.put('lot_location', lotLocation)
//
//
//		parameters.put('company_address', "Address 1") //variable name , value
//		parameters.put('company_address2', "Address 1")
//		parameters.put('company_email', "email@email.com")
//		parameters.put('company_name', "Company Name")
//		parameters.put('company_contacy_no', "09876567843")
//
//
//		//}
//
//		//printing
//		try {
//			def jrprint = JasperFillManager.fillReport(res.inputStream, parameters, dataSource)
//
//			def pdfExporter = new JRPdfExporter()
//
//			def outputStreamExporterOutput = new SimpleOutputStreamExporterOutput(os)
//
//			pdfExporter.setExporterInput(new SimpleExporterInput(jrprint))
//			pdfExporter.setExporterOutput(outputStreamExporterOutput)
//			def configuration = new SimplePdfExporterConfiguration()
//			pdfExporter.setConfiguration(configuration)
//			pdfExporter.exportReport()
//
//		} catch (JRException e) {
//			e.printStackTrace()
//		} catch (IOException e) {
//			e.printStackTrace()
//		}
//
//		if (bytearray != null)
//			IOUtils.closeQuietly(bytearray)
//		//end
//
//		def data = os.toByteArray()
//		def params = new LinkedMultiValueMap<String, String>()
//		params.add("Content-Disposition", "inline;filename=JOB-ORDER-\"" + "ORDER-NO" + "\".pdf")
//		return new ResponseEntity(data, params, HttpStatus.OK)
//	}





//	@RequestMapping(value = ['/receiving_report/{id}'], produces = ['application/pdf'])
//	ResponseEntity<byte[]> reReport(@PathVariable('id') UUID id) {
//		//query
//		def receiving = receivingReportRepository.findById(id).get()
//		def receivingItem = receivingReportItemRepository.findItemsByReceivingReportId(id).sort { it.item.descLong }
//
//		def res = applicationContext?.getResource("classpath:/reports/inventory/receiving_report.jasper")
//		def bytearray = new ByteArrayInputStream()
//		def os = new ByteArrayOutputStream()
//		def parameters = [:] as Map<String, Object>
//		def logo = applicationContext?.getResource("classpath:/reports/logo.png")
//		def itemsDto = new ArrayList<ReceivingReportItemDto>()
//
//		DateTimeFormatter dateFormat =
//				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
//		def dto = new ReceivingReportDto(
//				srrNo: receiving?.rrNo,
//				date: dateFormat.format(receiving?.receiveDate),
//				poNo: receiving?.purchaseOrder?.poNumber ? receiving?.purchaseOrder?.poNumber : '',
//				refNo: receiving.receivedRefNo,
//				supplier: receiving?.supplier?.supplierFullname,
//				remarks: receiving?.receivedRemarks ? receiving?.receivedRemarks : ''
////				grossAmount: receiving.grossAmount,
////				totalDiscount: receiving.totalDiscount,
////				netDiscount: receiving.netDiscount,
////				amount: receiving.amount,
////				vatRate: receiving.vatRate,
////				inputTax: receiving.inputTax,
////				netAmount: receiving.netAmount,
//		)
//		def gson = new Gson()
//		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).bytes)
//		def dataSource = new JsonDataSource(dataSourceByteArray)
//
//		if (receivingItem) {
//			receivingItem.each {
//				it ->
//					def itemDto = new ReceivingReportItemDto(
//							item_code: it.item?.itemCode,
//							uou_qty: it.receiveQty,
//							uou_unit: it.item?.unit_of_usage?.unitDescription,
//							uop_qty: it.receiveQty / it.item?.item_conversion,
//							uop_unit: it.item?.unit_of_purchase?.unitDescription,
//							item_description: it.item?.descLong,
//							expiry: it?.expirationDate ? dateFormat.format(it?.expirationDate) : '',
//							unit_cost: it.receiveUnitCost,
//							input_tax: it.inputTax,
//							inventory: receiving?.vatInclusive ? it.netAmount : it.totalAmount,
//							total: receiving?.vatInclusive ? it.totalAmount : it.netAmount
//					)
//					itemsDto.add(itemDto)
//			}
//		}
//
//		Employee emp = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()
//		List<Signature> signList = signatureService.signatureList("DR").sort({it.sequence})
//		def signColumn1 = new ArrayList<SignatureReportDto>()
//		def signColumn2 = new ArrayList<SignatureReportDto>()
//
//		if (signList) {
//			Integer count = 1
//			signList.each {
//				it ->
//					def signData
//					if(it.currentUsers){
//						signData = new SignatureReportDto(
//								signatureHeader: it.signatureHeader,
//								signaturies: emp.fullName,
//								position: it.signaturePosition,
//						)
//					}
//					else{
//						signData = new SignatureReportDto(
//								signatureHeader: it.signatureHeader,
//								signaturies: (it.signaturePerson != null) ? it.signaturePerson : "",
//								position: it.signaturePosition,
//						)
//					}
//
//					if(count == 1)
//					{
//						signColumn1.add(signData)
//					} else if(count == 2)
//					{
//						signColumn2.add(signData)
//						count = 0
//					}
//					count++
//			}
//		}
//
//
//		if (signColumn1) {
//			parameters.put('sign_column1', new JRBeanCollectionDataSource(signColumn1))
//		}
//		if (signColumn2) {
//			parameters.put('sign_column2', new JRBeanCollectionDataSource(signColumn2))
//		}
//
//		if (logo.exists()) {
//			parameters.put("logo", logo?.getURL())
//		}
//
//		if (itemsDto) {
//			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
//		}
//
//		if(hospitalConfigService?.hospitalInfo){
//			String nameWithAddress = ""
//			String address = ""
//			String address2 = ""
//
//			address +=  hospitalConfigService?.hospitalInfo?.address
//			address +=  hospitalConfigService?.hospitalInfo?.addressLine2
//
//			if(hospitalConfigService?.hospitalInfo?.hospitalName) nameWithAddress += hospitalConfigService?.hospitalInfo?.hospitalName + " "
//			if(hospitalConfigService?.hospitalInfo?.city) address2 += hospitalConfigService?.hospitalInfo?.city + ", "
//			if(hospitalConfigService?.hospitalInfo?.street) address2 += hospitalConfigService?.hospitalInfo?.street + ", "
//			if(hospitalConfigService?.hospitalInfo?.zip) address2 += hospitalConfigService?.hospitalInfo?.zip
//
//			nameWithAddress += address
//
//			parameters.put('hospitalAddress', address)
//			parameters.put('hospitalAddress2', address2)
//			parameters.put('hospitalEmail', hospitalConfigService?.hospitalInfo?.email)
//			parameters.put('hospitalName', nameWithAddress?:"")
//			parameters.put('hospitalContactNo', hospitalConfigService?.hospitalInfo?.telNo?:"")
//
//		}
//
//		//printing
//		try {
//			def jrprint = JasperFillManager.fillReport(res.inputStream, parameters, dataSource)
//
//			def pdfExporter = new JRPdfExporter()
//
//			def outputStreamExporterOutput = new SimpleOutputStreamExporterOutput(os)
//
//			pdfExporter.setExporterInput(new SimpleExporterInput(jrprint))
//			pdfExporter.setExporterOutput(outputStreamExporterOutput)
//			def configuration = new SimplePdfExporterConfiguration()
//			pdfExporter.setConfiguration(configuration)
//			pdfExporter.exportReport()
//
//		} catch (JRException e) {
//			e.printStackTrace()
//		} catch (IOException e) {
//			e.printStackTrace()
//		}
//
//		if (bytearray != null)
//			IOUtils.closeQuietly(bytearray)
//		//end
//
//		def data = os.toByteArray()
//		def params = new LinkedMultiValueMap<String, String>()
//		//params.add("Content-Disposition", "inline;filename=Discharge-Instruction-of-\"" + caseDto?.patient?.fullName + "\".pdf")
//		params.add("Content-Disposition", "inline;filename=Receiving-Report-of-\"" + receiving?.rrNo + "\".pdf")
//		return new ResponseEntity(data, params, HttpStatus.OK)
//	}
	

}
