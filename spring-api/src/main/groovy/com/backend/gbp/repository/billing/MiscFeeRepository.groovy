package com.backend.gbp.repository.billing


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.billing.MiscFee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface MiscFeeRepository extends JpaRepository<MiscFee, UUID> {

    @Query(
            value = '''Select p from MiscFee p where (lower(p.description) like lower(concat('%',:filter,'%')))'''
    )
    List<MiscFee> miscByFeeFilter(@Param("filter") String filter)

    @Query(
            value = '''Select p from MiscFee p where (lower(p.description) like lower(concat('%',:filter,'%')))
                        and p.status = :status'''
    )
    List<MiscFee> miscByFeeFilterStatus(@Param("filter") String filter, @Param("status") Boolean status)

    @Query(
            value = '''Select p from MiscFee p where p.status = :status'''
    )
    List<MiscFee> activeMiscFees(@Param("status") Boolean status)

    @Query(
            value = '''Select p from MiscFee p where p.description = :description'''
    )
    List<MiscFee> findDuplicateDescription(@Param("description") String description)
}
