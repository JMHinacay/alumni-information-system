package com.backend.gbp.rest.dto

class PurchaseRequestDto {
	public String date_needed = null
	public String supplier = null
	public String request_to = null
	public String request_type = null
	public String requested_by = null
	public String requestingDep = null
	public String user_id = null
	
}

class PrItems {
	String id
	String supplierItemId
	String itemId
	String itemDesc
	Integer qty
	BigDecimal cost
	BigDecimal total
	Integer onHand
	String prItemId
	String uop
}

