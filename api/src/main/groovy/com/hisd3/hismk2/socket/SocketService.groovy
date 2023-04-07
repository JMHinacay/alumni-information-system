package com.hisd3.hismk2.socket

import com.hisd3.hismk2.repository.hrm.EmployeeRepository
import groovy.transform.TypeChecked
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessageSendingOperations
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service

@TypeChecked
@Service
class SocketService {
	
	@Autowired
	SocketController socketController
	
	@Autowired
	SimpMessageSendingOperations brokerMessagingTemplate
	
	@Autowired
	SimpMessagingTemplate simpMessagingTemplate
	
	@Autowired
	EmployeeRepository employeeRepository
	
	void helloWithPayload(Message payload) {
		simpMessagingTemplate.convertAndSend("/channel/hello", payload)
	}
	
	void helloToUser(Message payload, String user = 'admin') {
		simpMessagingTemplate.convertAndSendToUser(user, "/channel/notifications", payload)
	}
	
	void payloadToUser(HISD3WebsocketMessage payload, String username) {
		simpMessagingTemplate.convertAndSendToUser(username, "/channel/hello", payload)
	}
	
	void updatesToDepartment(Message payload) {
		simpMessagingTemplate.convertAndSend("/channel/updates", payload)
	}
	
	void notificationToUser(HISD3WebsocketMessage payload, String username) {
		simpMessagingTemplate.convertAndSendToUser(username, "/channel/notifications", payload)
	}
	
	void payloadToUser(HISD3WebsocketMessage payload, String username, String destination) {
		simpMessagingTemplate.convertAndSendToUser(username, destination, payload)
	}
	
	void payloadToEveryone(HISD3WebsocketMessage payload, String destination) {
		simpMessagingTemplate.convertAndSend(destination, payload)
	}
	
}
