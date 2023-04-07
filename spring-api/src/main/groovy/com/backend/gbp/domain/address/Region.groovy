package com.backend.gbp.domain.address


import io.leangen.graphql.annotations.GraphQLQuery
import org.apache.commons.lang3.StringUtils
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "public", name = "region")
class Region {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "name", columnDefinition = "varchar")
    String name

    @Transient
    String getRegionName() {
        return StringUtils.defaultString(name.toUpperCase())
    }

}
