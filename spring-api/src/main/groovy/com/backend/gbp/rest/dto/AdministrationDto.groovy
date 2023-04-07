package com.backend.gbp.rest.dto


import java.time.Instant

class AdministrationDto {
	
	UUID id
	
	String medicine
	
	String action
	
	String dose
	
	String remarks
	
	Instant entryDateTime

	String entryDateTimeText
	
	com.backend.gbp.domain.hrm.Employee employee
	
	Boolean patientOwn = false
	
	AdministrationDto(UUID id, String medicine, String action, String dose, String remarks, Instant entryDateTime, com.backend.gbp.domain.hrm.Employee employee, Boolean patientOwn) {
		this.id = id
		this.medicine = medicine
		this.action = action
		this.dose = dose
		this.remarks = remarks
		this.entryDateTime = entryDateTime
		this.employee = employee
		this.patientOwn = patientOwn
	}

	AdministrationDto(UUID id, String medicine, String action, String dose, String remarks, Instant entryDateTime, String entryDateTimeText, com.backend.gbp.domain.hrm.Employee employee, Boolean patientOwn) {
		this.id = id
		this.medicine = medicine
		this.action = action
		this.dose = dose
		this.remarks = remarks
		this.entryDateTime = entryDateTime
		this.employee = employee
		this.patientOwn = patientOwn
		this.entryDateTimeText = entryDateTimeText
	}
}
