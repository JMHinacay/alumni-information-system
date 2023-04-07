package com.backend.gbp.domain.lot

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.Service
import com.backend.gbp.domain.SurveySched
import com.backend.gbp.rest.dto.UploadFilesDto
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

//import org.joda.time.LocalDateTime

@Entity
@Table(name = "lot_transaction", schema = "lot")
class LotTransaction extends AbstractAuditingEntity implements Serializable
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
	@JoinColumn(name = "service", referencedColumnName = "id")
	Service service

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lot_info", referencedColumnName = "id")
	LotInfo lotInfo

	@OneToMany(mappedBy = "lotTransaction", orphanRemoval = true, cascade = CascadeType.ALL)
	List<Claimant> claimants = []



	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	String status

	@GraphQLQuery
	@Column(name = "closedtype", columnDefinition = "varchar")
	String closedType

	@GraphQLQuery
	@Column(name = "closedby", columnDefinition = "varchar")
	String closedBy

	@GraphQLQuery
	@Column(name = "is_released_sketch_plan", columnDefinition = "bool")
	Boolean isReleasedSketchPlan

	@GraphQLQuery
	@Column(name = "is_released_approved_plan", columnDefinition = "bool")
	Boolean isReleasedApprovedPlan


//	@GraphQLQuery
//	@Column(name = "uploaded_file_flags", columnDefinition = "json")
//	String uploadedFileFlags

	@GraphQLQuery
	@Type(type = "jsonb")
	@Column(name="uploaded_file_flags",columnDefinition = "jsonb")
	UploadFilesDto uploadedFileFlags

	@GraphQLQuery
	@Column(name = "transaction_id", columnDefinition = "varchar")
	String transactionId

	@Transient
	String getOwnerFirstName() { //serviceName
		return lotInfo.ownerFirstName
	}

	@Transient
	String getOwnerMiddleName() { //serviceName
		return lotInfo.ownerMiddleName
	}

	@Transient
	String getOwnerLastName() { //serviceName
		return lotInfo.ownerLastName
	}


	@Transient
	String getServiceName() { //serviceName
		return service.serviceName
	}

	@Transient
	String getBarangayName() { //serviceName
		return lotInfo.barangay.barangayName
	}

	@Transient
	UUID getBarangayId() { //serviceName
		return lotInfo.barangay.id
	}

	@Transient
	String getCityName() { //serviceName
		return lotInfo.city.cityName
	}
	@Transient
	UUID getCityId() { //serviceName
		return lotInfo.city.id
	}

	@Transient
	String getProvinceName() { //serviceName
		return lotInfo.province.provinceName
	}
	@Transient
	UUID getProvinceId() { //serviceName
		return lotInfo.province.id
	}

	@Transient
	String getLotType() { //serviceName
		return lotInfo.lotType
	}

	@Transient
	String getLastStep() { //serviceName
		return service.lastStep
	}
}
