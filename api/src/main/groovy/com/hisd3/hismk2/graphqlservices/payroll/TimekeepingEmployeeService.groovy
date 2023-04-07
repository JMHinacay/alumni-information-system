package com.hisd3.hismk2.graphqlservices.payroll

import com.hisd3.hismk2.domain.hrm.Employee
import com.hisd3.hismk2.domain.payroll.enums.TimekeepingEmployeeStatus
import com.hisd3.hismk2.domain.payroll.TimekeepingEmployee
import com.hisd3.hismk2.graphqlservices.types.GraphQLRetVal
import com.hisd3.hismk2.repository.payroll.TimekeepingEmployeeRepository
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@TypeChecked
@Component
@GraphQLApi
class TimekeepingEmployeeService {

    @Autowired
    TimekeepingEmployeeRepository timekeepingEmployeeRepository

    @PersistenceContext
    EntityManager entityManager

    //=================================QUERY=================================\\

    @GraphQLQuery(name = "getTimekeepingEmployeeIds", description = "Gets all the ids of the employees of the timekeeping")
    List<UUID> getTimekeepingEmployeeIds(@GraphQLArgument(name="timekeepingId") UUID timekeepingId) {
        List<UUID> ids =entityManager.createQuery("""
                Select te.employee.id from TimekeepingEmployee te where te.timekeeping.id = :timekeepingId
            """, UUID.class).setParameter("timekeepingId", timekeepingId)
                .getResultList()
        return ids
    }


    @GraphQLQuery(name = "getTimekeepingEmployee", description = "Gets all the ids of the employees of the timekeeping")
    List<Employee> getTimekeepingEmployee(@GraphQLArgument(name="id") UUID id) {
        return timekeepingEmployeeRepository.findByTimekeepingEmployee(id)
    }

    @GraphQLQuery(name = "getTimekeepingEmployeesV2", description = "Gets all the ids of the employees of the timekeeping")
    List<TimekeepingEmployee> getTimekeepingEmployeesV2(@GraphQLArgument(name="id") UUID id) {
        return timekeepingEmployeeRepository.findByTimekeepingId(id)
    }

    //=================================MUTATIONS=================================\\
    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<TimekeepingEmployee> updateTimekeepingEmployeeStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") String status

    ) {
        TimekeepingEmployee employee = timekeepingEmployeeRepository.findById(id).get()
        if (status == 'FINALIZED')
            employee.status = TimekeepingEmployeeStatus.FINALIZED
        else if (status == 'DRAFT')
            employee.status = TimekeepingEmployeeStatus.DRAFT

        timekeepingEmployeeRepository.save(employee)

        return new GraphQLRetVal<TimekeepingEmployee>(employee, true, "Successfully updated employee status")

    }
}
