package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class PatientInfoDto {
	String date,
	       pin,
	       caseNo,
	       roomNo,
	       patientFullName,
	       age,
	       gender,
	       civilStatus,
	       dob,
	       address,
	       attendingPhysician,
	       licenseNo,
	       dateAdmitted,
	       dateDischarged,
	       followUpDate,
	       nurseName,
	       admittingDiagnosis,
			preparedByFullName
}
