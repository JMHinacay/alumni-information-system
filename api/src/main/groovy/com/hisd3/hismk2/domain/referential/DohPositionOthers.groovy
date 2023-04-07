package com.hisd3.hismk2.domain.referential

import com.hisd3.hismk2.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "referential", name = "doh_position_others")
class DohPositionOthers extends AbstractAuditingEntity{
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "poscode", columnDefinition = "numeric")
	Integer poscode
	
	@GraphQLQuery
	@Column(name = "postdesc", columnDefinition = "varchar")
	String postdesc
	

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "bool")
	Boolean status
	
}
