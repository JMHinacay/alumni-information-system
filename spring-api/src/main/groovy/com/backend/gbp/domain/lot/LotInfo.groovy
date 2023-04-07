package com.backend.gbp.domain.lot

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.address.Barangay
import com.backend.gbp.domain.address.City
import com.backend.gbp.domain.address.Province
import com.fasterxml.jackson.databind.ObjectMapper
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Formula
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where
import org.springframework.beans.factory.annotation.Autowired

import javax.persistence.*

//import org.joda.time.LocalDateTime

@javax.persistence.Entity
@javax.persistence.Table(name = "lot_info", schema = "lot")
class LotInfo extends AbstractAuditingEntity
{




	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "lot_type", columnDefinition = "varchar")
	String lotType

//	@OneToMany(mappedBy = "lotInfo", orphanRemoval = true, cascade = CascadeType.ALL)//mapped by is column name sa fkey
//	List<Claimant> claimants = []
//
	@OneToMany(mappedBy = "lotInfo", orphanRemoval = true, cascade = CascadeType.ALL)
	List<LotAreaInfo> lotAreaInfos = []

//	@OneToMany(mappedBy = "lotInfo", orphanRemoval = true, cascade = CascadeType.ALL)//mapped by is column name sa fkey
//	List<LotTransaction> lotTransactions = []

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "barangay", referencedColumnName = "id")
	Barangay barangay

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "city", referencedColumnName = "id")
	City city

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "province", referencedColumnName = "id")
	Province province

	@GraphQLQuery
	@Column(name = "owner_firstname", columnDefinition = "varchar")
	String ownerFirstName

	@GraphQLQuery
	@Column(name = "owner_middlename", columnDefinition = "varchar")
	String ownerMiddleName

	@GraphQLQuery
	@Column(name = "owner_lastname", columnDefinition = "varchar")
	String ownerLastName


	@Transient
	String getBarangayName() { //serviceName
		return barangay.barangayName
	}
	@Transient
	String getCityName() { //serviceName
		return city.cityName
	}
	@Transient
	String getProvinceName() { //serviceName
		return province.provinceName
	}

//	@GraphQLQuery
//	@Formula("concat(last_name , coalesce(', ' || nullif(first_name,'') , ''), coalesce(' ' || nullif(middle_name,'') , ''), coalesce(' ' || nullif(name_suffix,'') , ''))")
//	String fullAddress
//
//	@GraphQLQuery
//	@Formula("concat(owner_lastname , coalesce(', ' || nullif(owner_firstname,'') , ''), coalesce(' ' || nullif(owner_middlename,'') , ''), coalesce(' ' || nullif(name_suffix,'') , ''))")
//	String ownerFullName

//	@Transient
//	List<String> getLotNos() { //serviceName
//		List<String> a = lotAreaInfos.each {
//			return it.lotNo
//		}
//
//
//		return a
//	}

}
