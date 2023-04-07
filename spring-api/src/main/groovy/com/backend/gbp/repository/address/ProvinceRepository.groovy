package com.backend.gbp.repository.address

import com.backend.gbp.domain.address.Province
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ProvinceRepository extends JpaRepository<Province, UUID> {

    @Query(value = """Select c from Province c where lower(c.name) like lower(concat('%',:filter,'%')) """)
    List<Province> searchProvinceByFilter(@Param("filter") String filter)\

    @Query(value = """Select c from Province c where c.region.id = :id""")
    List<Province> provinceByRegions(@Param("id") UUID id)
}
