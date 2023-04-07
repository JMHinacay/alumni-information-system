package com.backend.gbp.rest.dto

import com.backend.gbp.domain.DenrUpdates
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.Service
import com.backend.gbp.domain.ServiceStep
import com.backend.gbp.domain.User
import com.backend.gbp.domain.UserActivity
import com.backend.gbp.domain.WeeklyUpdates
import com.backend.gbp.domain.address.Barangay
import com.backend.gbp.domain.address.City
import com.backend.gbp.domain.address.Province
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.lot.LotInfo
import groovy.transform.Canonical
import groovy.transform.TupleConstructor

import java.time.Instant


@Canonical
@TupleConstructor
class TrackerDto {
	LotTransactionDto lotTransaction
	List<UserActivityDto> userActivities
	List<WeeklyUpdatesDto> weeklyUpdates
	List<DenrUpdatesDto> landStatus
	List<DenrUpdatesDto> surveyAuthUpdates
	List<DenrUpdatesDto> denrRegionUpdates


}

//================LOT TRANSACTION DTOS===================
@Canonical
@TupleConstructor
@Canonical
class LotTransactionDto {
	UUID  id
	ServiceDto service
	String serviceName
	LotInfoDto lotInfo
	String lotType
	List<ClaimantDto> claimants
//	Office office
	String status
	String closedType
	String closedBy
	String transactionId
	//location
	String barangayName
	String cityName
	String provinceName
	//owner
	String ownerFirstName
	String ownerLastName
	String ownerMiddleName

}



@TupleConstructor
@Canonical
class ServiceDto {
	UUID id
	String serviceName
	BigDecimal  serviceCost
	Boolean status
	Boolean allowMultipleLot
	String serviceType
}

@TupleConstructor
@Canonical
class ClaimantDto {
	UUID  id
	String claimantFullName
	String claimantAddress
	String claimantContactNo
}

@TupleConstructor
@Canonical
class LotInfoDto {
	UUID id
	String lotType
	Barangay barangay
	City city
	Province province
	String ownerFirstName
	String ownerMiddleName
	String ownerLastName
	List<LotAreaInfoDto> lotAreaInfos
}

@TupleConstructor
@Canonical
class WeeklyUpdatesDto {
	UUID id
	Instant createdDate
	String remarks
}

@TupleConstructor
@Canonical
class LotAreaInfoDto {
	UUID id
	String surveyNo
	String  lotNo
	BigDecimal lotAreaSize
}

@TupleConstructor
@Canonical
class DenrUpdatesDto {
	UUID id
	String updateType
	String currentUnit
	String currentName
	String assignedUnit
	String assignedName
	String remarks
	String status
	String currentlyHandledBy
}


//======================USER DTOS=====================

@TupleConstructor
@Canonical
class PositionDto {
	String description

}

@TupleConstructor
@Canonical
class EmployeeDto {
	String fullName
	PositionDto position
}

@TupleConstructor
@Canonical
class UserDto {
	EmployeeDto employee
}

@TupleConstructor
@Canonical
class UserActivityDto {
	UUID id
	String activityType
	String status
	String forwardedBy
	String landStatus
	UserDto user
	Boolean isOverride
	Boolean isPending
	String pendingType
	String pendingBy
	String remarks
}