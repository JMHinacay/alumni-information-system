package com.hisd3.hismk2.services

import com.fasterxml.jackson.databind.ObjectMapper
import com.hisd3.hismk2.domain.Authority
import com.hisd3.hismk2.domain.Department
import com.hisd3.hismk2.domain.Notification
import com.hisd3.hismk2.domain.hrm.Employee
import com.hisd3.hismk2.domain.hrm.Payroll
import com.hisd3.hismk2.domain.inventory.StockRequest
import com.hisd3.hismk2.repository.AuthorityRepository
import com.hisd3.hismk2.repository.DepartmentRepository
import com.hisd3.hismk2.repository.NotificationRepository
import com.hisd3.hismk2.repository.UserRepository
import com.hisd3.hismk2.repository.hrm.EmployeeRepository
import com.hisd3.hismk2.security.SecurityUtils
import com.hisd3.hismk2.socket.HISD3MessageType
import com.hisd3.hismk2.socket.HISD3WebsocketMessage
import com.hisd3.hismk2.socket.PayrollCalculatingMessage
import com.hisd3.hismk2.socket.SocketController
import com.hisd3.hismk2.socket.SocketService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessageSendingOperations
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
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
	DepartmentRepository departmentRepository
	
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
	void notifyUsersOfDepartments(List<Department> departments, String title, String message, String url) {
		departments.each {
			it ->
				List<Employee> employeeList = employeeRepository.findEmployeesByDepartment(it.id)
				for (Employee emp : employeeList) {
					notifyUser(emp.id, title, message, url)
				}
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
	
	/*void notifyGroups(List<String> groups, String title, String message) {
			List<Department> recipient = []
			groups.each {
					def dept = departmentRepository.departmentsAlike(it)
					if (dept.size() > 0) {
							recipient.add(dept.first())
					}
			}

			if (recipient.size() > 0) {
					recipient.each {
							it ->
									notifyUsersOfDepartment(it.id, title, message)
					}
			}
	}*/
	
	@Transactional
	void notifyGroups(List<String> groups, String title, String message, String url) {
		List<Department> recipient = []
		groups.each {
			def dept = departmentRepository.departmentsAlike(it)
			if (dept.size() > 0) {
				recipient.add(dept.first())
			}
		}
		
		if (recipient.size() > 0) {
			recipient.each {
				it ->
					notifyUsersOfDepartment(it.id, title, message, url)
			}
		}
	}
	
	@Transactional
	void notifyNewStockRequest(StockRequest stockRequest) {
		try {

			HISD3WebsocketMessage payload = new HISD3WebsocketMessage()
			payload.message = "New Medicine Request : MSR # " + stockRequest.stockRequestNo
			payload.type = HISD3MessageType.STOCK_REQUEST_LIST_NEW
            List<Employee> employees = employeeRepository.findEmployeesByDepartment(stockRequest.requestedDepartment.id)
            for (Employee emp : employees) {
                simpMessagingTemplate.convertAndSendToUser(emp.user.login, "/channel/notifications", payload)
               // simpMessagingTemplate.convertAndSendToUser(emp.user.login, "/channel/medicationStockRequest", payload)
            }

		} catch (Exception e) {
			e.printStackTrace()
		}
		
	}
	
	@Transactional
	void notifySentClaimableStockRequest(StockRequest stockRequest) {
		try {
			HISD3WebsocketMessage payload = new HISD3WebsocketMessage()
			payload.message = "Medicine Request : MSR # " + stockRequest.stockRequestNo + " is now " + stockRequest.status
			payload.type = HISD3MessageType.STOCK_REQUEST_LIST_CLAIMABLE
			simpMessagingTemplate.convertAndSend("/channel/notifications", payload)
			List<Employee> employees = employeeRepository.findEmployeesByDepartment(stockRequest.requestingDepartment.id)
			for (Employee emp : employees) {
				simpMessagingTemplate.convertAndSendToUser(emp.user.login, "/channel/notifications", payload)
			}
		}
		catch (Exception e) {
			e.printStackTrace()
		}
		
	}

	@Transactional
	void notifyPayrollCalculationProgress(String login, Payroll payroll, progress, total) {
		try {
			PayrollCalculatingMessage payload = new PayrollCalculatingMessage()
			payload.payroll = payroll
			payload.progress = progress
			payload.total = total
			payload.type = HISD3MessageType.PAYROLL_CALCULATION_PROGRESS
			simpMessagingTemplate.convertAndSendToUser(login, "/channel/payroll",payload)
//			List<Employee> employees = employeeRepository.findEmployeesByDepartment(stockRequest.requestingDepartment.id)
//			for (Employee emp : employees) {
//				simpMessagingTemplate.convertAndSendToUser(emp.user.login, "/channel/notifications", payload)
//			}
		}
		catch (Exception e) {
			e.printStackTrace()
		}

	}
	
}
