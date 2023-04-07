package com.backend.gbp.graphqlservices

import com.backend.gbp.dao.UserDao
import com.backend.gbp.domain.Authority
import com.backend.gbp.domain.Permission
import com.backend.gbp.domain.PersistentToken
import com.backend.gbp.domain.User
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.security.SecurityUtils
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLContext
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.RandomStringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

//@TypeChecked
@Component
@GraphQLApi
class UserService {
	
	@Autowired
	private UserRepository userRepository
	
	@Autowired
	private EmployeeRepository employeeRepository
	
	@Autowired
	UserDao userDao
	
	@Autowired
	PasswordEncoder passwordEncoder
	//============== All Queries ====================
	
	@GraphQLMutation
	User resetPassword(@GraphQLArgument(name = "username") String username,
	                   @GraphQLArgument(name = "newPassword") String newPassword) {
		
		User user = userRepository.findOneByLogin(username)
		
		user.password = passwordEncoder.encode(newPassword)
		user.activated = true
		user = userRepository.save(user)
		return user
	}
	
	@GraphQLMutation
	String changePassword(@GraphQLArgument(name = "username") String username) {
		String tempPassword = RandomStringUtils.random(8, true, true)
		User user = userRepository.findOneByLogin(username)
		
		user.password = passwordEncoder.encode(tempPassword)
		user.activated = false
		
		userRepository.save(user)
		return tempPassword
	}
	
	@GraphQLQuery(name = "account", description = "Get User by login")
	Employee findOneByLogin() {
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		return employeeRepository.findOneByUser(user)
	}
	
	/*@GraphQLQuery(name = "authorities", description = "Get all User authorities")
	List<Authority> getAuthorities(@GraphQLContext User user) {
		return userDao.getAuthorities(user)
	}*/
	
	@GraphQLQuery(name = "persistentTokens", description = "Get all User persistentTokens")
	List<PersistentToken> getPersistentTokens(@GraphQLContext User user) {
		return userDao.getPersistentTokens(user)
	}
	
	/*@GraphQLQuery(name = "permissions", description = "Get all User permissions")
	List<Permission> getPermissions(@GraphQLContext User user) {
		return userDao.getPermissions(user)
	}*/
	
	@GraphQLQuery(name = "roles", description = "Get all User roles")
	List<String> getRoles(@GraphQLContext User user) {
		//return userDao.getRoles(user)
		
		// FYI Roles are save in the Session already... Lets save database acccess  round trip
		//SecurityUtils.roles
		
		user.authorities.collect { Authority it -> it.name }
	}
	
	@GraphQLQuery(name = "access", description = "Get all User access")
	List<String> getAccess(@GraphQLContext User user) {
		
		user.permissions.collect { Permission it -> it.name }
		//return userDao.getAccess(user)
	}

	@GraphQLQuery(name = "accessNames", description = "Get all User access")
	List<String> getAccessNames(@GraphQLContext User user) {

		user.permissions.collect { Permission it -> it.description }
		//return userDao.getAccess(user)
	}
	
	@GraphQLQuery(name = "isLoginUnique", description = "Check if username exists")
	Boolean isLoginUnique(@GraphQLArgument(name = "login") String login) {
		return !userRepository.findOneByLogin(login.toLowerCase())
	}
}
