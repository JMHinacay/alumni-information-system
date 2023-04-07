package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class PRItemReportDto {
	String description, brand, uop, uou
	Integer content_ratio, qty_uop, onhand, qty_uou, reorder
}

@TupleConstructor
class PRReportDto {
	String prNo, date, supplier, fullname
}

@TupleConstructor
class PRItemNotYetPo {
	UUID id
	String prNo
}
