package com.backend.gbp.repository

import com.backend.gbp.domain.GroupPolicy
import org.springframework.data.jpa.repository.JpaRepository

interface GroupPolicyRepository extends JpaRepository<GroupPolicy, UUID> {}
