package com.hisd3.hismk2.domain.payroll

import com.fasterxml.jackson.annotation.JsonIgnore
import com.hisd3.hismk2.domain.AbstractAuditingEntity
import com.hisd3.hismk2.domain.hrm.Employee
import com.hisd3.hismk2.domain.payroll.enums.PayrollEmployeeStatus
import com.hisd3.hismk2.domain.payroll.enums.TimekeepingEmployeeStatus
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.CascadeType
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.Table

@Entity
@Table(schema = "payroll", name = "payroll_employees")
//@SQLDelete(sql = "UPDATE payroll.payroll_employees SET deleted = true WHERE id = ?")
//@Where(clause = "deleted <> true or deleted is  null ")
class PayrollEmployee extends AbstractAuditingEntity implements Serializable {


    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "varchar")
    PayrollEmployeeStatus status

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payroll", referencedColumnName = "id")
    Payroll payroll

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee", referencedColumnName = "id")
    Employee employee

}
