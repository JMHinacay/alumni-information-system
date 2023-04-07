package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

//import org.joda.time.LocalDateTime

@javax.persistence.Entity
@javax.persistence.Table(name = "deduction", schema = "billing")
class Deduction extends AbstractAuditingEntity
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
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "billing_item", referencedColumnName = "id")
	BillingItem billingItem

	@GraphQLQuery
	@Column(name = "amount", columnDefinition = "numeric")
	BigDecimal amount

	@GraphQLQuery
	@Column(name = "remarks", columnDefinition = "varchar")
	String remarks

	@GraphQLQuery
	@Column(name = "deleted", columnDefinition = "bool")
	Boolean deleted

	@GraphQLQuery
	@Column(name = "type", columnDefinition = "varchar")
	String type

	@GraphQLQuery
	@Column(name = "discount_rate", columnDefinition = "varchar")
	String discountRate

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	String status


	@Transient
	UUID getBillingItemId() {
		return billingItem.id
	}


}
