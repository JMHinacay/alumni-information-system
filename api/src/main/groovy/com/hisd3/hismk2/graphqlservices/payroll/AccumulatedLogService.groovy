package com.hisd3.hismk2.graphqlservices.payroll

import com.fasterxml.jackson.databind.ObjectMapper
import com.hisd3.hismk2.domain.hrm.dto.EmployeeAccumulatedAttendanceDto
import com.hisd3.hismk2.domain.payroll.AccumulatedLog
import com.hisd3.hismk2.domain.payroll.FinalAccumulatedLogs
import com.hisd3.hismk2.domain.payroll.OriginalAccumulatedLogs
import com.hisd3.hismk2.domain.payroll.Timekeeping
import com.hisd3.hismk2.domain.payroll.TimekeepingEmployee
import com.hisd3.hismk2.domain.payroll.enums.AccumulatedLogStatus
import com.hisd3.hismk2.domain.payroll.enums.TimekeepingStatus
import com.hisd3.hismk2.graphqlservices.types.GraphQLRetVal
import com.hisd3.hismk2.repository.payroll.AccumulatedLogRepository
import com.hisd3.hismk2.services.PayrollTimeKeepingCalculatorService
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
import java.time.Instant

@TypeChecked
@Component
@GraphQLApi
class AccumulatedLogService {

    @Autowired
    PayrollTimeKeepingCalculatorService payrollTimeKeepingCalculatorService

    @Autowired
    AccumulatedLogRepository accumulatedLogRepository

    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager

    //=================================QUERY=================================\\
    @GraphQLQuery(name = "getTimekeepingEmployeeAccumulatedLogsById", description = "Get timekeeping by ID")
    List<AccumulatedLog> getTimekeepingEmployeeAccumulatedLogsByEmpId(@GraphQLArgument(name = "id") UUID id) {
        if(id){
            
             accumulatedLogRepository.findByTimekeepingEmployee(id).sort{it.date}
        }else{
            return null
        }

    }

    @GraphQLQuery(name = "getAccumulatedLogById", description = "Get accumulated Log by ID")
    AccumulatedLog getAccumulatedLogById(@GraphQLArgument(name = "id") UUID id) {
        if(id){

            accumulatedLogRepository.findById(id).get()
        }else{
            return null
        }

    }
    //=================================MUTATIONS=================================\\
    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<String> updateHours(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "logs") Map<String, Object> logs
    ) {
        AccumulatedLog accumulatedLog = accumulatedLogRepository.findById(id).get()
       def newLogs = objectMapper.convertValue(logs, FinalAccumulatedLogs)

        accumulatedLog.finalLogs = newLogs


        accumulatedLogRepository.save(accumulatedLog)
        return new GraphQLRetVal<String>("OK", true, "Successfully updated updated logs")


    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<String> recalculateOneLog(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "empId") UUID empId,
            @GraphQLArgument(name = "startDate") Instant startDate,
            @GraphQLArgument(name = "endDate") Instant endDate
    ) {

        AccumulatedLog accumulatedLog = accumulatedLogRepository.findById(id).get()

        List<EmployeeAccumulatedAttendanceDto> logs = payrollTimeKeepingCalculatorService.getAccumulatedLogs(empId, startDate, endDate)

        accumulatedLog.finalLogs = objectMapper.convertValue(logs[0], FinalAccumulatedLogs)
        accumulatedLog.originalLogs = objectMapper.convertValue(logs[0], OriginalAccumulatedLogs)

        accumulatedLogRepository.save(accumulatedLog)
        return new GraphQLRetVal<String>("OK", true, "Successfully recalculated log")
    }



}
