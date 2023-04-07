package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class ChargeSlipDto {
	String description
	BigDecimal price, subTotal
	Integer qty
	String requesting
	String itemNo
}
