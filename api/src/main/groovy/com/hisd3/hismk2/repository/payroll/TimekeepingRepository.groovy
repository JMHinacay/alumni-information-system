package com.hisd3.hismk2.repository.payroll

import com.hisd3.hismk2.domain.Authority
import com.hisd3.hismk2.domain.User

import com.hisd3.hismk2.domain.payroll.Timekeeping
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TimekeepingRepository extends JpaRepository<Timekeeping, UUID> {

}
