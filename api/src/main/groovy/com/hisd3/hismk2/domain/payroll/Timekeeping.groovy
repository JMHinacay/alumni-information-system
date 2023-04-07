package com.hisd3.hismk2.domain.payroll


import com.hisd3.hismk2.domain.AbstractAuditingEntity
import com.hisd3.hismk2.domain.payroll.enums.TimekeepingStatus
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "payroll", name = "timekeepings")
@SQLDelete(sql = "UPDATE payroll.timekeepings SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Timekeeping extends AbstractAuditingEntity implements Serializable {


    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @OneToMany(mappedBy = "timekeeping", orphanRemoval = true, cascade = CascadeType.ALL)
    List<TimekeepingEmployee> timekeepingEmployees = []


    @GraphQLQuery
    @Column(name = "deleted", columnDefinition = "bool")
    Boolean deleted

    @GraphQLQuery
    @Column(name = "deleted_date", columnDefinition = "timestamp")
    Instant deletedEnd

    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "varchar")
    TimekeepingStatus status
//
//    @JsonIgnore
//    @NotFound(action = NotFoundAction.IGNORE)
//    @OneToOne(fetch = FetchType.LAZY, optional = false)
//    @JoinColumn(name = "employee", referencedColumnName = "id")
//    Employee employee
//
//    @NotFound(action = NotFoundAction.IGNORE)
//    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payroll", referencedColumnName = "id")
    Payroll payroll

}
