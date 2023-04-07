package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class MedPlansDto {
	String generic_name
	Integer quantity
	BigDecimal total_cost
}
