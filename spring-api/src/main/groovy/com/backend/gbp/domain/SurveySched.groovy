package com.backend.gbp.domain

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
@Table(schema = "public", name = "survey_sched")
class SurveySched extends AbstractAuditingEntity  implements Serializable{

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lot_transaction", referencedColumnName = "id")
	LotTransaction lotTransaction

	@GraphQLQuery
	@Column(name = "survey_date_start", columnDefinition = "date")
	Instant surveyDateStart

	@GraphQLQuery
	@Column(name = "survey_date_end", columnDefinition = "date")
	Instant surveyDateEnd

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	String status

	@GraphQLQuery
	@Column(name = "survey_remarks", columnDefinition = "varchar")
	String surveyRemarks

	@OneToMany(mappedBy = "surveySched", orphanRemoval = true, cascade = CascadeType.ALL)
	List<SurveyTeam> surveyTeams = []

	@Transient
	String getProvinceName() {
		return lotTransaction.lotInfo.province.provinceName
	}

	@Transient
	String getCityName() {
		return lotTransaction.lotInfo.city.cityName
	}

	@Transient
	String getBarangayName() {
		return lotTransaction.lotInfo.barangay.barangayName
	}

	@Transient
	String getLotType() {
		return lotTransaction.lotInfo.lotType
	}

	@Transient
	String getServiceName() {
		return lotTransaction.serviceName
	}


}
