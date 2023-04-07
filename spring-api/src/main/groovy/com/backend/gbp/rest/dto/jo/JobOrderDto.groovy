package com.backend.gbp.rest.dto.jo

import groovy.transform.TupleConstructor

@TupleConstructor
class JobOrderDto {
	String title
}

@TupleConstructor
class JobOrderListDto {
	String serviceName
	BigDecimal cost
}
