package com.backend.gbp.repository.billing

import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.billing.BillingItem
import com.backend.gbp.domain.billing.MiscFee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface BillingItemRepository extends JpaRepository<BillingItem, UUID> {

		@Query(
			value = '''Select p from BillingItem p where p.type = 'DEDUCTION' and p.billing.id = :billingId'''
	)
	List<BillingItem> getDeductionsByBillingId(@Param("billingId") UUID billingId)

//	@Query(
//			value = '''Select p from MiscFee p where (lower(p.description) like lower(concat('%',:filter,'%')))
//                        and p.status = :status'''
//	)
//	List<MiscFee> miscByFeeFilterStatus(@Param("filter") String filter, @Param("status") String status)


}
