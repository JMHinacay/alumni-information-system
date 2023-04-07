package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class OutputDto {
	String dateTime
	Float voided, foleyCatheter, ng, insesibleLoss, stool, emisis
}
