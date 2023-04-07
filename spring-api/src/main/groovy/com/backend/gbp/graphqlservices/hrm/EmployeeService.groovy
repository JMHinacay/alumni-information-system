package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.SurveyTeamMember
import com.backend.gbp.domain.UserActivity
import com.backend.gbp.domain.lot.LotInfo
import com.backend.gbp.graphqlservices.SurveyTeamMemberService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.AuthorityRepository
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.PermissionRepository
import com.backend.gbp.repository.PositionRepository
import com.backend.gbp.repository.SurveyTeamMemberRepository
import com.backend.gbp.repository.SurveyTeamRepository
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.address.BarangayRepository
import com.backend.gbp.repository.address.CityRepository
import com.backend.gbp.repository.address.ProvinceRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.Authority
import com.backend.gbp.domain.User

import com.backend.gbp.domain.hrm.Employee
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@TypeChecked
@Component
@GraphQLApi
class EmployeeService {

    @Autowired
    private UserRepository userRepository

    @Autowired
    private EmployeeRepository employeeRepository

    @Autowired
    private SurveyTeamMemberRepository surveyTeamMemberRepository

    @Autowired
    OfficeRepository officeRepository

    @Autowired
    PositionRepository positionRepository

    @Autowired
    JdbcTemplate jdbcTemplate

    @Autowired
    GeneratorService generatorService

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    PasswordEncoder passwordEncoder

    @Autowired
    PermissionRepository permissionRepository

    @Autowired
    BarangayRepository barangayRepository

    @Autowired
    CityRepository cityRepository

    @Autowired
    ProvinceRepository provinceRepository

    @Autowired
    SurveyTeamMemberService surveyTeamMemberService

    @Autowired
    AuthorityRepository authorityRepository

    //============================================================All Queries ============================================================

    @GraphQLQuery(name = "employees", description = "Get All Employees")
    List<Employee> findAll() {
        employeeRepository.findAll().sort { it.lastName }
    }

    @GraphQLQuery(name = "searchEmployees", description = "Search employees")
    List<Employee> searchEmployees(@GraphQLArgument(name = "filter") String filter) {
        employeeRepository.searchEmployees(filter).sort { it.lastName }
    }

    @GraphQLQuery(name = "employeeById", description = "get employee by id")
    Employee employeeById(@GraphQLArgument(name = "id") UUID id) {
        return id ? employeeRepository.findById(id).get() : null
    }


    @GraphQLQuery(name = "searchEmployeesByRole", description = "Search employees by role")
    List<Employee> searchEmployeesByRole(
            @GraphQLArgument(name = "role") String role,
            @GraphQLArgument(name = "filter") String filter) {
        List<Employee> empList = employeeRepository.searchEmployees(filter).sort { it.lastName }
        List<Employee> finalList = []
        empList.each { it ->

            if (it.user) {
                List<Authority> empRoles = it.user.authorities

                if (role.contains("NON_ATTENDING_PHYSICIAN")) {
                    empRoles.each { er ->
                        if (!role.contains(er["name"] as String) && !finalList.contains(it)) {
                            finalList.add(it as Employee)
                        }
                    }
                } else {
                    empRoles.each { er ->
                        if (role.contains(er["name"] as String) && !finalList.contains(it)) {
                            finalList.add(it as Employee)
                        }
                    }
                }
            }
        }

        return finalList
    }


    @GraphQLQuery(name = "employee", description = "Get Employee By Id")
    Employee findById(@GraphQLArgument(name = "id") UUID id) {

        return id ? employeeRepository.findById(id).get() : null
    }


    @GraphQLQuery(name = "employeeActive", description = "Get Employee By Id")
    List<Employee> findById() {

        return employeeRepository.getActive()
    }

    @GraphQLQuery(name = "employeeNotSurveyTeam", description = "Get Employee By Id")
    List<Employee> employeeNotSurveyTeam(@GraphQLArgument(name = "ids") List<UUID> ids) {
    if(!ids){
        return employeeRepository.findAll()

        println("nisud sa not survey team member")
    }else{
        return employeeRepository.findEmployeesNotSurveyTeamMember(ids)

    }
    }


    @GraphQLQuery(name = "employeeByPositionOffice", description = "Get Employee By Office and Position")
    List<Employee> employeeByPositionOffice(@GraphQLArgument(name = "positionId") UUID positionId,
                                      @GraphQLArgument(name = "officeId") UUID officeId) {

        if(!officeId){
            return employeeRepository.findByPosition(positionId)

        }
        else if(!positionId ){
            return employeeRepository.findByOffice(officeId)

        }else if(officeId && positionId){
            return employeeRepository.findByPositionOffice(officeId, positionId)

        }else if (!officeId && !positionId){
            return employeeRepository.findAll()
        }
    }

    //============================================================ All Mutations ============================================================

    @GraphQLMutation
    @Transactional
    GraphQLRetVal<Employee> upsertEmployee(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "authorities") Set<String> authorities,
            @GraphQLArgument(name = "permissions") Set<String> permissions,
            @GraphQLArgument(name = "officeId") UUID officeId,
            @GraphQLArgument(name = "position") UUID position,
            @GraphQLArgument(name = "isSurveyTeam") Boolean isSurveyTeam

    ) {
        if (id) {
            Employee employee = employeeRepository.findById(id).get()
            objectMapper.updateValue(employee, fields)
            User user = new User()

            //====save full address as string=========
            Employee obj = objectMapper.convertValue(fields, Employee.class)
            def province = provinceRepository.findById(UUID.fromString(obj.stateProvince)).get()
            def city = cityRepository.findById(UUID.fromString(obj.cityMunicipality)).get()
            def barangay = barangayRepository.findById(UUID.fromString(obj.barangay)).get()
            employee.fullAddress = employee.street + ", " + barangay.barangayName + ", " + city.cityName + ", " + province.provinceName

            if (!employee.user) {
                if (fields.get("login") && fields.get("password")) {

                    //check for conflict usernames
                    String newLogin = fields.get("login")
                    def res = userRepository.findOneByLogin(newLogin)
                    if (res) {
                        return new GraphQLRetVal<Employee>(null, false, "Username already exists!")
                    }


                    user.login = fields["login"].toString().toLowerCase()
                    user.password = passwordEncoder?.encode(fields["password"] as String)
                    user.firstName = fields["firstName"]
                    user.lastName = fields["lastName"]
                    user.email = fields["login"].toString().toLowerCase() + "@hismkii.com"
                    user.activated = true
                    user.langKey = "en"
                    user = userRepository.save(user)
                }

                if (user.id) {
                    employee.user = user
                }
            }

            if (employee.user && employee.user.id) {
                // make sure that user is created above and monitored by hibernate


                employee.user.authorities.clear()
                if (authorities) {
                    authorities.each { auth ->
                        def a = authorityRepository.findOneByName(auth)
                        if (a)
                            employee.user.authorities.add(a)
                    }

                }

                employee.user.permissions.clear()
                if (permissions) {
                    permissions.each { p ->
                        def pm = permissionRepository.findAll().find { it.name == p }

                        if (pm)
                            employee.user.permissions.add(pm)
                    }
                }
                userRepository.save(employee.user)

            }

            employee.office = officeRepository.findById(officeId).get()
            employee.position = positionRepository.findById(position).get()
            employee.dob = employee.dob.plusDays(1)
            employee = employeeRepository.save(employee)
            return new GraphQLRetVal<Employee>(employee, true, "Changes Saved")

        } else {
            Employee employee = objectMapper.convertValue(fields, Employee)

            //====save full address as string=========
            def province = provinceRepository.findById(UUID.fromString(employee.stateProvince)).get()
            def city = cityRepository.findById(UUID.fromString(employee.cityMunicipality)).get()
            def barangay = barangayRepository.findById(UUID.fromString(employee.barangay)).get()
            employee.fullAddress = employee.street + ", " + barangay.barangayName + ", " + city.cityName + ", " + province.provinceName

            employee.isActive = true
            employee.office = officeRepository.findById(officeId).get()
            employee.position = positionRepository.findById(position).get()
            employee.dob = employee.dob.plusDays(1)

            employee.employeeNo = "EMP" + generatorService.getNextValue(GeneratorType.EMPLOYEE_NO) { Long no ->
                StringUtils.leftPad(no.toString(), 6, "0")
            }
            employee = employeeRepository.save(employee)

            if(isSurveyTeam){
                surveyTeamMemberService.upsertSurveyTeamMember(employee.id, true)
            }
            return new GraphQLRetVal<Employee>(employee, true, "Changes Saved")
        }
    }

    @GraphQLMutation(name = "employeeUpdateStatus")
    @Transactional
    Employee employeeUpdateStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        Employee employee = employeeRepository.findById(id).get()
        employee.isActive = status
        employeeRepository.save(employee)
    }
}
