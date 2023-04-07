package com.hisd3.hismk2.domain.payroll

import com.fasterxml.jackson.annotation.JsonIgnore
import com.hisd3.hismk2.domain.AbstractAuditingEntity
import com.hisd3.hismk2.domain.hrm.Employee
import com.hisd3.hismk2.domain.payroll.enums.AccumulatedLogStatus
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.*

import javax.persistence.*
import java.time.Instant

class Totals {
    Instant date
    Instant inTime
    Instant outTime

    Boolean isError
    Boolean isRestDay = false
    Boolean withNSD = true
    Boolean isLeave = false

    BigDecimal undertime
    BigDecimal late
    BigDecimal hoursAbsent
    BigDecimal worked
    BigDecimal hoursRegularOvertime
    BigDecimal hoursWorkedNSD
    BigDecimal workedOIC
    BigDecimal hoursRegularOICOvertime
    BigDecimal hoursWorkedOICNSD
    BigDecimal hoursRestDay
    BigDecimal hoursRestDayNSD
    BigDecimal hoursRestOvertime
    BigDecimal hoursDoubleHoliday
    BigDecimal hoursDoubleHolidayNSD
    BigDecimal hoursDoubleHolidayOvertime
    BigDecimal hoursDoubleHolidayOIC
    BigDecimal hoursDoubleHolidayOICNSD
    BigDecimal hoursDoubleHolidayOICOvertime
    BigDecimal hoursDoubleHolidayAndRestDay
    BigDecimal hoursDoubleHolidayAndRestDayOvertime
    BigDecimal hoursDoubleHolidayAndRestDayNSD
    BigDecimal hoursRegularHoliday
    BigDecimal hoursRegularHolidayOvertime
    BigDecimal hoursRegularHolidayNSD
    BigDecimal hoursRegularHolidayOIC
    BigDecimal hoursRegularHolidayOICOvertime
    BigDecimal hoursRegularHolidayOICNSD
    BigDecimal hoursRegularHolidayAndRestDay
    BigDecimal hoursRegularHolidayAndRestDayOvertime
    BigDecimal hoursRegularHolidayAndRestDayNSD
    BigDecimal hoursSpecialHoliday
    BigDecimal hoursSpecialHolidayOvertime
    BigDecimal hoursSpecialHolidayNSD
    BigDecimal hoursSpecialHolidayOIC
    BigDecimal hoursSpecialHolidayOICOvertime
    BigDecimal hoursSpecialHolidayOICNSD
    BigDecimal hoursSpecialHolidayAndRestDay
    BigDecimal hoursSpecialHolidayAndRestDayOvertime
    BigDecimal hoursSpecialHolidayAndRestDayNSD


}


@javax.persistence.Entity
@javax.persistence.Table(schema = "payroll", name = "accumulated_logs_summary")
//@SQLDelete(sql = "UPDATE payroll.accumulated_logs SET deleted = true WHERE id = ?")
//@Where(clause = "deleted <> true or deleted is  null ")
class AccumulatedLogSummary implements Serializable {


    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

//    @GraphQLQuery
//    @Column(name = "title", columnDefinition = "timestamp")
//    String title

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "timekeeping_employee", referencedColumnName = "id")
    TimekeepingEmployee timekeepingEmployee

    @OneToMany(mappedBy = "summary")
    List<AccumulatedLog> accumulatedLogs = []

//    @GraphQLQuery
//    @Enumerated(EnumType.STRING)
//    @Column(name = "status", columnDefinition = "varchar")
//    LogFlagStatus status
//
//    @JsonIgnore
//    @NotFound(action = NotFoundAction.IGNORE)
//    @OneToOne(fetch = FetchType.LAZY, optional = false)
//    @JoinColumn(name = "employee", referencedColumnName = "id")
//    Employee employee

    @Type(type = "jsonb")
    @Column(name="totals",columnDefinition = "jsonb")
    Totals totals


    // TODO: generated
    @Transient
    Boolean isAbsentOnly, isEmpty, isError, isOvertimeOnly, isRestDay, isRestDayOnly, message
    //end generated



}