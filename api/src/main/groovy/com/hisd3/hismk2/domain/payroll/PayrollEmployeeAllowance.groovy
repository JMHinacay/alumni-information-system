package com.hisd3.hismk2.domain.payroll

import com.fasterxml.jackson.annotation.JsonIgnore
import com.hisd3.hismk2.domain.common.AbstractPayrollApprovalStatusAuditingEntity
import com.hisd3.hismk2.domain.hrm.Employee
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "payroll_employee_allowances")
//@SQLDelete(sql = "UPDATE payroll.timekeepings SET deleted = true WHERE id = ?")
//@Where(clause = "deleted <> true or deleted is  null ")
class PayrollEmployeeAllowance{


    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee", referencedColumnName = "id")
    Employee employee

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payrollAllowance", referencedColumnName = "id")
    PayrollAllowance payrollAllowance
}
