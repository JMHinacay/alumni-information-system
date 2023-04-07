package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class NurseNotesDto {
	String dateTime, focus, data, action, response, employee
}
