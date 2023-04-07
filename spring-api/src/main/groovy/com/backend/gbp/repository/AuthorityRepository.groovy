package com.backend.gbp.repository

import com.backend.gbp.domain.Authority
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.query.Param

interface AuthorityRepository extends JpaRepository<Authority, UUID> {
	
	Authority findOneByName(@Param("name") String name)
	
}