package com.backend.gbp.repository


import com.backend.gbp.domain.Office
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface OfficeRepository extends JpaRepository<Office, UUID> {

	@Query(
			value = '''Select o from Office o where (lower(o.officeCode) like lower(concat('%',:filter,'%')) or 
						lower(o.officeDescription) like lower(concat('%',:filter,'%')))'''
	)
	List<Office> officeListByFilter(@Param("filter") String filter)

	@Query(
			value = '''Select o from Office o where (lower(o.officeCode) like lower(concat('%',:filter,'%')) or 
						lower(o.officeDescription) like lower(concat('%',:filter,'%'))) and o.status = :status'''
	)
	List<Office> officeListByFilterStatus(@Param("filter") String filter, @Param("status") Boolean status)

	@Query(
			value = '''Select o from Office o where o.status = true'''
	)
	List<Office> activeOffices()
}
