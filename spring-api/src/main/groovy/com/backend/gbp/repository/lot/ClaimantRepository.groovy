package com.backend.gbp.repository.lot


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.lot.Claimant
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ClaimantRepository extends JpaRepository<Claimant, UUID> {

//	@Query(
//			value = '''Select s from Service s where (lower(s.service_name) like lower(concat('%',:filter,'%')))'''
//	)
//	List<Service> serviceFilter(@Param("filter") String filter)
//	//ReturnType <ReturnValue> functionName(parameters)
//

}
