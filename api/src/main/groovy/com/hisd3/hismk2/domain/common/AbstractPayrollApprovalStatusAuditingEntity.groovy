package com.hisd3.hismk2.domain.common

import com.hisd3.hismk2.domain.AbstractAuditingEntity
import com.hisd3.hismk2.domain.hrm.Employee
import com.hisd3.hismk2.domain.payroll.enums.PayrollApprovalStatus
import io.leangen.graphql.annotations.GraphQLQuery

import javax.persistence.*
import java.time.Instant

@MappedSuperclass
class AbstractPayrollApprovalStatusAuditingEntity extends AbstractAuditingEntity implements Serializable {
    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "varchar")
    PayrollApprovalStatus status

    @GraphQLQuery
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "finalized_by", referencedColumnName = "id")
    Employee finalizedBy

    @GraphQLQuery
    @Column(name = "finalized_date", columnDefinition = "timestamp")
    Instant finalizedDate

}