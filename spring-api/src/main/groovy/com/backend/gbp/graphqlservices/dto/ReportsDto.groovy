package com.backend.gbp.graphqlservices.dto


import groovy.transform.Canonical

@Canonical



class ServiceCountPerOfficeDto {
	List<ServiceCountDto> services
	String officeDescription


}

class ServiceCountDto {
	String service
	Integer transactions

}


class TrxnPerActivityPerOfficeDto {
	List<TrxnPerActivityDto> activities
	String officeDescription


}

class TrxnPerActivityDto {
	String activityType
	Integer ongoing
	Integer finished

}

//class DenrUpdateStatusPerOfficeDto {
//	List<DenrUpdateStatusDto> activities
//	String officeDescription
//
//
//}

class DenrUpdateStatusPerOfficeDto {
	Integer pendingToBeWithdrawn
	Integer pendingWithdrawn
	Integer resubmitted
	String officeDescription

}
