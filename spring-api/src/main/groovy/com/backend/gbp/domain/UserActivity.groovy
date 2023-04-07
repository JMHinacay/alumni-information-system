package com.backend.gbp.domain

import com.backend.gbp.domain.enums.UserActivityType
import com.backend.gbp.domain.lot.LotAreaInfo
import com.backend.gbp.domain.lot.LotTransaction
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type
import org.javers.core.metamodel.annotation.DiffIgnore
import org.springframework.data.annotation.CreatedDate

import javax.persistence.*
import java.time.Instant


@TypeChecked
@Entity
@Table(schema = "public", name = "user_activity")
class UserActivity extends AbstractAuditingEntity implements  Serializable{

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

//	@NotFound(action = NotFoundAction.IGNORE)
//	@ManyToOne(fetch = FetchType.LAZY)
//	@JoinColumn(name = "position", referencedColumnName = "id")
//	Position position

//	@GraphQLQuery
//	@Column(name = "date_assigned", columnDefinition = "timestamp")
//	Instant dateAssigned

//
//	@DiffIgnore
//	@GraphQLQuery
//	@CreatedDate
//	@Column(name = "date_assigned", nullable = false)
//	Instant dateAssigned


	@GraphQLQuery
	@Column(name = "activity_type", columnDefinition = "varchar")
	String activityType



	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	String status

	@GraphQLQuery
	@Column(name = "forwarded_by", columnDefinition = "varchar")
	String forwardedBy

	@GraphQLQuery
	@Column(name = "land_status", columnDefinition = "varchar")
	String landStatus

	@GraphQLQuery
	@Column(name = "lotStatus", columnDefinition = "varchar")
	String lotStatus

	@GraphQLQuery
	@Column(name = "denr_update_status", columnDefinition = "varchar")
	String denrUpdateStatus

	@GraphQLQuery
	@Column(name = "denr_tracking_no", columnDefinition = "varchar")
	String denrTrackingNo


	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "`t_user`", referencedColumnName = "id")
	User user

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lot_transaction", referencedColumnName = "id")
	LotTransaction lotTransaction

	@GraphQLQuery
	@Column(name = "is_override", columnDefinition = "bool")
	Boolean isOverride

	@GraphQLQuery
	@Column(name = "is_pending", columnDefinition = "bool")
	Boolean isPending

	@GraphQLQuery
	@Column(name = "pending_type", columnDefinition = "varchar")
	String pendingType

	@GraphQLQuery
	@Column(name = "pending_by", columnDefinition = "varchar")
	String pendingBy

	@GraphQLQuery
	@Column(name = "remarks", columnDefinition = "varchar")
	String remarks
	//===================variables for uploadStatus================

}




