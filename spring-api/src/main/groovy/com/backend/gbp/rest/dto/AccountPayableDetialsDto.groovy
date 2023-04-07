package com.backend.gbp.rest.dto


import groovy.transform.TupleConstructor


@TupleConstructor
class AccountPayableDetialsDto {

	String id
	Map<String, Object> transType
	Map<String, Object> department

	BigDecimal amount
	BigDecimal discRate
	BigDecimal discAmount
	BigDecimal vatAmount
	Boolean vatInclusive
	String taxDesc

	BigDecimal ewtRate
	BigDecimal ewtAmount
	BigDecimal netAmount
	String remarksNotes
	String refNo
	Boolean isNew

}

class TransTypeDto{
	UUID id
	String description
}

class DepDto{
	UUID id
	String departmentName
}



