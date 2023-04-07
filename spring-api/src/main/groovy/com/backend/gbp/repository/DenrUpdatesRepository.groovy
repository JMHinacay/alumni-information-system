package com.backend.gbp.repository

import com.backend.gbp.domain.DenrUpdates
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface DenrUpdatesRepository extends JpaRepository<DenrUpdates, UUID> {

    @Query(
            value = '''Select a from DenrUpdates a where a.lotTransaction.id = :lotTransactionId and a.updateType = :updateType'''
    )
    List<DenrUpdates> findByLotTransactionIdUpdateType(@Param("lotTransactionId") UUID lotTransactionId, @Param("updateType") String updateType)
    //ReturnType <ReturnValue> functionName(parameters)

//	@Query(
//			value = '''Select s from Service s where (lower(s.serviceName) like lower(concat('%',:filter,'%')))
//						and s.status = :status'''
//	)
//	List<Service> serviceFilterStatus(@Param("filter") String filter,
//									  @Param("status") Boolean status)
//
//	@Query(
//			value = '''Select s from Service s where (lower(s.serviceName) like lower(concat('%',:filter,'%')))
//						and s.serviceType = :type'''
//	)
//	List<Service> serviceFilterType(@Param("filter") String filter,
//									  @Param("type") String type)
//
//	@Query(
//			value = '''Select s from Service s where (lower(s.serviceName) like lower(concat('%',:filter,'%')))
//			and s.status = :status and s.serviceType = :type'''
//	)
//	List<Service> serviceFilterStatusType(@Param("filter") String filter,
//										  @Param("status") Boolean status,
//										  @Param("type") String type)
//
//	@Query(
//			value = '''Select s from Service s where s.status = true'''
//	)
//	List<Service> activeService()
//
//	@Query(
//			value = '''Select s from Service s where s.serviceType = :filter'''
//	)
//	List<Service> serviceFilterType(@Param("filter") String filter)
}
