package com.hisd3.hismk2.domain.hrm

import com.fasterxml.jackson.annotation.JsonIgnore
import com.hisd3.hismk2.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne

@Entity
@javax.persistence.Table(schema = "hrm", name ="employee_biometric_config")
class EmployeeBiometricConfig extends AbstractAuditingEntity {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "biometric_no", columnDefinition = "numeric")
    Integer biometricNo

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    Employee employee

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
//    @Column(nullable = false)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "biometric_id", referencedColumnName = "id")
    BiometricDevice biometricDevice
}
