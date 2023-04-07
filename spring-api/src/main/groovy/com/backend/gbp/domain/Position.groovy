package com.backend.gbp.domain

import com.backend.gbp.rest.dto.DefaultRolesDto
import com.backend.gbp.rest.dto.UploadFilesDto
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type
import org.json.JSONArray

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

//	@GraphQLQuery
//	@Column(name = "default_roles", columnDefinition = "jsonb")
//	DefaultRolesDto defaultRoles

	@GraphQLQuery
	@Type(type = "jsonb")
	@Column(name="default_roles",columnDefinition = "jsonb")
	List<String >defaultRoles

	@GraphQLQuery
	@Type(type = "jsonb")
	@Column(name="default_permissions",columnDefinition = "jsonb")
	List<String >defaultPermissions

}
