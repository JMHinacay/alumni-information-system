package com.hisd3.hismk2.repository.payroll

import com.hisd3.hismk2.domain.hrm.Employee
import com.hisd3.hismk2.domain.payroll.PayrollEmployee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollEmployeeRepository extends JpaRepository<PayrollEmployee, UUID> {



    @Query(
            value = """Select te.employee from PayrollEmployee te where te.payroll.id = :id"""
    )
    List<Employee> findByPayrollEmployee(@Param("id") UUID id)

    @Query(
            value = """Select te from PayrollEmployee te where te.payroll.id = :id"""
    )
    List<PayrollEmployee> findByPayrollId(@Param("id") UUID id)





}
