package com.backend.gbp.services


import com.backend.gbp.domain.hrm.Employee
import groovy.transform.TypeChecked
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service

/**
 *  For optimization purpose, methods are marked Async... But it will also loses Transaction.
 *  AOP is handled from another class NotificationServiceTransaction
 *
 */
@Service
@TypeChecked
class NotificationService {
	
	@Autowired
	NotificationServiceTransaction notificationServiceTransaction
	
	@Async
	void notifyUser(UUID userid, String title, String message) {
		notificationServiceTransaction.notifyUser(userid, title, message)
	}
	
	@Async
	void notifyUser(UUID userid, String title, String message, String url) {
		
		notificationServiceTransaction.notifyUser(userid, title, message, url)
		
	}
	
	@Async
	void notifyUsers(List<Employee> employees, String title, String message) {
		notificationServiceTransaction.notifyUsers(employees, title, message)
	}
	
	@Async
	void notifyUsers(List<Employee> employees, String title, String message, String url) {
		notificationServiceTransaction.notifyUsers(employees, title, message, url)
	}
	
	@Async
	void notifyUsersOfDepartment(UUID departmentid, String title, String message, String url) {
		notificationServiceTransaction.notifyUsersOfDepartment(departmentid, title, message, url)
	}

	
	@Async
	void notifyUsersByRoles(List<String> roles, String title, String message, String url) {
		
		notificationServiceTransaction.notifyUsersByRoles(roles, title, message, url)
	}

}
