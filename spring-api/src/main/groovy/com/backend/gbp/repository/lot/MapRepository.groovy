package com.backend.gbp.repository.lot


import com.backend.gbp.domain.lot.Claimant
import com.backend.gbp.domain.lot.Map
import org.springframework.data.jpa.repository.JpaRepository

interface MapRepository extends JpaRepository<Map, UUID> {

//	@Query(
//			value = '''Select s from Service s where (lower(s.service_name) like lower(concat('%',:filter,'%')))'''
//	)
//	List<Service> serviceFilter(@Param("filter") String filter)
//	//ReturnType <ReturnValue> functionName(parameters)
//

}
