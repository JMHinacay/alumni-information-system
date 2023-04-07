package com.hisd3.hismk2.domain.payroll

import com.fasterxml.jackson.annotation.JsonIgnore
import com.hisd3.hismk2.domain.AbstractAuditingEntity
import com.hisd3.hismk2.domain.common.AbstractPayrollApprovalStatusAuditingEntity
import com.hisd3.hismk2.domain.hrm.enums.PayrollStatus
import com.hisd3.hismk2.domain.payroll.enums.TimekeepingStatus
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where
import org.javers.core.metamodel.annotation.DiffIgnore
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedBy
import org.springframework.data.annotation.LastModifiedDate

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "payroll", name = "payrolls")
//@SQLDelete(sql = "UPDATE payroll.timekeepings SET deleted = true WHERE id = ?")
//@Where(clause = "deleted <> true or deleted is  null ")
class Payroll extends  AbstractPayrollApprovalStatusAuditingEntity implements Serializable {


    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "title", columnDefinition = "varchar")
    String title

    @GraphQLQuery
    @Column(name = "description", columnDefinition = "varchar")
    String description



    @GraphQLQuery
    @Column(name = "start_date", columnDefinition = "timestamp")
    Instant dateStart

    @GraphQLQuery
    @Column(name = "end_date", columnDefinition = "timestamp")
    Instant dateEnd

//    @GraphQLQuery
//    @Column(name = "deleted", columnDefinition = "bool")
//    Boolean deleted



    @OneToMany(mappedBy = "payroll", orphanRemoval = true, cascade = CascadeType.ALL)
    List<PayrollEmployee> payrollEmployees = []
//
//    @OneToOne(mappedBy = "payroll")
//    Timekeeping timekeeping



}
