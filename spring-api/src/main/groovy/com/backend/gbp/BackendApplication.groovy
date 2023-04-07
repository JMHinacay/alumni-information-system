package com.backend.gbp

import com.google.common.base.Joiner
import com.backend.gbp.config.Constants
import org.slf4j.LoggerFactory
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.core.env.SimpleCommandLinePropertySource

@SpringBootApplication
class BackendApplication {
	

	private static def log = LoggerFactory.getLogger(BackendApplication)

/*	@Bean
	CommandLineRunner lookup(BillingService  billingService, DatabaseSessionManager databaseSessionManager ) {
		return { args ->


			 databaseSessionManager.bindSession()
			billingService.recompPayments(UUID.fromString("7fbe6bc4-0336-4aca-b600-06ec7f6ab790"))

			databaseSessionManager.unbindSession()

		}
	}*/

//	@Bean
//	CommandLineRunner lookup(SOAPConnector soapConnector) {
//		return { args ->
//			AuthenticationTest request = new AuthenticationTest()
//			request.username = "NEHEHRSV201900114"
//			request.password = "Mahiraphulaan1"
//			AuthenticationTestResponse response =
//					(AuthenticationTestResponse) soapConnector.callWebService("http://uhmistrn.doh.gov.ph/ahsr/webservice/index.php/authenticationTest", request)
//			println("Got Response As below ========= : ")
//			println("Name : "+response.return )
//		}
//	}

//	@Bean
//	CommandLineRunner test() {
//		return { args ->
//			List<LedgerRecord> list = [
//					new LedgerRecord(
//							new AccountingTagValue(
//									AccountingTags.CASH_IN_BANK,
//									null,
//									[SERVICE_ID: "00000"],
//									null,
//									751.0
//							),
//							new AccountingTagValue(
//									AccountingTags.REVENUE_INPATIENT,
//									null,
//									[SERVICE_ID: "00000"],
//									null,
//									251.0
//							)
//
//					),
//					//================================================================== credit
//					new LedgerRecord(
//							new AccountingTagValue(
//									AccountingTags.DUMMY,
//									null,
//									[SERVICE_ID: "00000", ITEMID: "uuid"],
//									true,
//									0.0
//							),
//							new AccountingTagValue(
//									AccountingTags.INVENTORY,
//									null,
//									[SERVICE_ID: "00000"],
//									null,
//									502.0
//							),
//
//					)
//
//			]
//			accountingService.postMedicineSupply(list)
//		}
//	}
	
	static void main(String[] args) {
		
		println("Starting GBP Application...")
		def start = System.currentTimeMillis()

		def app = new SpringApplication(BackendApplication)
		def source = new SimpleCommandLinePropertySource(args)
		
		addDefaultProfile(app, source)
		addLiquibaseScanPackages()
		
		def env = app.run(args).environment
		log.warn("Access URLs:\n----------------------------------------------------------\n\t" +
				"Local: \t\thttp://127.0.0.1:{}\n\t" +
				"External: \thttp://{}:{}\n----------------------------------------------------------",
				env.getProperty("server.port"),
				InetAddress.getLocalHost().hostAddress,
				env.getProperty("server.port"))
		
		def end = System.currentTimeMillis()
		log.warn("Geodetic Business Process Started in : ${(end - start) / 1000} seconds")
		
	}
	
	static def addDefaultProfile(SpringApplication app,
	                             SimpleCommandLinePropertySource propertySource) {
		
		if (!propertySource.containsProperty("spring.profiles.active") && !System.getenv().containsKey("SPRING_PROFILES_ACTIVE")) {
			app.setAdditionalProfiles(Constants.SPRING_PROFILE_DEVELOPMENT)
		}
		
	}
	
	static def addLiquibaseScanPackages() {
		
		System.setProperty("liquibase.scan.packages", Joiner.on(",").join(
				"liquibase.change", "liquibase.database", "liquibase.parser",
				"liquibase.precondition", "liquibase.datatype",
				"liquibase.serializer", "liquibase.sqlgenerator", "liquibase.executor",
				"liquibase.snapshot", "liquibase.logging", "liquibase.diff",
				"liquibase.structure", "liquibase.structurecompare", "liquibase.lockservice",
				"liquibase.ext", "liquibase.changelog"))
		
	}
	
}
