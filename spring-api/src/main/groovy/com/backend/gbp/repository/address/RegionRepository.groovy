package com.backend.gbp.repository.address

import com.backend.gbp.domain.address.Region
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param


interface RegionRepository extends JpaRepository<Region, UUID> {

    @Query(value = """Select c from Region c where lower(c.name) like lower(concat('%',:filter,'%')) """)
    List<Region> searchRegionByFilter(@Param("filter") String filter)

}
