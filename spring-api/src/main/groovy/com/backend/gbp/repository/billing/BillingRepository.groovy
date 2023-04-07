package com.backend.gbp.repository.billing

import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.billing.MiscFee
import com.backend.gbp.graphqlservices.billing.BillingService
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface BillingRepository extends JpaRepository<Billing, UUID> {

		@Query(
			value = '''Select p from Billing p where p.lotTransaction.id = :lotTransactionId'''
	)
	Billing findByLotTransactionId(@Param("lotTransactionId") UUID lotTransactionId)

//	@Query(
//			value = '''Select p from MiscFee p where (lower(p.description) like lower(concat('%',:filter,'%')))
//                        and p.status = :status'''
//	)
//	List<MiscFee> miscByFeeFilterStatus(@Param("filter") String filter, @Param("status") String status)
}
