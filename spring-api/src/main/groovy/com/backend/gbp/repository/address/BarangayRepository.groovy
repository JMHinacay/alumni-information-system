package com.backend.gbp.repository.address

import com.backend.gbp.domain.address.Barangay
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface BarangayRepository extends JpaRepository<Barangay, UUID> {

    @Query(value = """Select c from Barangay c where lower(c.name) like lower(concat('%',:filter,'%')) """)
    List<Barangay> searchBarangayByFilter(@Param("filter") String filter)

    @Query(value = """Select c from Barangay c where c.city.id = :id """)
    List<Barangay> barangayByCity(@Param("id") UUID id)

}
