package com.backend.gbp.graphqlservices

import com.backend.gbp.domain.Jurisdiction
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.Service
import com.backend.gbp.domain.address.Barangay
import com.backend.gbp.domain.address.City
import com.backend.gbp.domain.address.Province
import com.backend.gbp.domain.lot.Claimant
import com.backend.gbp.repository.JurisdictionRepository
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.address.BarangayRepository
import com.backend.gbp.repository.address.CityRepository
import com.backend.gbp.repository.address.ProvinceRepository
import com.backend.gbp.rest.dto.JurisdictionDto
import com.backend.gbp.rest.dto.JurisdictionCityDto
import com.backend.gbp.rest.dto.JurisdictionDto
import com.backend.gbp.rest.dto.JurisdictionProvinceDto
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.util.stream.Collectors

@TypeChecked
@Component
@GraphQLApi


class JurisdictionService {

    @Autowired
    JurisdictionRepository jurisdictionRepository

    @Autowired
    ProvinceRepository provinceRepository

    @Autowired
    CityRepository cityRepository

    @Autowired
    BarangayRepository barangayRepository


    @Autowired
    GeneratorService generatorService

    @Autowired
    OfficeRepository officeRepository


    @Autowired
    ObjectMapper objectMapper
    class JurisdictionDto {
        List<Jurisdiction> jurisdictions
        List<UUID> barangayIds


    }

    //============== All Queries ====================

//    @GraphQLQuery(name = "jurisdictionByOfficeId", description = "Get all jurisdiction")
//    JurisdictionDto jurisdictionByOfficeId(@GraphQLArgument(name = "officeId") UUID officeId) {
//        Office office = officeRepository.findById(officeId).get()
//        JurisdictionDto jurisdictionDto = new JurisdictionDto()
//        jurisdictionDto.officeId = office.id
//
//        //===============get barangayIds  ===============
//        List<UUID> barangayIds = []
//        office.jurisdictions.each {
//            barangayIds.add(it.barangay.id)
//        }
//        jurisdictionDto.barangayIds = barangayIds
//        //===============get barangayIds end=============
//
//
//        //===============find distinct city Ids===============
//        List<UUID> cityIds = []
//        office.jurisdictions.each {
//            cityIds.add(it.city.id)
//        }
//        cityIds = cityIds.stream()
//                .distinct()
//                .collect(Collectors.toList());
//        //===============find distinct city Ids end=============
//
//        //===============find distinct provinceIds===============
//        List<UUID> provinceIds = []
//        office.jurisdictions.each {
//            provinceIds.add(it.province.id)
//        }
//        provinceIds = provinceIds.stream()
//                .distinct()
//                .collect(Collectors.toList());
//        //===============find distinct cityIds province end=============
//
//
//
//        List<Barangay> barangayList = barangayRepository.findAllById(barangayIds)
//
//
////        Loop through distinct cities
//        List<City> cityList = cityRepository.findAllById(cityIds)
//        List<JurisdictionCityDto> jurisdictionCityDtoList = new ArrayList<JurisdictionCityDto>()
//        cityList.each {
//            JurisdictionCityDto jurisdictionCityDto =  new JurisdictionCityDto()
//            jurisdictionCityDto.id = it.id
//            jurisdictionCityDto.provinceId = it.province.id
//
//            jurisdictionCityDto.cityName = it.cityName
//            jurisdictionCityDto.barangayList = []
//            barangayList.each {
//                if(it.city.id == jurisdictionCityDto.id)
//                    jurisdictionCityDto.barangayList.add(it)
//            }
//            jurisdictionCityDtoList.add(jurisdictionCityDto)
//        }
//
////        Loop through distinct provinces
//        List<Province> provinceList = provinceRepository.findAllById(provinceIds)
//        List<JurisdictionProvinceDto> jurisdictionProvinceDtoList = new ArrayList<JurisdictionProvinceDto>()
//        provinceList.each {
//
//            JurisdictionProvinceDto jurisdictionProvinceDto =  new JurisdictionProvinceDto()
//            jurisdictionProvinceDto.id = it.id
//            jurisdictionProvinceDto.provinceName = it.provinceName
//            jurisdictionProvinceDto.cityList = []
//
//
//            //loop through every jurisdcitionCityDto and find city with matching province Id
//            jurisdictionCityDtoList.each {
//
//                if(it.provinceId == jurisdictionProvinceDto.id)
//                {
//                    jurisdictionProvinceDto.cityList.add(it)
//                }
//            }
//
//            jurisdictionProvinceDtoList.add(jurisdictionProvinceDto)
//
//        }
//
//
//        //Loop through distinct provinces
////        List<Province> provinceList = provinceRepository.findAllById(provinceIds)
////        List<JurisdictionProvinceDto> jurisdictionProvinceDtoList = new ArrayList<JurisdictionProvinceDto>()
////        provinceList.each {
////            JurisdictionProvinceDto jurisdictionProvinceDto =  new JurisdictionProvinceDto()
////            jurisdictionProvinceDto.provinceName = it.provinceName
////
////
////        }
//        jurisdictionDto.provinceList = jurisdictionProvinceDtoList
//        return jurisdictionDto
////        jurisdictionRepository.findAll().sort { it.barangayName }//equivalent to select *
//    }

    @GraphQLQuery(name = "jurisdictionByOfficeId", description = "Get jurisdiction by office id")
   List <Jurisdiction> jurisdictionByOfficeId(@GraphQLArgument(name = "officeId") UUID officeId) {
        Office office = officeRepository.findById(officeId).get()
        return office.jurisdictions

    }

    @GraphQLQuery(name = "jurisdictionByOfficeIdWithTakenBarangays", description = "Get jurisdiction by office id")
    JurisdictionDto jurisdictionByOfficeIdWithTakenBarangays(@GraphQLArgument(name = "officeId") UUID officeId) {
        Office office = officeRepository.findById(officeId).get()
        JurisdictionDto jurisdictionDto = new JurisdictionDto()
        jurisdictionDto.jurisdictions = office.jurisdictions
        jurisdictionDto.barangayIds= jurisdictionRepository.findAll().barangay.id
        return jurisdictionDto
    }

    @GraphQLQuery(name = "jurisdictionById", description = "Get jurisdiction by id")
    Jurisdiction findById(@GraphQLArgument(name = "id") UUID id) {
        return id ? jurisdictionRepository.findById(id).get() : null
    }

    @GraphQLQuery(name = "jurisdictionByOfficeBarangayProvince", description = "Get jurisdiction by city and province")
    List<Jurisdiction> jurisdictionByBarangayProvince(@GraphQLArgument(name = "city") UUID city,
                                                      @GraphQLArgument(name = "province") UUID province,
                                                      @GraphQLArgument(name = "office") UUID office) {
        if (province) {
            if (city) {
                return jurisdictionRepository.jurisdByOfficeCity(city, office).sort { it.cityName }
            } else {
                return jurisdictionRepository.jurisdByOfficeProvince(province, office).sort { it.barangayName }
            }
        } else {
            return jurisdictionRepository.jurisdByOffice(office).sort { province }
        }
    }


//    @GraphQLQuery(name = "serviceByFilter", description = "Search Service")
//    List<Service> jurisdictionRepository(
//            @GraphQLArgument(name = "filter") String filter,
//            @GraphQLArgument(name = "status") Boolean status,
//            @GraphQLArgument(name = "type") String type
//    ) {
//
//        if(status != null && type != null){
//            jurisdictionRepository.serviceFilterStatusType(filter,status,type).sort { it.serviceName }
//        }else if(status != null && type == null){
//            jurisdictionRepository.serviceFilterStatus(filter,status).sort { it.serviceName }
//        }else if(status == null && type != null){
//            jurisdictionRepository.serviceFilterType(filter,type).sort { it.serviceName }
//        }else{
//            jurisdictionRepository.serviceFilter(filter).sort { it.serviceName }
//        }
//
//    }

//

    //============== All Mutations ====================
    @GraphQLMutation(name = "upsertJurisdiction")
    @Transactional
    List<Jurisdiction> upsertJurisdiction(
            @GraphQLArgument(name = "barangayIds") List<UUID> barangayIds,
            @GraphQLArgument(name = "officeId") UUID officeId
    ) {
//        Service op = new Service()
        Office office = officeRepository.findById(officeId).get()
        office.jurisdictions.clear()
        List<Barangay> barangayList = barangayRepository.findAllById(barangayIds)

        List<Jurisdiction> jurisdictionList = new ArrayList<Jurisdiction>()

//        barangayList.each {
//            Jurisdiction jurisdiction = new Jurisdiction()
//            jurisdiction.barangay.id = it.id
//            jurisdiction.city.id = it.city.id
//            jurisdiction.province.id = it.province.id
//            jurisdiction.office.id = officeId
//            jurisdictionList.add(jurisdiction)
//        }

        barangayList.each {
            Jurisdiction jurisdiction = new Jurisdiction()
            jurisdiction.barangay = it
            jurisdiction.city = it.city
            jurisdiction.province = it.province
            jurisdiction.office = office
            jurisdictionList.add(jurisdiction)
        }
        jurisdictionRepository.saveAll(jurisdictionList)


    }

}
