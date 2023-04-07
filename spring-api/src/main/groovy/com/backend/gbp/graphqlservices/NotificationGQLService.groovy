package com.backend.gbp.graphqlservices


import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.Notification
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@TypeChecked
@Component
@GraphQLApi
class NotificationGQLService {
	
	@Autowired
	private com.backend.gbp.services.NotificationService notificationService
	
	@Autowired
	private com.backend.gbp.repository.NotificationRepository notificationRepository
	
	@Autowired
	com.backend.gbp.services.GeneratorService generatorService
	
	@Autowired
	ObjectMapper objectMapper
	
	@Autowired
	com.backend.gbp.repository.UserRepository userRepository
	
	@Autowired
	com.backend.gbp.repository.hrm.EmployeeRepository employeeRepository
	
	//============== All Queries ====================
	
	@GraphQLQuery(name = "mynotifications", description = "Get All My Notifications")
	List<Notification> mynotifications(@GraphQLArgument(name = "id") UUID id) {
		def results = notificationRepository.findTop10ByToOrderByDatenotifiedDesc(id)
		return results
	}
	
	@GraphQLQuery(name = "myownnotifications", description = "Get All My Notifications")
	List<Notification> myownnotifications() {
		
		def username = com.backend.gbp.security.SecurityUtils.currentLogin()
		def user = userRepository.findOneByLogin(username)
		def emp = employeeRepository.findOneByUser(user)
		def results = notificationRepository.findTop10ByToOrderByDatenotifiedDesc(emp.id)
		return results
	}
}
