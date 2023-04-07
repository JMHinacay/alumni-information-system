package com.hisd3.hismk2.graphqlservices.payroll

import com.hisd3.hismk2.domain.common.AbstractPayrollApprovalStatusAuditingEntity
import com.hisd3.hismk2.domain.hrm.Employee
import com.hisd3.hismk2.domain.payroll.enums.PayrollApprovalStatus
import com.hisd3.hismk2.graphqlservices.base.AbstractDaoService
import com.hisd3.hismk2.repository.hrm.EmployeeRepository
import com.hisd3.hismk2.security.SecurityUtils
import org.springframework.beans.factory.annotation.Autowired

import java.time.Instant

abstract class AbstractPayrollStatusService<T extends AbstractPayrollApprovalStatusAuditingEntity> extends AbstractDaoService<T> {


    @Autowired
    EmployeeRepository employeeRepository

    AbstractPayrollStatusService(Class<T> classType) {
        super(classType)
    }


    T updateStatus(UUID id, PayrollApprovalStatus status) {
        T entity = findOne(id)
        entity.status = status
        if (entity.status == PayrollApprovalStatus.FINALIZED) {
            Employee employee = null

            employeeRepository.findOneByUsername(SecurityUtils.currentLogin()).ifPresent { employee = it }
            if (employee == null) throw new RuntimeException("No approver found.")

            entity.finalizedBy = employee
            entity.finalizedDate = Instant.now()
        } else {
            entity.finalizedBy = null
            entity.finalizedDate = null
        }

        return save(entity)
    }

}
