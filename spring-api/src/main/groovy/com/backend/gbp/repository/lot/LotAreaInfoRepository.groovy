package com.backend.gbp.repository.lot


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.lot.LotAreaInfo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

import java.time.Instant

interface LotAreaInfoRepository extends JpaRepository<LotAreaInfo, UUID> {

//	@Query(
//			value = '''Select s from Service s where (lower(s.service_name) like lower(concat('%',:filter,'%')))'''
//	)
//	List<Service> serviceFilter(@Param("filter") String filter)
//	//ReturnType <ReturnValue> functionName(parameters)
//
 	@Query(
			value = '''Select a.lotInfo.id from LotAreaInfo a where (lower(a.lotNo) like lower(concat('%',:filter,'%')))'''
	)
	List<UUID> getLotInfoIdsByFilter(@Param("filter") String filter)

	@Query(
			value = '''Select a from LotAreaInfo a where (lower(a.lotNo) like lower(concat('%',:filter,'%')))'''
	)
	List<LotAreaInfo> getByLotNoFilter(@Param("filter") String filter)
	//ReturnType <ReturnValue> functionName(parameters)



}
