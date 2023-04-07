package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class ReceivingReportDto {
	String srrNo,
	       date,
	       poNo,
	       refNo,
	       supplier,
	       remarks
//	BigDecimal grossAmount,
//	           totalDiscount,
//	           netDiscount,
//	           amount,
//	           vatRate,
//	           inputTax,
//	           netAmount
}

@TupleConstructor
class ReceivingReportItemDto {
	String item_code
	Integer uou_qty
	String uou_unit
	BigDecimal uop_qty
	String uop_unit
	String item_description
	String expiry
	BigDecimal unit_cost
	BigDecimal input_tax
	BigDecimal inventory
	BigDecimal total
}
