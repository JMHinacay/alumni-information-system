package com.backend.gbp.repository

import com.backend.gbp.domain.Agent
import com.backend.gbp.domain.Service
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AgentRepository extends JpaRepository<Agent, UUID> {

	@Query(
			value = '''Select a from Agent a where (lower(a.agentName) like lower(concat('%',:filter,'%')))'''
	)
	List<Agent> agentByFilter(@Param("filter") String filter)

	@Query(
			value = '''Select a from Agent a where (lower(a.agentName) like lower(concat('%',:filter,'%')))
					 and a.status = :status'''
	)
	List<Agent> agentByFilterStatus(@Param("filter") String filter, @Param("status") Boolean status)

	@Query(
			value = '''Select a from Agent a where a.status = true'''
	)
	List<Agent> findActive()
}
