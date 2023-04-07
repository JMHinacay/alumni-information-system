package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class Msgformat {
	String msgXML
	String senderIp
	String orderslipId
	String pId
	String jsonList
	String casenum
	String docEmpId
	String attachment
	String bacthnum
	String processCode
}
