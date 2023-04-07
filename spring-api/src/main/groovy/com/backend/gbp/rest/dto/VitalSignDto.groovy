package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class VitalSignDto {
	String dateTime, systolic, diastolic, temp, pulse, resp, o2Sat, painScore, heartRate
}
