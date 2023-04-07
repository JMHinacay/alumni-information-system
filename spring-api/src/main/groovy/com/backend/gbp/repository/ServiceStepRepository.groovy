package com.backend.gbp.repository


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.ServiceStep
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ServiceStepRepository extends JpaRepository<ServiceStep, UUID> {

	@Query(
			value = '''Select s from ServiceStep s where s.service.id = :serviceId'''
	)
	List<ServiceStep> findByServiceId(@Param("serviceId") UUID serviceId)
	//ReturnType <ReturnValue> functionName(parameters)
//
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
