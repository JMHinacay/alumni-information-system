package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class PhysicalReport {
	String descLong
	String unitOfPurchase
	String unitOfUsage
	String itemCategory
	String expiryDate
	Integer onHand
	Integer physicalCount
	Integer variance
	BigDecimal unitCost
	BigDecimal totalCost
}


