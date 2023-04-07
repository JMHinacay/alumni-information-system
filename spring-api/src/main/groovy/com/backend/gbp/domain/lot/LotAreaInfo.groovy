package com.backend.gbp.domain.lot

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.address.Barangay
import com.backend.gbp.domain.address.City
import com.backend.gbp.domain.address.Province
import com.backend.gbp.domain.hrm.Employee
import com.fasterxml.jackson.annotation.JsonIgnore
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

//import org.joda.time.LocalDateTime

@javax.persistence.Entity
@javax.persistence.Table(name = "lot_area_info", schema = "lot")
class LotAreaInfo extends AbstractAuditingEntity {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_info", referencedColumnName = "id")
    LotInfo lotInfo

    @GraphQLQuery
    @Column(name = "survey_no", columnDefinition = "varchar")
    String surveyNo

    @GraphQLQuery
    @Column(name = "lot_no", columnDefinition = "varchar")
    String lotNo

    @GraphQLQuery
    @Column(name = "deleted", columnDefinition = "bool")
    Boolean deleted

    @GraphQLQuery
    @Column(name = "lot_area_size", columnDefinition = "numeric")
    BigDecimal lotAreaSize

    @OneToOne(mappedBy = "lotAreaInfo")
    Map map


}
