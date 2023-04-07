package com.hisd3.hismk2.graphqlservices.referential

import com.fasterxml.jackson.databind.ObjectMapper
import com.hisd3.hismk2.domain.referential.DohPosition
import com.hisd3.hismk2.domain.referential.DohPositionOthers
import com.hisd3.hismk2.graphqlservices.types.GraphQLRetVal
import com.hisd3.hismk2.repository.referential.DohPositionOthersRepository
import com.hisd3.hismk2.repository.referential.DohPositionRepository
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@TypeChecked
@GraphQLApi
@Component
class DohPositionOthersService {
	@Autowired
	private DohPositionOthersRepository dohPositionOthersRepository

	@Autowired
	private DohPositionRepository dohPositionRepository

//======================================QUERIES================================================

	@Autowired
	ObjectMapper objectMapper

	@GraphQLQuery(name = "getOtherPositions", description = "Get all doh positions")
	List<DohPositionOthers> getOtherPositions() {
		return dohPositionOthersRepository.findAll().sort({it.postdesc})
	}

	@GraphQLQuery(name = "getOtherPositionsActive", description = "Get all active other positions")
	List<DohPositionOthers> getOtherPositionsActive() {
		return dohPositionOthersRepository.getActivePositions()
	}

//======================================MUTATIONS================================================

	@GraphQLMutation
	@Transactional
	GraphQLRetVal<DohPositionOthers> upsertOtherPosition(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "id") UUID id

	) {
		List <DohPosition> positions = dohPositionRepository.findAll()
		List <DohPositionOthers> positionOthersList = dohPositionOthersRepository.findAll()

		Boolean postDescExists = false
		positions.each {
			if(it.postdesc == fields['postdesc']){
				postDescExists = true
			}
		}
		positionOthersList.each {
			if(it.postdesc == fields['postdesc']){
				postDescExists = true
			}
		}

		if(postDescExists)
				return new GraphQLRetVal<DohPositionOthers>(null, false, "Position description already exists..")

		if (id) {
			DohPositionOthers positionOthers = dohPositionOthersRepository.findById(id).get()
			objectMapper.updateValue(positionOthers, fields)
			return new GraphQLRetVal<DohPositionOthers>(positionOthers, true, "Updated position successfully.")
		} else {
			DohPositionOthers positionOthers = objectMapper.convertValue(fields, DohPositionOthers)

			dohPositionOthersRepository.save(positionOthers)
			return new GraphQLRetVal<DohPositionOthers>(positionOthers, true, "Added position successfully.")
		}

	}


	@GraphQLMutation
	@Transactional
	GraphQLRetVal<DohPositionOthers> updatePositionStatus(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") Boolean status

	) {
		DohPositionOthers position = dohPositionOthersRepository.findById(id).get()
		position.status = status
		return new GraphQLRetVal<DohPositionOthers>(position, true, "Active status changed successfully.")

	}
}
