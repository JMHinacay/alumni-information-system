package com.backend.gbp.repository.address

import com.backend.gbp.domain.address.City
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface CityRepository extends JpaRepository<City, UUID> {

    @Query(value = """Select c from City c where lower(c.province.name) like lower(concat('%',:province,'%'))""")
    List<City> searchCities(@Param("province") String province)

    @Query(value = """Select c from City c where lower(c.name) like lower(concat('%',:filter,'%'))""")
    List<City> searchCitiesName(@Param("filter") String filter)

    @Query(value = """Select c from City c where c.province.id = :id""")
    List<City> cityByProvince(@Param("id") UUID id)
}
