package com.backend.gbp.domain.lot

import com.fasterxml.jackson.annotation.JsonIgnore
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type

import javax.persistence.*

//import org.joda.time.LocalDateTime

@javax.persistence.Entity
@javax.persistence.Table(name = "claimant", schema = "lot")
class Claimant
{
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id


	@GraphQLQuery
	@Column(name = "claimant_fullname", columnDefinition = "varchar")
	String claimantFullName

	@GraphQLQuery
	@Column(name = "claimant_address", columnDefinition = "varchar")
	String claimantAddress

	@GraphQLQuery
	@Column(name = "claimant_contact_no", columnDefinition = "varchar")
	String claimantContactNo

	@NotFound(action = NotFoundAction.IGNORE)
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lot_transaction", referencedColumnName = "id")
	LotTransaction lotTransaction

}
