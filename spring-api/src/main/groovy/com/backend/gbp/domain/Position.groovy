package com.backend.gbp.domain


import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*


@TypeChecked
@Entity
@Table(schema = "public", name = "position")
class Position extends AbstractAuditingEntity { //domain is connected ni sa table

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "pos_code", columnDefinition = "varchar")
	String code

	@GraphQLQuery
	@Column(name = "pos_description", columnDefinition = "varchar")
	String description

	@GraphQLQuery
	@Column(name = "pos_flag_value", columnDefinition = "varchar")
	String flagValue

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "bool")
	Boolean status

}
