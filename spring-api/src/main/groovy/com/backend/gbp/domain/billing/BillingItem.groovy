package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Service
import com.backend.gbp.domain.lot.LotTransaction
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Formula
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

//import org.joda.time.LocalDateTime

@javax.persistence.Entity
@javax.persistence.Table(name = "billing_item", schema = "billing")
class BillingItem
{
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "billing", referencedColumnName = "id")
	Billing billing

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "service", referencedColumnName = "id")
	Service service

	@GraphQLQuery
	@Column(name = "item_cost", columnDefinition = "numeric")
	BigDecimal cost

//	@GraphQLQuery
//	@Column(name = "total_cost", columnDefinition = "numeric")
//	BigDecimal totalCost

//	@GraphQLQuery
//	@Formula("Select ((coalesce(bi.debit, 0) - coalesce(bi.credit, 0) ) * bi.item_qty) from billing.billing_item bi ")
//	BigDecimal totalCost

//	@GraphQLQuery
//	@Formula("((coalesce(bi.debit, 0) - coalesce(bi.credit, 0) ) * bi.item_qty) from billing.billing_item bi")
//	BigDecimal totalCost

	@GraphQLQuery(name = "totalCost")
	@Transient
	BigDecimal totalCost
	BigDecimal getTotalCost() {
		def b = (debit ?: BigDecimal.ZERO) - (credit ?: BigDecimal.ZERO)
		b * quantity
	}

	@GraphQLQuery
	@Column(name = "item_no", columnDefinition = "varchar")
	String itemNo

	@GraphQLQuery
	@Column(name = "item_desc", columnDefinition = "varchar")
	String description

	@GraphQLQuery
	@Column(name = "item_type", columnDefinition = "varchar")
	String type

	@GraphQLQuery
	@Column(name = "item_qty", columnDefinition = "int")
	Integer quantity

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "misc_fee", referencedColumnName = "id")
	MiscFee miscFee


	@GraphQLQuery
	@Column(name = "deleted", columnDefinition = "bool")
	Boolean deleted

	@GraphQLQuery
	@Column(name = "debit", columnDefinition = "numeric")
	BigDecimal debit

	@GraphQLQuery
	@Column(name = "credit", columnDefinition = "numeric")
	BigDecimal credit

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	String status


}
