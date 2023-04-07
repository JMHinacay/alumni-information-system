package com.backend.gbp.domain

import com.backend.gbp.domain.lot.LotAreaInfo
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Formula
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*


@TypeChecked
@Entity
@Table(schema = "public", name = "service")
class Service extends AbstractAuditingEntity { //domain is connected ni sa table

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "service_name", columnDefinition = "varchar")
	String serviceName

	@GraphQLQuery
	@Column(name = "service_cost", columnDefinition = "numeric")
	BigDecimal  serviceCost

	@GraphQLQuery
	@Column(name = "excess_hectare_cost", columnDefinition = "numeric")
	BigDecimal  excessHectareCost

	@GraphQLQuery
	@Column(name = "excess_corner_cost", columnDefinition = "numeric")
	BigDecimal  excessCornerCost


	@GraphQLQuery
	@Column(name = "status", columnDefinition = "bool")
	Boolean status

	@GraphQLQuery
	@Column(name = "allow_multiple_lot", columnDefinition = "bool")
	Boolean allowMultipleLot

	@GraphQLQuery
	@Column(name = "service_type", columnDefinition = "varchar")
	String serviceType

	@OneToMany(mappedBy = "service", orphanRemoval = true, cascade = CascadeType.ALL)
	List<ServiceStep> serviceSteps = []

	@GraphQLQuery
	@Column(name = "last_step", columnDefinition = "varchar")
	String lastStep


}
