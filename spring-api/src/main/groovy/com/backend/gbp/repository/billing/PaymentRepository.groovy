package com.backend.gbp.repository.billing


import com.backend.gbp.domain.billing.Payment
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PaymentRepository extends JpaRepository<Payment, UUID> {

    @Query(
            value = '''Select p from Payment p where p.billing.id = :billingId'''
    )
    List<Payment> getByBillingId(@Param("billingId") UUID billingId)

//	@Query(
//			value = '''Select p from MiscFee p where (lower(p.description) like lower(concat('%',:filter,'%')))
//                        and p.status = :status'''
//	)
//	List<MiscFee> miscByFeeFilterStatus(@Param("filter") String filter, @Param("status") String status)


}