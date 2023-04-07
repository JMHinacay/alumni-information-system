package com.hisd3.hismk2.domain.payroll


import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "payroll_contributions")
//@SQLDelete(sql = "UPDATE payroll.timekeepings SET deleted = true WHERE id = ?")
//@Where(clause = "deleted <> true or deleted is  null ")
class PayrollContribution extends AbstractFinalizeEntity implements Serializable {


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

    @GraphQLQuery
    @Column(name = "status", columnDefinition = "varchar")
    String status




}
