package com.hisd3.hismk2.graphqlservices.payroll

import com.fasterxml.jackson.databind.ObjectMapper
import com.hisd3.hismk2.domain.hrm.Employee
import com.hisd3.hismk2.domain.hrm.dto.EmployeeAccumulatedAttendanceDto
import com.hisd3.hismk2.domain.payroll.AccumulatedLog
import com.hisd3.hismk2.domain.payroll.AccumulatedLogSummary
import com.hisd3.hismk2.domain.payroll.FinalAccumulatedLogs
import com.hisd3.hismk2.domain.payroll.OriginalAccumulatedLogs
import com.hisd3.hismk2.domain.payroll.Payroll
import com.hisd3.hismk2.domain.payroll.Timekeeping
import com.hisd3.hismk2.domain.payroll.TimekeepingEmployee
import com.hisd3.hismk2.domain.payroll.Totals
import com.hisd3.hismk2.domain.payroll.enums.AccumulatedLogStatus
import com.hisd3.hismk2.domain.payroll.enums.TimekeepingEmployeeStatus
import com.hisd3.hismk2.domain.payroll.enums.TimekeepingStatus
import com.hisd3.hismk2.graphqlservices.types.GraphQLRetVal
import com.hisd3.hismk2.repository.hrm.EmployeeRepository
import com.hisd3.hismk2.repository.payroll.AccumulatedLogRepository
import com.hisd3.hismk2.repository.payroll.TimekeepingEmployeeRepository
import com.hisd3.hismk2.repository.payroll.TimekeepingRepository
import com.hisd3.hismk2.services.PayrollTimeKeepingCalculatorService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import org.xmlsoap.schemas.soap.encoding.Time

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import java.time.Instant

@TypeChecked
@Component
@GraphQLApi
class TimekeepingService {

    @Autowired
    TimekeepingRepository timekeepingRepository

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    TimekeepingEmployeeRepository timekeepingEmployeeRepository

    @Autowired
    PayrollTimeKeepingCalculatorService payrollTimeKeepingCalculatorService

    @Autowired
    AccumulatedLogRepository accumulatedLogRepository

    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager

    //=================================QUERY=================================\\
    @GraphQLQuery(name = "timekeepings", description = "Get All timekeepings")
    List<Timekeeping> findAll() {
        timekeepingRepository.findAll().sort { it.createdDate }
    }

    @GraphQLQuery(name = "getTimekeepingById", description = "Get timekeeping by ID")
    Timekeeping findById(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return timekeepingRepository.findById(id).get()
        } else {
            return null
        }

    }

    @GraphQLQuery(name = "getTimekeepingAndEmployees", description = "Get All timekeepings")
    Timekeeping getTimekeepingAndEmployees(@GraphQLArgument(name = "timekeepingId") UUID timekeepingId) {

        Timekeeping timekeeping = timekeepingRepository.findById(timekeepingId).get()
        // List<TimekeepingEmployee> timekeepingEmployeeList = timekeepingEmployeeRepository.findByTimekeeping(timekeepingId)

        return timekeeping
        //List <Employee> employees =timekeepingEmployeeRepository.getTimekeepingEmployees(timekeepingId)
    }


    //=================================QUERY=================================\\


    //================================MUTATION================================\\

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<Timekeeping> upsertTimekeeping(
            @GraphQLArgument(name = "payroll") Payroll payroll,
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "employeeList") List<UUID> employeeList
    ) {
        Timekeeping timekeeping = new Timekeeping()

//        if(timekeeping){
        try{
            timekeeping = entityManager.createQuery("""
                Select t from Timekeeping t 
                left join fetch t.timekeepingEmployees
                where t.payroll.id = :payrollId
            """, Timekeeping.class).setParameter("payrollId", payroll.id)
                    .singleResult

            List<TimekeepingEmployee> employeesToRemove = []
            timekeeping.timekeepingEmployees.each { TimekeepingEmployee te ->
                // if employee is in the list do nothing
                // if employee is not in the list then remove
                int index = employeeList.indexOf(te.employee.id)
                if (index < 0) {
                    employeesToRemove.add(te)
                } else {
                    employeeList.remove(index)
                }
            }
            timekeeping.timekeepingEmployees.removeAll(employeesToRemove)


            List<TimekeepingEmployee> timekeepingEmployeeList = new ArrayList<TimekeepingEmployee>()
            if (employeeList.size() > 0) {
                List<Employee> listOfEmployees = entityManager.createQuery("""
                Select e from Employee e where e.id in :id
            """, Employee.class).setParameter("id", employeeList)
                        .getResultList()
                listOfEmployees.each {
                    TimekeepingEmployee timekeepingEmployee = new TimekeepingEmployee()
                    timekeepingEmployee.status = TimekeepingEmployeeStatus.DRAFT
                    timekeepingEmployee.employee = it
                    timekeepingEmployee.timekeeping = timekeeping
                    timekeepingEmployeeList.add(timekeepingEmployee)
                }
                timekeeping.timekeepingEmployees.addAll(timekeepingEmployeeList)
            }

            if (timekeeping.status == TimekeepingStatus.ACTIVE) {


                timekeepingEmployeeList.each {

                    def timekeepingEmployee = it
//                    List<EmployeeAccumulatedAttendanceDto> logs = payrollTimeKeepingCalculatorService.getAccumulatedLogs(it.employee.id, timekeeping.dateStart, timekeeping.dateEnd)
                    List<EmployeeAccumulatedAttendanceDto> logs = []


                    logs.each {
                        AccumulatedLog accumulatedLog = new AccumulatedLog()
                        AccumulatedLogSummary summary = new AccumulatedLogSummary()
                        summary.timekeepingEmployee = timekeepingEmployee
                        summary.totals = objectMapper.convertValue(it, Totals)

                        accumulatedLog.schedule.start = it.scheduleStart
                        accumulatedLog.schedule.end = it.scheduleEnd

//                        accumulatedLog.timekeepingEmployee = timekeepingEmployee

                        accumulatedLog.status = AccumulatedLogStatus.DRAFT
                        accumulatedLog.date = it.date
                        accumulatedLog.inTime = it.inTime
                        accumulatedLog.outTime = it.outTime


                        accumulatedLog.originalLogs = objectMapper.convertValue(it, OriginalAccumulatedLogs)
                        accumulatedLog.finalLogs = objectMapper.convertValue(it, FinalAccumulatedLogs)




                        accumulatedLogRepository.save(accumulatedLog)
                    }


                }
            }


            timekeepingRepository.save(timekeeping)

            return new GraphQLRetVal<Timekeeping>(timekeeping, true, "Successfully updated timekeeping")
        }catch(ignored){

            timekeeping.timekeepingEmployees.clear()
            timekeeping.payroll = payroll
            List<Employee> listOfEmployees = entityManager.createQuery("""
                Select e from Employee e where e.id in :id
            """, Employee.class).setParameter("id", employeeList)
                    .getResultList()
            timekeeping.status = TimekeepingStatus.DRAFT
            timekeeping = timekeepingRepository.save(timekeeping)

            List<TimekeepingEmployee> timekeepingEmployeeList = new ArrayList<TimekeepingEmployee>()
            listOfEmployees.each {
                TimekeepingEmployee timekeepingEmployee = new TimekeepingEmployee()
                timekeepingEmployee.status = TimekeepingEmployeeStatus.DRAFT
                timekeepingEmployee.employee = it
                timekeepingEmployee.timekeeping = timekeeping
                timekeepingEmployeeList.add(timekeepingEmployee)


            }

            timekeepingEmployeeRepository.saveAll(timekeepingEmployeeList)

            return new GraphQLRetVal<Timekeeping>(timekeeping, true, "Successfully created timekeeping")
        }

    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<Timekeeping> updateTimekeepingStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") String status

    ) {

        Timekeeping timekeeping = timekeepingRepository.findById(id).get()
        if (status == 'ACTIVE')
            timekeeping.status = TimekeepingStatus.ACTIVE
        else if (status == 'CANCELLED')
            timekeeping.status = TimekeepingStatus.CANCELLED
        else if (status == 'FINALIZED')
            timekeeping.status = TimekeepingStatus.FINALIZED

        timekeepingRepository.save(timekeeping)

        return new GraphQLRetVal<Timekeeping>(timekeeping, true, "Successfully updated timekeeping")

    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<String> updateTimekeepingDetails(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {

        Timekeeping timekeeping = entityManager.createQuery("""
                Select t from Timekeeping t 
                where t.id = :id
            """, Timekeeping.class).setParameter("id", id)
                .singleResult

        timekeeping = objectMapper.updateValue(timekeeping, fields)
        timekeepingRepository.save(timekeeping)

        return new GraphQLRetVal<String>("OK", true, "Successfully updated timekeeping")

    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<String> deleteTimekeeping(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if (!id) return new GraphQLRetVal<String>("ERROR", false, "Failed to delete timekeeping")
        Timekeeping timekeeping = timekeepingRepository.findById(id).get()
        timekeepingRepository.delete(timekeeping)

        return new GraphQLRetVal<String>("OK", true, "Successfully deleted timekeeping")
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<String> calculateAccumulatedLogs(
            @GraphQLArgument(name = "timekeepingId") UUID timekeepingId,
            @GraphQLArgument(name = "ids") List<UUID> ids,
            @GraphQLArgument(name = "startDate") Instant startDate,
            @GraphQLArgument(name = "endDate") Instant endDate
    ) {
        ArrayList<AccumulatedLog> accumulatedLogList = new ArrayList<AccumulatedLog>()

        List<TimekeepingEmployee> timekeepingEmployeeList = entityManager.createQuery("""
                Select te from TimekeepingEmployee te where te.employee.id in :ids and te.timekeeping.id = :timekeepingId
            """, TimekeepingEmployee.class).setParameter("ids", ids,).setParameter("timekeepingId", timekeepingId,)
                .getResultList()

        timekeepingEmployeeList.each {
//            it.accumulatedLogs.clear()
            it.status = TimekeepingEmployeeStatus.DRAFT
            timekeepingEmployeeRepository.save(it)
            def timekeepingEmployee = it
            List<EmployeeAccumulatedAttendanceDto> logs = payrollTimeKeepingCalculatorService.getAccumulatedLogs(it.employee.id, startDate, endDate)
            logs.each {
                AccumulatedLog accumulatedLog = new AccumulatedLog()
//                accumulatedLog.timekeepingEmployee = timekeepingEmployee
                
                accumulatedLog.status = AccumulatedLogStatus.DRAFT
                accumulatedLog.date = it.date
                accumulatedLog.inTime = it.inTime
                accumulatedLog.outTime = it.outTime
                
                

                accumulatedLog.originalLogs = objectMapper.convertValue(it, OriginalAccumulatedLogs)
                accumulatedLog.finalLogs = objectMapper.convertValue(it, FinalAccumulatedLogs)

                accumulatedLogList.add(accumulatedLog)
            }


        }
        accumulatedLogRepository.saveAll(accumulatedLogList)
        return new GraphQLRetVal<String>("OK", true, "Successfully updated timekeeping")
    }


}






