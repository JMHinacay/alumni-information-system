package com.backend.gbp.repository.hrm

import com.backend.gbp.domain.User
import com.backend.gbp.domain.hrm.Employee
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface EmployeeRepository extends JpaRepository<Employee, UUID> {

    @Query(
            value = "Select e from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%'))",
            countQuery = "Select count(e) from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%'))"
    )
    Page<Employee> getEmployees(@Param("filter") String filter, Pageable pageable)

    @Query(value = "Select e from Employee e where e.id in :id")
    List<Employee> getEmployees(@Param("id")List<UUID> id)

    @Query(
            value = "Select e from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%'))",
            countQuery = "Select count(e) from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%'))"
    )
    List<Employee> searchEmployees(@Param("filter") String filter)

    @Query(
            value = "Select e from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%')) ",
            countQuery = "Select count(e) from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%'))"
    )
    Page<Employee> searchEmployeesPageable(@Param("filter") String filter, Pageable pageable)

    @Query(
            value = "Select e from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%')) and e.isActive IS NOT NULL and e.isActive = true ",
            countQuery = "Select count(e) from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%')) and e.isActive IS NOT NULL and e.isActive = true"
    )
    Page<Employee> searchActiveEmployeesPageable(@Param("filter") String filter, Pageable pageable)


    @Query(
            value = "Select e from Employee e where e.user.login = :username"
    )
    List<Employee> findByUsername(@Param("username") String username)


    @Query(
            value = "Select e from Employee e where e.fullName = :fullName"
    )
    List<Employee> getEmployeeByFullName(@Param("fullName") String fullName)

    Employee findOneByUser(@Param("user") User user)


}
