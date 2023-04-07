package com.backend.gbp.graphqlservices

import com.backend.gbp.domain.DenrUpdates
import com.backend.gbp.domain.Position
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.PositionRepository
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@TypeChecked
@Component
@GraphQLApi
class PositionService {

    @Autowired
    PositionRepository positionRepository

    @Autowired
    GeneratorService generatorService

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================

    @GraphQLQuery(name = "positionList", description = "Get All Positions")
    List<Position> findAll() {
        positionRepository.findAll().sort { it.code }
    }

    @GraphQLQuery(name = "positionById", description = "Get Position By Id")
    Position findById(@GraphQLArgument(name = "id") UUID id) {
        return id ? positionRepository.findById(id).get() : null
    }

    @GraphQLQuery(name = "positionByFilter", description = "Search Positions")
    List<Position> positionRepository(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        if (status != null) {
            positionRepository.positionFilterStatus(filter, status).sort { it.code }
        } else {
            positionRepository.positionFilter(filter).sort { it.code }
        }

    }


    @GraphQLQuery(name = "activePositions", description = "Search Positions Active")
    List<Position> activePositions() {
        positionRepository.activePositions().sort { it.code }
    }

    //============== All Mutations ====================
    @GraphQLMutation(name = "upsertPosition")
    @Transactional
    GraphQLRetVal<Position> upsertPosition(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "authorities") List<String> authorities,
            @GraphQLArgument(name = "permissions") List<String> permissions


    ) {
        def obj = objectMapper.convertValue(fields, Position.class)

        List<Position> duplicate = null
        duplicate = positionRepository.positinByDescription(obj.description)
        if (duplicate) {
            return new GraphQLRetVal<Position>(null, false, "Duplicate position name exists.")
        }

        Position position = new Position()
        if (id) {
            position = positionRepository.findById(id).get()


        }
        if (!id) {
            position.code = "POS" + generatorService.getNextValue(GeneratorType.POSITION) { Long no ->
                StringUtils.leftPad(no.toString(), 6, "0")
            }
        }
        position.flagValue = obj.flagValue
        position.description = obj.description
        position.status = obj.status
//        position.defaultRoles.roles = authorities
        position.defaultRoles = authorities
        position.defaultPermissions = permissions

        position = positionRepository.save(position)

        return new GraphQLRetVal<Position>(position, true, "Position successfully saved.")

    }

}
