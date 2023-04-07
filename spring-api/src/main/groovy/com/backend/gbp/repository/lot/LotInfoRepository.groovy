package com.backend.gbp.repository.lot


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.lot.LotInfo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface LotInfoRepository extends JpaRepository<LotInfo, UUID> {

//	@Query(
//			value = '''Select la.id from LotInfo li where (lower(li.) like lower(concat('%',:filter,'%')))'''
//	)
//	List<Service> serviceFilter(@Param("filter") String filter)
//	//ReturnType <ReturnValue> functionName(parameters)


}
