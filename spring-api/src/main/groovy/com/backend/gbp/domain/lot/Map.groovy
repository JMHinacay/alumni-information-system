package com.backend.gbp.domain.lot

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.address.Barangay
import com.backend.gbp.domain.address.City
import com.backend.gbp.domain.address.Province
import com.backend.gbp.rest.dto.LatLngDto
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

//import org.joda.time.LocalDateTime

@javax.persistence.Entity
@javax.persistence.Table(name = "map", schema = "lot")
class Map
{
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "map_desc", columnDefinition = "varchar")
	String mapDesc
//
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lot_info", referencedColumnName = "id")
	LotInfo lotInfo


//	@NotFound(action = NotFoundAction.IGNORE)
//	@OneToOne(fetch = FetchType.LAZY)
//	@JoinColumn(name = "lot_info", referencedColumnName = "id")
//	LotInfo lotInfo

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lot_area_info", referencedColumnName = "id")
	LotAreaInfo lotAreaInfo

	@GraphQLQuery
	@Column(name = "is_consolidated", columnDefinition = "bool")
	Boolean isConsolidated

	@GraphQLQuery
	@Type(type = "jsonb")
	@Column(name="path",columnDefinition = "jsonb")
	List<LatLngDto > path

}
