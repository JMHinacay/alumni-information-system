package com.backend.gbp.rest.dto

class CreditLimitDto {

	UUID billingId

	Double credit_limit

	Boolean credit_limit_reached = false

	Boolean paid = false


}
