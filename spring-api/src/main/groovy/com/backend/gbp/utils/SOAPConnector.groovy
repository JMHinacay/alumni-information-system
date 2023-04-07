package com.backend.gbp.utils

import org.springframework.ws.client.core.support.WebServiceGatewaySupport

class SOAPConnector extends WebServiceGatewaySupport {
	
	Object callWebService(String url, Object request) {
		return getWebServiceTemplate().marshalSendAndReceive(url, request)
	}
	
}
