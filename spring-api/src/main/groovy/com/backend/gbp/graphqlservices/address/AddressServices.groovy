package com.backend.gbp.graphqlservices.address

import com.backend.gbp.domain.address.Barangay
import com.backend.gbp.domain.address.City
import com.backend.gbp.domain.address.Country
import com.backend.gbp.domain.address.Province
import com.backend.gbp.domain.address.Region
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.address.BarangayRepository
import com.backend.gbp.repository.address.CityRepository
import com.backend.gbp.repository.address.CountryRepository
import com.backend.gbp.repository.address.ProvinceRepository
import com.backend.gbp.repository.address.RegionRepository
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@TypeChecked
@Component
@GraphQLApi
class AddressServices {

    @Autowired
    CountryRepository countryRepository

    @Autowired
    ProvinceRepository provinceRepository

    @Autowired
    CityRepository cityRepository

    @Autowired
    BarangayRepository barangayRepository

    @Autowired
    RegionRepository regionRepository

    @Autowired
    ObjectMapper objectMapper


    @GraphQLQuery(name = "countries", description = "Search all countries")
    List<Country> getAllCountries() {
        countryRepository.findAll()
    }

    @GraphQLQuery(name = "countriesByFilter", description = "Search all countries")
    List<Country> searchCountryByFilter(@GraphQLArgument(name = "filter") String filter) {
        countryRepository.searchCountryByFilter(filter).sort { it.country }
    }

    @GraphQLQuery(name = "regionFilter")
    List<Region> regionFilter(@GraphQLArgument(name = "filter") String filter) {
        regionRepository.searchRegionByFilter(filter).sort { it.name }
    }

    @GraphQLQuery(name = "regions", description = "Search all countries")
    List<Region> getAllRegions() {
        regionRepository.findAll()
    }

    @GraphQLQuery(name = "provinceFilter")
    List<Province> provinceFilter(@GraphQLArgument(name = "filter") String filter) {
        provinceRepository.searchProvinceByFilter(filter).sort { it.name }
    }

    @GraphQLQuery(name = "provinceByRegion")
    List<Province> provinceByRegion(@GraphQLArgument(name = "id") UUID id) {
        provinceRepository.provinceByRegions(id).sort { it.name }
    }

    @GraphQLQuery(name = "provinces")
    List<Province> provinces() {
        provinceRepository.findAll().sort { it.name }
    }

    @GraphQLQuery(name = "cityFilter")
    List<City> cityFilter(@GraphQLArgument(name = "filter") String filter) {
        cityRepository.searchCitiesName(filter).sort { it.name }
    }

    @GraphQLQuery(name = "cityByProvince")
    List<City> cityByProvince(@GraphQLArgument(name = "id") UUID id) {
        cityRepository.cityByProvince(id).sort { it.name }
    }

    @GraphQLQuery(name = "barangayFilter")
    List<Barangay> barangayFilter(@GraphQLArgument(name = "filter") String filter) {
        barangayRepository.searchBarangayByFilter(filter).sort { it.name }
    }

    @GraphQLQuery(name = "barangayByCity")
    List<Barangay> barangayByCity(@GraphQLArgument(name = "id") UUID id) {
        barangayRepository.barangayByCity(id).sort { it.name }
    }

    @GraphQLQuery(name = "barangayByCityProvince")
    List<Barangay> barangayByCityProvince(@GraphQLArgument(name = "id") UUID id, //id = id sa city
                                          @GraphQLArgument(name = "province") UUID province) {

        if (province) {
            if (id) {
                barangayRepository.barangayByCity(id).sort { it.cityName }
            } else {
                barangayRepository.barangayByProvince(province).sort { it.barangayName }
            }
        } else {
            return barangayRepository.findAll()
        }

    }

    @GraphQLQuery(name = "barangayByCityProvinceNoSelectedBarangay")
    List<Barangay> barangayByCityProvinceNoSelectedBarangay(@GraphQLArgument(name = "id") UUID id, //id = id sa city
                                                            @GraphQLArgument(name = "province") UUID province,
                                                            @GraphQLArgument(name = "selectedBarangayIds") List<UUID> selectedBarangayIds) {

        if (province) {
            if (id) {
                if(selectedBarangayIds == [])
                {
                    barangayRepository.barangayByCity(id).sort { it.cityName }

                }
                else {
                    barangayRepository.barangayByCityNoSelectedBarangay(id, selectedBarangayIds).sort { it.cityName }

                }
            } else {

                if(selectedBarangayIds == [])
                {
                    barangayRepository.barangayByProvince(province).sort { it.barangayName }

                }
                else {
                    barangayRepository.barangayByProvinceNoSelectedBarangay(province, selectedBarangayIds).sort { it.barangayName }

                }
            }
        } else {
            return barangayRepository.findAll()
        }

    }

    //============== MIChAEL  QUERIES ====================
    @GraphQLQuery(name = "getProvince")
    List<Province> getProvince() {
        provinceRepository.findAll().sort { it.name }
    }

    @GraphQLQuery(name = "getProvinceByRegion")
    List<Province> getProvinceByRegion(@GraphQLArgument(name = "region") UUID region) {
        if (region) {
            return provinceRepository.provinceByRegions(region).sort { it.name }
        } else {
            return provinceRepository.findAll().sort { it.name }
        }
    }

    @GraphQLQuery(name = "getCityByProvince")
    List<City> getCityByProvince(@GraphQLArgument(name = "province") UUID province) {
        if (province) {
            return cityRepository.cityByProvince(province).sort { it.name }
        } else {
            return cityRepository.findAll().sort { it.name }
        }
    }

    @GraphQLQuery(name = "getBarangayByCity")
    List<Barangay> getBarangayByCity(@GraphQLArgument(name = "city") UUID city) {
        if (city) {
            return barangayRepository.barangayByCity(city).sort { it.name }
        } else {
            return barangayRepository.findAll().sort { it.name }
        }
    }


    @GraphQLQuery(name = "getBarangayByIds")
    List<Barangay> getBarangayByIds(@GraphQLArgument(name = "ids") List<UUID> ids) {
        if(ids) return barangayRepository.findBarangayByIds(ids)
        return null

    }


    //============== All Mutations ====================

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "upsertAddress")
    GraphQLRetVal<Boolean> upsertAddress(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "type") String type
    ) {
        def result = new GraphQLRetVal<Boolean>(true, true, "Address Added")
        if (type.equalsIgnoreCase("country")) {
            def obj = objectMapper.convertValue(fields, Country.class)
            Country upsert = new Country()
            if (id) {
                upsert = countryRepository.findById(id).get()
                upsert.country = obj.country
                result = new GraphQLRetVal<Boolean>(true, true, "Address Updated")
            } else {
                upsert.country = obj.country
            }
            countryRepository.save(upsert)
        }
        if (type.equalsIgnoreCase("region")) {
            def obj = objectMapper.convertValue(fields, Region.class)
            Region upsert = new Region()
            if (id) {
                upsert = regionRepository.findById(id).get()
                upsert.name = obj.name
                result = new GraphQLRetVal<Boolean>(true, true, "Address Updated")
            } else {
                upsert.name = obj.name
            }
            regionRepository.save(upsert)
        }
        if (type.equalsIgnoreCase("province")) {
            def obj = objectMapper.convertValue(fields, Province.class)
            Province upsert = new Province()
            if (id) {
                upsert = provinceRepository.findById(id).get()
                upsert.region = obj.region
                upsert.name = obj.name
                result = new GraphQLRetVal<Boolean>(true, true, "Address Updated")
            } else {
                upsert.region = obj.region
                upsert.name = obj.name
            }
            provinceRepository.save(upsert)
        }
        if (type.equalsIgnoreCase("city")) {
            def obj = objectMapper.convertValue(fields, City.class)
            def prov = provinceRepository.findById(obj.province.id).get()
            City upsert = new City()
            if (id) {
                upsert = cityRepository.findById(id).get()
                upsert.province = obj.province
                upsert.region = prov.region
                upsert.name = obj.name
                result = new GraphQLRetVal<Boolean>(true, true, "Address Updated")
            } else {
                upsert.region = prov.region
                upsert.province = obj.province
                upsert.name = obj.name
            }
            cityRepository.save(upsert)
        }
        if (type.equalsIgnoreCase("barangay")) {
            def obj = objectMapper.convertValue(fields, Barangay.class)
            def provReg = cityRepository.findById(obj.city.id).get()
            Barangay upsert = new Barangay()
            if (id) {
                upsert = barangayRepository.findById(id).get()
                upsert.province = provReg.province
                upsert.region = provReg.region
                upsert.city = obj.city
                upsert.name = obj.name
                result = new GraphQLRetVal<Boolean>(true, true, "Address Updated")
            } else {
                upsert.province = provReg.province
                upsert.region = provReg.region
                upsert.city = obj.city
                upsert.name = obj.name
            }
            barangayRepository.save(upsert)
        }

        return result;
    }


}
