package com.backend.gbp.rest.dto


import groovy.transform.Canonical

@Canonical
class BillingItemDto {
	String description
	Integer quantity
	BigDecimal costPerUnit
	BigDecimal totalCost
	String type
}


