package com.backend.gbp.repository

import com.backend.gbp.domain.Jurisdiction
import com.backend.gbp.domain.Service
import com.backend.gbp.domain.address.Barangay
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface JurisdictionRepository extends JpaRepository<Jurisdiction, UUID> {

//	@Query(
//			value = '''Select s from Service s where (lower(s.serviceName) like lower(concat('%',:filter,'%')))'''
//	)
//	List<Service> serviceFilter(@Param("filter") String filter)

    @Query(value = """Select j from Jurisdiction j where j.office.id = :office and j.province.id = :province """)
    List<Jurisdiction> jurisdByOfficeProvince( @Param("province") UUID province,@Param("office") UUID office)

    @Query(value = """Select j from Jurisdiction j where j.office.id = :office and j.city.id = :city """)
    List<Jurisdiction> jurisdByOfficeCity(@Param("city") UUID city,@Param("office") UUID office)

    @Query(value = """Select j from Jurisdiction j where j.office.id = :office""")
    List<Jurisdiction> jurisdByOffice( @Param("office") UUID office)

    @Query(value = """Select j from Jurisdiction j where j.office.id = :office""")
    List<Jurisdiction> getProvinceByOffice( @Param("office") UUID office)

    @Query(value = """Select j from Jurisdiction j where j.province.id = :provinceId""")
    List<Jurisdiction> jurisdByProvinceId( @Param("provinceId") UUID provinceId)

    @Query(value = """Select j.barangay.id from Jurisdiction j where j.office.id = :officeId""")
    List<UUID> getBarangayIdsByOfficeId( @Param("officeId") UUID officeId)


}
