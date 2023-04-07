package com.backend.gbp.graphqlservices


import com.backend.gbp.domain.Permission
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@TypeChecked
@Component
@GraphQLApi
class PermissionService {
	
	@Autowired
	private com.backend.gbp.repository.PermissionRepository permissionRepository
	
	//============== All Queries ====================
	
	@GraphQLQuery(name = "permissions", description = "Get all Permissions")
	List<Permission> findAll() {
		return permissionRepository.findAll()
	}
	
}
