package com.hisd3.hismk2.graphqlservices.payroll

import com.hisd3.hismk2.domain.hrm.Employee
import com.hisd3.hismk2.domain.payroll.TimekeepingEmployee
import com.hisd3.hismk2.domain.payroll.enums.TimekeepingEmployeeStatus
import com.hisd3.hismk2.graphqlservices.types.GraphQLRetVal
import com.hisd3.hismk2.repository.payroll.PayrollEmployeeRepository
import com.hisd3.hismk2.repository.payroll.PayrollRepository
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
class PayrollEmployeeService {

    @Autowired
    PayrollEmployeeRepository payrollEmployeeRepository

    @PersistenceContext
    EntityManager entityManager

    //=================================QUERY=================================\\

    @GraphQLQuery(name = "getPayrollEmployeeIds", description = "Gets all the ids of the employees of the Payroll")
    List<UUID> getPayrollEmployeeIds(@GraphQLArgument(name="PayrollId") UUID payrollId) {
        List<UUID> ids =entityManager.createQuery("""
                Select e.employee.id from PayrollEmployee e where e.Payroll.id = :payrollId
            """, UUID.class).setParameter("payrollId", payrollId)
                .getResultList()
        return ids
    }


    @GraphQLQuery(name = "getPayrollEmployee", description = "Gets all the employees by payroll id")
    List<Employee> getPayrollEmployee(@GraphQLArgument(name="id") UUID id) {
        return payrollEmployeeRepository.findByPayrollEmployee(id)
    }
//
//    @GraphQLQuery(name = "getPayrollEmployeesV2", description = "Gets all the ids of the employees of the Payroll")
//    List<PayrollEmployee> getPayrollEmployeesV2(@GraphQLArgument(name="id") UUID id) {
//        return PayrollEmployeeRepository.findByPayrollId(id)
//    }

    //=================================MUTATIONS=================================\\
//    @Transactional(rollbackFor = Exception.class)
//    @GraphQLMutation
//    GraphQLRetVal<PayrollEmployee> updatePayrollEmployeeStatus(
//            @GraphQLArgument(name = "id") UUID id,
//            @GraphQLArgument(name = "status") String status
//
//    ) {
//        PayrollEmployee employee = PayrollEmployeeRepository.findById(id).get()
//        if (status == 'FINALIZED')
//            employee.status = PayrollEmployeeStatus.FINALIZED
//        else if (status == 'DRAFT')
//            employee.status = PayrollEmployeeStatus.DRAFT
//
//        PayrollEmployeeRepository.save(employee)
//
//        return new GraphQLRetVal<PayrollEmployee>(employee, true, "Successfully updated employee status")
//
//    }
}
