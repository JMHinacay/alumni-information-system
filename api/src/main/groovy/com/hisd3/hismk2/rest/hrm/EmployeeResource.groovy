package com.hisd3.hismk2.rest.hrm

import com.hisd3.hismk2.domain.hrm.EmployeeAttendance
import com.hisd3.hismk2.domain.hrm.dto.EmployeeAccumulatedAttendanceDto
import com.hisd3.hismk2.repository.hrm.EmployeeAttendanceRepository
import com.hisd3.hismk2.repository.hrm.EmployeeRepository
import com.hisd3.hismk2.services.PayrollTimeKeepingCalculatorService
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLQuery
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import java.time.Instant


@RestController
@RequestMapping("/hrm")
class EmployeeResource {
    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    PayrollTimeKeepingCalculatorService payrollTimeKeepingCalculatorService

    @Autowired
    EmployeeAttendanceRepository employeeAttendanceRepository

    @RequestMapping(value = "/getEmployeeByIdNumber", produces = ["application/json"])
    def getEmployeeByIdNumber(
            @RequestParam String id
    ) {
        return id ? employeeRepository.findByEmployeeId(id) : null
    }

    @RequestMapping(value = "/getEmployeeAccumulatedLogs", produces = ["application/json"])
    def getEmployeeAccumulatedLogs(
            @RequestParam UUID id,
            @RequestParam Instant startDate,
            @RequestParam Instant endDate
    ) {
        if (!id || !startDate || !endDate) {
            throw new RuntimeException("Failed to get accumulated logs.")
        }

        List<EmployeeAccumulatedAttendanceDto> accumulatedLogs = payrollTimeKeepingCalculatorService.getAccumulatedLogs(id, startDate, endDate)

        return accumulatedLogs
    }

    @RequestMapping(value = "/getEmployeePerformanceSummary", produces = ["application/json"])
    def getEmployeePerformanceSummary(
            @RequestParam UUID id,
            @RequestParam Instant startDate,
            @RequestParam Instant endDate

    ) {

        if (!id || !startDate || !endDate) throw new RuntimeException("Failed to get accumulated logs.")
        EmployeeAccumulatedAttendanceDto employeePerfSummary = payrollTimeKeepingCalculatorService.getEmployeePerformanceSummary(id, startDate, endDate)

        return employeePerfSummary
    }

    @RequestMapping(value = "/getEmployeeRawLogs", produces = ["application/json"])
    Page<EmployeeAttendance> getEmployeeRawLogs(
            @RequestParam Instant startDate,
            @RequestParam Instant endDate,
            @RequestParam UUID id,
            @RequestParam Integer page,
            @RequestParam Integer size
    ) {
        if (!startDate || !endDate || !id) throw new RuntimeException("Failed to get employee attendance.")
        return employeeAttendanceRepository.getEmployeeAttendanceExIgnored(id, startDate, endDate, new PageRequest(page, size, Sort.Direction.ASC, "attendance_time"))
    }
}
