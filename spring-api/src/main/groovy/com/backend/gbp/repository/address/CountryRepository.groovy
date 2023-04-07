package com.backend.gbp.repository.address

import com.backend.gbp.domain.address.Country
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface CountryRepository extends JpaRepository<Country, UUID>{

    @Query(value = """Select c from Country c where lower(c.country) like lower(concat('%',:filter,'%')) """)
    List<Country> searchCountryByFilter(@Param("filter") String filter)
}
