package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class SignatureReportDto {
	String signatureHeader
	String signaturies
	String position
}


