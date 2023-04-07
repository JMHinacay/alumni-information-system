package com.hisd3.hismk2.graphqlservices.referential

import com.hisd3.hismk2.domain.referential.DohPosition
import com.hisd3.hismk2.repository.referential.DohPositionRepository
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@TypeChecked
@GraphQLApi
@Component
class DohPositionService {
	@Autowired
	private DohPositionRepository dohPositionRepository
	
	@GraphQLQuery(name = "getDOHPositions", description = "Get all DOH Positions")
	List<DohPosition> getDOHPositions() {
		return dohPositionRepository.getDOHPositions()
	}
}
