package com.backend.gbp.domain.lot

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

//import org.joda.time.LocalDateTime

@javax.persistence.Entity
@javax.persistence.Table(name = "map_coordinates", schema = "lot")
class MapCoordinates
{
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "lat", columnDefinition = "varchar")
	String lat

	@GraphQLQuery
	@Column(name = "lng", columnDefinition = "varchar")
	String lng

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "map", referencedColumnName = "id")
	Map map



}
