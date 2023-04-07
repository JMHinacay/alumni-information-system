package com.backend.gbp.rest.dto

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.Service
import com.backend.gbp.domain.lot.Claimant
import com.backend.gbp.domain.lot.LotInfo
import groovy.transform.Canonical
import groovy.transform.TupleConstructor

@Canonical
class UploadFilesDto {
	Boolean hasLdc
	Boolean hasCad
	Boolean hasSketchPlan
	Boolean hasDenrSketchPlan
	Boolean hasBLPlan
}


