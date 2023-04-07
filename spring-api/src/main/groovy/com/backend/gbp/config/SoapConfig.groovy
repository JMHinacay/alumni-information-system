package com.backend.gbp.config

import com.backend.gbp.utils.SOAPConnector
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.oxm.jaxb.Jaxb2Marshaller

@Configuration
class SoapConfig {
	
	@Bean
	Jaxb2Marshaller marshaller() {
		Jaxb2Marshaller marshaller = new Jaxb2Marshaller()
		// this is the package name specified in the <generatePackage> specified in
		// pom.xml
		marshaller.setContextPath("ph.gov.doh.uhmistrn.ahsr.webservice.index")
		return marshaller
	}
	
	@Bean
	SOAPConnector soapConnector(Jaxb2Marshaller marshaller) {
		SOAPConnector client = new SOAPConnector()
		client.setDefaultUri("http://uhmistrn.doh.gov.ph/ahsr/webservice/index.php")
		client.setMarshaller(marshaller)
		client.setUnmarshaller(marshaller)
		return client
	}
}
