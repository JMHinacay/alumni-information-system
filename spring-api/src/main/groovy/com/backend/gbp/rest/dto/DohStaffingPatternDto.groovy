package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class DohStaffingPatternDto {
	Integer professiondesignation
	Integer specialtyboardcertified
	Integer fulltime40permanent
	Integer fulltime40contractual
	Integer parttimepermanent
	Integer parttimecontractual
	Integer activerotatingaffiliate
	Integer outsourced
	Integer reportingyear
}
