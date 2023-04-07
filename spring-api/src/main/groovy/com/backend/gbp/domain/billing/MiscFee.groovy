package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.lot.LotTransaction
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

//import org.joda.time.LocalDateTime

@javax.persistence.Entity
@javax.persistence.Table(name = "misc_fee", schema = "billing")
class MiscFee extends AbstractAuditingEntity
{
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "misc_fee_cost", columnDefinition = "numeric")
	BigDecimal cost

	@GraphQLQuery
	@Column(name = "misc_fee_desc", columnDefinition = "varchar")
	String description


	@GraphQLQuery
	@Column(name = "status", columnDefinition = "bool")
	Boolean status


	@GraphQLQuery
	@Column(name = "deleted", columnDefinition = "bool")
	Boolean deleted




}
