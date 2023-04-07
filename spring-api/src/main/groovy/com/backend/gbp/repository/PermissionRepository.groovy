package com.backend.gbp.repository

import com.backend.gbp.domain.Permission
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.query.Param

interface PermissionRepository extends JpaRepository<Permission, UUID> {
	
	Permission findOneByName(@Param("name") String name)
	
}