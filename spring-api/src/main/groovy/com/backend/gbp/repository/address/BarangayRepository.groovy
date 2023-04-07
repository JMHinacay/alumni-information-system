package com.backend.gbp.repository.address

import com.backend.gbp.domain.address.Barangay
import com.backend.gbp.domain.hrm.Employee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface BarangayRepository extends JpaRepository<Barangay, UUID> {

    @Query(value = """Select c from Barangay c where lower(c.name) like lower(concat('%',:filter,'%')) """)
    List<Barangay> searchBarangayByFilter(@Param("filter") String filter)

    @Query(value = """Select c from Barangay c where c.city.id = :id """)
    List<Barangay> barangayByCity(@Param("id") UUID id)

    @Query(value = """Select c from Barangay c where  c.province.id = :province """)
    List<Barangay> barangayByProvince( @Param("province") UUID province)

    @Query(value = """Select c from Barangay c where c.city.id = :city and c.province.id = :province """)
    List<Barangay> barangayByCityProvince(@Param("city") UUID city, @Param("province") UUID province)

    @Query(value = "Select c from Barangay c where  c.id  in :ids")
    List<Barangay> findBarangayByIds(@Param("ids")List<UUID> ids)

    @Query(value = "Select c from Barangay c where  c.city.id  in :cityIds")
    List<Barangay> findBarangayByCityIds(@Param("cityIds")List<UUID> cityIds)

    @Query(value = """Select c from Barangay c where  c.province.id = :province and c.id not in :selectedBarangayIds""")
    List<Barangay> barangayByProvinceNoSelectedBarangay( @Param("province") UUID province, @Param("selectedBarangayIds") List<UUID> selectedBarangayIds)

    @Query(value = """Select c from Barangay c where c.city.id = :id and c.id not in :selectedBarangayIds""")
    List<Barangay> barangayByCityNoSelectedBarangay(@Param("id") UUID id, @Param("selectedBarangayIds") List<UUID> selectedBarangayIds)

}
