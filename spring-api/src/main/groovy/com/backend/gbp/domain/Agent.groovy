package com.backend.gbp.domain


import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*


@TypeChecked
@Entity
@Table(schema = "public", name = "agent")
class Agent { //domain is connected ni sa table

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "agent_name", columnDefinition = "varchar")
	String agentName

	@GraphQLQuery
	@Column(name = "agent_organization", columnDefinition = "numeric")
	String  agentOrganization

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "numeric")
	Boolean  status

}
