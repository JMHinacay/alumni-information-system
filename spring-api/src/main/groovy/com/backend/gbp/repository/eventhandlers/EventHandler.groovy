package com.backend.gbp.repository.eventhandlers

import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.NotificationService
import groovy.transform.TypeChecked
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.rest.core.annotation.*

import javax.transaction.Transactional


@TypeChecked
@RepositoryEventHandler
@Transactional
class EventHandler {

	@Autowired
	GeneratorService generatorService

	@Autowired
	EmployeeRepository employeeRepository


	@Autowired
	NotificationService notificationService


	//event handler here ....
}
