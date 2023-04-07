package com.backend.gbp.domain

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.lot.LotTransaction
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant


@TypeChecked
@Entity
@Table(schema = "public", name = "survey_team_member")
class SurveyTeamMember extends AbstractAuditingEntity { //domain is connected ni sa table

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id


	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employees", referencedColumnName = "id")
	Employee employee

	@GraphQLQuery
	@Column(name = "isactive", columnDefinition = "bool")
	Boolean isActive

	@Transient
	String getFullName() { //serviceName
		return employee.fullName
	}
}
