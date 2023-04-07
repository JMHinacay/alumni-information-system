package com.hisd3.hismk2.domain.payroll

import com.fasterxml.jackson.annotation.JsonIgnore
import com.hisd3.hismk2.domain.AbstractAuditingEntity
import com.hisd3.hismk2.domain.common.AbstractPayrollApprovalStatusAuditingEntity
import com.hisd3.hismk2.domain.payroll.enums.TimekeepingStatus
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type
import org.javers.core.metamodel.annotation.DiffIgnore
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "payroll", name = "payroll_allowances")
//@SQLDelete(sql = "UPDATE payroll.timekeepings SET deleted = true WHERE id = ?")
//@Where(clause = "deleted <> true or deleted is  null ")
class PayrollAllowance  {


    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payroll", referencedColumnName = "id")
    Payroll payroll





}
