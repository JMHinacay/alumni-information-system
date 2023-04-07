package com.backend.gbp.domain

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.lot.LotTransaction
import com.fasterxml.jackson.annotation.JsonIgnore
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import javax.validation.constraints.Email
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size
import java.time.Instant
import java.time.LocalDateTime

@TypeChecked
@Entity
@Table(schema = "public", name = "denr_updates")
class DenrUpdates extends AbstractAuditingEntity{

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id


	@GraphQLQuery
	@Column(name = "update_type", columnDefinition = "varchar")
	String updateType

	@GraphQLQuery
	@Column(name = "current_unit", columnDefinition = "varchar")
	String currentUnit

	@GraphQLQuery
	@Column(name = "current_name", columnDefinition = "varchar")
	String currentName

	@GraphQLQuery
	@Column(name = "assigned_unit", columnDefinition = "varchar")
	String assignedUnit

	@GraphQLQuery
	@Column(name = "assigned_name", columnDefinition = "varchar")
	String assignedName

	@GraphQLQuery
	@Column(name = "remarks", columnDefinition = "varchar")
	String remarks

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	String status

	@GraphQLQuery
	@Column(name = "currently_handled_by", columnDefinition = "varchar")
	String currentlyHandledBy


	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lot_transaction", referencedColumnName = "id")
	LotTransaction lotTransaction









}
