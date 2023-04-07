package com.hisd3.hismk2.rest

import com.hisd3.hismk2.services.NotificationService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class NotificationResource {
	
	@Autowired
	NotificationService notificationService
	
	@RequestMapping("/testnotification")
	ResponseEntity<String> testnotificaion(
			@RequestParam String message
	) {
		
		notificationService.notifyUsersByRoles(['ROLE_BILLING', 'ROLE_ADMIN'], "A new Warrior has arrived", message, "http://www.google.com")
		
		return ResponseEntity.ok("OK")
		
	}
}
