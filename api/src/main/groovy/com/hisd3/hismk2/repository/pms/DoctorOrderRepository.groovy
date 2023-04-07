package com.hisd3.hismk2.repository.pms

import com.hisd3.hismk2.domain.pms.DoctorOrder
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

import java.time.Instant

interface DoctorOrderRepository extends JpaRepository<DoctorOrder, UUID> {
	
	@Query(nativeQuery = true, value = 'Select * from pms.doctor_orders doctorOrder where doctorOrder."case" = :parentCase and doctorOrder.hidden is null order by doctorOrder.entry_datetime desc')
	List<DoctorOrder> getDoctorOrdersByCase(@Param("parentCase") UUID parentCase)
	
	@Query(nativeQuery = true, value = 'Select * from pms.doctor_orders doctorOrder where doctorOrder."case" = :parentCase and doctorOrder.hidden is null order by doctorOrder.entry_datetime asc')
	List<DoctorOrder> getDoctorOrdersByCaseAsc(@Param("parentCase") UUID parentCase)
	
	@Query(nativeQuery = true, value = 'Select * from pms.doctor_orders doctorOrder where doctorOrder."case" = :parentCase and doctorOrder.hidden is null order by doctorOrder.entry_datetime desc')
	List<DoctorOrder> getDoctorOrdersByCaseDesc(@Param("parentCase") UUID parentCase)
	
	@Query(value = "Select doctorOrder from DoctorOrder doctorOrder where doctorOrder.parentCase.id = :parentCase and doctorOrder.entryDateTime between :from and :to and (doctorOrder.hidden is null or doctorOrder.hidden is empty)")
	List<DoctorOrder> getDoctorOrdersByCaseByDateRange(@Param("parentCase") UUID parentCase, @Param('from') Instant from, @Param('to') Instant to)

}
