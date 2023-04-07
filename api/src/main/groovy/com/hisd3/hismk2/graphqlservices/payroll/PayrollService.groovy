package com.hisd3.hismk2.graphqlservices.payroll

import com.fasterxml.jackson.databind.ObjectMapper
import com.hisd3.hismk2.domain.eclaims.EclaimsIntegrationAccount
import com.hisd3.hismk2.domain.hrm.Allowance
import com.hisd3.hismk2.domain.hrm.Employee
import com.hisd3.hismk2.domain.hrm.dto.EmployeeAccumulatedAttendanceDto
import com.hisd3.hismk2.domain.hrm.enums.PayrollStatus
import com.hisd3.hismk2.domain.payroll.*
import com.hisd3.hismk2.domain.payroll.enums.AccumulatedLogStatus
import com.hisd3.hismk2.domain.payroll.enums.PayrollApprovalStatus
import com.hisd3.hismk2.domain.payroll.enums.PayrollEmployeeStatus
import com.hisd3.hismk2.domain.payroll.enums.TimekeepingEmployeeStatus
import com.hisd3.hismk2.domain.payroll.enums.TimekeepingStatus
import com.hisd3.hismk2.graphqlservices.types.GraphQLRetVal
import com.hisd3.hismk2.repository.hrm.EmployeeRepository
import com.hisd3.hismk2.repository.payroll.AccumulatedLogRepository
import com.hisd3.hismk2.repository.payroll.PayrollRepository
import com.hisd3.hismk2.repository.payroll.TimekeepingEmployeeRepository
import com.hisd3.hismk2.repository.payroll.TimekeepingRepository
import com.hisd3.hismk2.services.PayrollTimeKeepingCalculatorService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import java.time.Instant

@TypeChecked
@Component
@GraphQLApi
class PayrollService extends AbstractPayrollStatusService<Payroll> {

    PayrollService() {
        super(Payroll.class)
    }

    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager

    //=================================QUERY=================================\\
    @GraphQLQuery(name = "payrolls", description = "Get All payroll")
    List<Payroll> findAll() {
        payrollRepository.findAll().sort { it.createdDate }
    }

    @GraphQLQuery(name = "getPayrollById", description = "Get payroll by ID")
    Payroll findById(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return payrollRepository.findById(id).get()
        } else {
            return null
        }

    }

    @GraphQLQuery(name = 'getPayrollByPagination', description = 'list of all allowances with pagination')
    Page<Payroll> getPayrollByPagination(
            @GraphQLArgument(name = "pageSize") Integer pageSize,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "filter") String filter
    ) {
        return payrollRepository.getPayrollByFilterPagable(filter, PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, 'createdDate')))
    }


    //=================================QUERY=================================\\


    //================================MUTATION================================\\

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<Payroll> upsertPayroll(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "employeeList") List<UUID> employeeList
    ) {
        if (id) {
            Payroll payroll = payrollRepository.findById(id).get()
            payroll = objectMapper.updateValue(payroll, fields)
            payroll = payrollRepository.save(payroll)

            List<PayrollEmployee> employeesToRemove = []
            payroll.payrollEmployees.each { PayrollEmployee te ->
                int index = employeeList.indexOf(te.employee.id)
                if (index < 0) {
                    employeesToRemove.add(te)
                } else {
                    employeeList.remove(index)
                }
            }
            payroll.payrollEmployees.removeAll(employeesToRemove)
            if (employeeList.size() > 0) {
                payroll.payrollEmployees.addAll(createPayrollEmployees(employeeList, payroll))
            }
            payrollRepository.save(payroll)
            return new GraphQLRetVal<Payroll>(payroll, true, "Successfully updated Payroll")
        } else {
            Payroll payroll = objectMapper.convertValue(fields, Payroll)
            payroll.status = PayrollApprovalStatus.DRAFT
            payroll.payrollEmployees.addAll(createPayrollEmployees(employeeList, payroll))
            payroll = payrollRepository.save(payroll)

            return new GraphQLRetVal<Payroll>(payroll, true, "Successfully created new Payroll")
        }
    }

    List<PayrollEmployee> createPayrollEmployees ( List<UUID> employeeList, Payroll payroll){
        List<PayrollEmployee> payrollEmployees = new ArrayList<PayrollEmployee>()
            List<Employee> listOfEmployees = entityManager.createQuery("""
                Select e from Employee e where e.id in :id
            """, Employee.class).setParameter("id", employeeList)
                    .getResultList()
            listOfEmployees.each {
                PayrollEmployee payrollEmployee = new PayrollEmployee()
                payrollEmployee.status = PayrollEmployeeStatus.DRAFT
                payrollEmployee.employee = it
                payrollEmployee.payroll = payroll
                payrollEmployees.add(payrollEmployee)
            }
        return payrollEmployees
    }



    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<Payroll> updatePayrollStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") String status

    ) {
        Payroll payroll = updateStatus(id, PayrollApprovalStatus.valueOf(status))

        if (status == 'ACTIVE') {
            //TODO: actions for creating timekeeping, timekeeping employee, accumulated logs summary and accumulated logs.
            //TODO: actions for creating allowance, payroll employee allowance, payroll employee allowance item.
            //TODO: actions for creating contributions and payroll employee contributions
        }
//        else if (status == 'CANCELLED')
//            payroll.status = PayrollApprovalStatus.CANCELLED
//        else if (status == 'FINALIZED') {
//            payroll.status = PayrollApprovalStatus.FINALIZED
//        }
//
//        payrollRepository.save(payroll)

        return new GraphQLRetVal<Payroll>(payroll, true, "Successfully updated payroll")
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<String> updatePayrollDetails(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {

        Payroll payroll = payrollRepository.findById(id).get()

        payroll = objectMapper.updateValue(payroll, fields)
        payrollRepository.save(payroll)

        return new GraphQLRetVal<String>("OK", true, "Successfully updated payroll details")

    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<String> deletePayroll(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if (!id) return new GraphQLRetVal<String>("ERROR", false, "Failed to delete payroll")
        Payroll timekeeping = payrollRepository.findById(id).get()
        payrollRepository.delete(timekeeping)

        return new GraphQLRetVal<String>("OK", true, "Successfully deleted payroll")
    }


}






