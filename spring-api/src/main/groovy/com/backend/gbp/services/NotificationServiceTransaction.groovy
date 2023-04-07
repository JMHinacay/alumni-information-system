package com.backend.gbp.services

import com.backend.gbp.repository.AuthorityRepository
import com.backend.gbp.repository.NotificationRepository
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.Authority

import com.backend.gbp.domain.Notification
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.socket.HISD3MessageType
import com.backend.gbp.socket.HISD3WebsocketMessage

import com.backend.gbp.socket.SocketController
import com.backend.gbp.socket.SocketService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessageSendingOperations
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service

import javax.transaction.Transactional
import java.time.Instant

@Service
class NotificationServiceTransaction {
	
	@Autowired
	SocketService socketService
	
	@Autowired
	NotificationRepository notificationRepository
	
	@Autowired
	EmployeeRepository employeeRepository
	
	@Autowired
	UserRepository userRepository
	
	@Autowired
	AuthorityRepository authorityRepository
	
	@Autowired
	SocketController socketController
	
	@Autowired
	SimpMessageSendingOperations brokerMessagingTemplate
	
	@Autowired
	SimpMessagingTemplate simpMessagingTemplate
	
	@Autowired
	private ObjectMapper objectMapper
	
	@Transactional
	void notifyUser(UUID userid, String title, String message) {
		try {
			Employee e = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()
			Employee eto = employeeRepository.getOne(userid)
			
			if (eto.user) {
				Notification notification = new Notification()
				notification.message = message
				notification.to = userid
				notification.from = e.id
				notification.title = title
				notification.datenotified = Instant.now()
				notificationRepository.save(notification)
				HISD3WebsocketMessage payload = new HISD3WebsocketMessage(e.fullName, message, title, HISD3MessageType.NOTIFICATION_NEW)
				socketService.notificationToUser(payload, eto.user.login)
			}
		}
		catch (Exception e) {
			e.printStackTrace()
		}
		
	}
	
	@Transactional
	void notifyUser(UUID userid, String title, String message, String url) {
		try {
			Employee e = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()
			Employee eto = employeeRepository.getOne(userid)
			
			if (eto.user) {
				Notification notification = new Notification()
				notification.message = message
				notification.to = userid
				notification.from = e.id
				notification.title = title
				notification.datenotified = Instant.now()
				notificationRepository.save(notification)
				HISD3WebsocketMessage payload = new HISD3WebsocketMessage(e.fullName, message, title, HISD3MessageType.NOTIFICATION_NEW)
				socketService.notificationToUser(payload, eto.user.login)
			}
		}
		catch (Exception e) {
			e.printStackTrace()
		}
		
	}
	
	@Transactional
	void notifyUsers(List<Employee> employees, String title, String message) {
		for (Employee emp : employees) {
			notifyUser(emp.id, title, message)
		}
	}
	
	@Transactional
	void notifyUsers(List<Employee> employees, String title, String message, String url) {
		for (Employee emp : employees) {
			notifyUser(emp.id, title, message, url)
		}
	}
	
	/*void notifyUsersOfDepartment(UUID departmentid, String title, String message) {
			List<Employee> employeeList = employeeRepository.findEmployeesByDepartment(departmentid)
			for (Employee emp : employeeList) {
					notifyUser(emp.id, title, message)
			}
	}*/
	
	@Transactional
	void notifyUsersOfDepartment(UUID departmentid, String title, String message, String url) {
		List<Employee> employeeList = employeeRepository.findEmployeesByDepartment(departmentid)
		for (Employee emp : employeeList) {
			notifyUser(emp.id, title, message, url)
		}
	}

	
	@Transactional
	void notifyUsersByRoles(List<String> roles, String title, String message, String url) {
		
		def authorities = []
		roles.each {
			authorities << new Authority(it)
		}
		def users = userRepository.findUserByRoles(authorities)
		Set<String> logins = new HashSet<>()
		users.each {
			if (!logins.contains(it.login)) {
				def emp = it.employee
				if (emp) {
					notifyUser(emp.id, title, message, url)
				}
				logins.add(it.login)
			}
		}
		
		//roles.eachWithIndex { String entry, int i ->
		//def authority = authorityRepository.findOneByName(entry)
		/*def users = employeeRepository.findAll()
		if(users) {
				users.each { Employee emp ->
						if(authority in emp.user?.authorities){
								notifyUser(emp.id, title, message, url)
						}
				}

		}*/
		//}
	}

	
}
