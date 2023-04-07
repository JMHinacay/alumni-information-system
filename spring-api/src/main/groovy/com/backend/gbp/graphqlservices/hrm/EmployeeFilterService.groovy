package com.backend.gbp.graphqlservices.hrm


import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component


@Component
@GraphQLApi
@TypeChecked
class EmployeeFilterService extends AbstractDaoService<Employee> {

    EmployeeFilterService() {
        super(Employee.class)
    }

    @Autowired
    ObjectMapper objectMapper


    @GraphQLQuery(name = "employeeByFilter")
    List<Employee> employeeByFilter(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "position") UUID position
    ) {

        String query = '''Select e from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (status != null) {
            query += ''' and (e.isActive = :status)'''
            params.put("status", status)
        }

        if (office) {
            query += ''' and (e.office.id = :office)'''
            params.put("office", office)
        }
        if (position) {
            query += ''' and (e.position.id = :position)'''
            params.put("position", position)
        }

        createQuery(query, params).resultList.sort { it.lastName }
    }

    @GraphQLQuery(name = "employeeByFilterPagable")
    Page<Employee> employeeByFilterPagable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "position") UUID position,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''Select e from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%'))'''
        String countQuery = '''Select e from Employee e where lower(e.fullName) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (status != null) {
            query += ''' and (e.isActive = :status)'''
            countQuery += ''' and (e.isActive = :status)'''
            params.put("status", status)
        }

        if (office) {
            query += ''' and (e.office.id = :office)'''
            countQuery += ''' and (e.isActive = :status)'''
            params.put("office", office)
        }
        if (position) {
            query += ''' and (e.position.id = :position)'''
            countQuery += ''' and (e.isActive = :status)'''
            params.put("position", position)
        }

        getPageable(query,countQuery, page, size,  params)
    }

}
