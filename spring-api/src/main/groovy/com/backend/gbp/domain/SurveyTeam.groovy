package com.backend.gbp.domain

import com.backend.gbp.domain.hrm.Employee
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@TypeChecked
@Entity
@Table(schema = "public", name = "survey_team")
class SurveyTeam extends AbstractAuditingEntity { //domain is connected ni sa table

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id


	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "survey_team_member", referencedColumnName = "id")
	SurveyTeamMember surveyTeamMember

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "survey_sched", referencedColumnName = "id")
	SurveySched surveySched

	@Transient
	String getFullName() {
		return surveyTeamMember.employee.fullName
	}

	@Transient
	String getFullAddress() {
		return surveyTeamMember.employee.fullAddress
	}

	@Transient
	String getEmployeeCelNo() {
		return surveyTeamMember.employee.employeeCelNo
	}

	@Transient
	String getGender() {
		return surveyTeamMember.employee.gender
	}
}
