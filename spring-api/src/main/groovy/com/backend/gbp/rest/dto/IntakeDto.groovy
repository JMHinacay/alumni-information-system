package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class IntakeDto {
	String dateTime
	Float po, tubeNgt, ivf, blood, tpn, medication
}
