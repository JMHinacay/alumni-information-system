package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.lot.LotAreaInfo
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
@javax.persistence.Table(name = "billing", schema = "billing")
class Billing extends AbstractAuditingEntity implements Serializable
{

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "billing_no", columnDefinition = "varchar")
    String billingNo

    @GraphQLQuery
    @Column(name = "billing_status", columnDefinition = "varchar")
    String status

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_transaction", referencedColumnName = "id")
    LotTransaction lotTransaction

//	@GraphQLQuery
//	@Column(name = "balance", columnDefinition = "numeric")
//	BigDecimal balance

    @OneToMany(mappedBy = "billing", orphanRemoval = true, cascade = CascadeType.ALL)
    List<BillingItem> billingItems = []

    @GraphQLQuery
    @Column(name = "is_locked", columnDefinition = "bool")
    Boolean isLocked

    @GraphQLQuery
    @Column(name = "locked_by", columnDefinition = "varchar")
    String lockedBy

    @GraphQLQuery
    @Formula("(Select sum((COALESCE(b.debit,0)  -   COALESCE(b.credit,0)) * b.item_qty) from billing.billing_item b where b.billing=id and b.status='ACTIVE')")
    BigDecimal balance

    @GraphQLQuery
    @Formula("(Select sum(b.credit) from   billing.billing_item  b where   b.billing = id and  b.item_type = 'PAYMENT'  and b.status='ACTIVE')")
    BigDecimal payments

    @GraphQLQuery
    @Formula("(Select sum(b.credit) from   billing.billing_item  b where   b.billing = id and  b.item_type = 'DEDUCTION'  and b.status='ACTIVE')")
    BigDecimal deductions

    @GraphQLQuery
    @Formula("(Select sum(COALESCE(b.debit,0) * b.item_qty) from billing.billing_item b where b.billing=id and b.status='ACTIVE')")
    BigDecimal total


}