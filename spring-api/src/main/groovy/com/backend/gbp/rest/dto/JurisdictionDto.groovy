package com.backend.gbp.rest.dto

import com.backend.gbp.domain.address.Barangay
import com.backend.gbp.domain.address.Province


class JurisdictionCityDto {
	UUID id
	UUID provinceId
	String cityName
	List<Barangay> barangayList
}

class JurisdictionProvinceDto {
	UUID id
	String provinceName
	ArrayList<JurisdictionCityDto> cityList
}

class JurisdictionDto {
	List<JurisdictionProvinceDto> provinceList
	List<UUID> barangayIds
	UUID officeId
}


//class JurisdictionCityDto {
//	UUID id
//	String cityName
//	ArrayList<Barangay> barangayList
//}
//
//class JurisdictionProvinceDto {
//	UUID id
//	String provinceName
//	ArrayList<JurisdictionCityDto> cityList
//}
//
//class JurisdictionDto {
//	ArrayList<Province> provinceList
//	UUID officeId
//}