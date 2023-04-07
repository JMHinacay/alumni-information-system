package com.backend.gbp.graphqlservices

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.Service
import com.backend.gbp.domain.SurveyTeam
import com.backend.gbp.graphqlservices.dto.DenrUpdateStatusPerOfficeDto
import com.backend.gbp.graphqlservices.dto.ServiceCountPerOfficeDto
import com.backend.gbp.graphqlservices.dto.ServiceCountDto
import com.backend.gbp.graphqlservices.dto.TrxnPerActivityDto
import com.backend.gbp.graphqlservices.dto.TrxnPerActivityPerOfficeDto
import com.backend.gbp.repository.JurisdictionRepository
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.SurveyTeamRepository
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.BeanPropertyRowMapper
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component

import java.sql.Timestamp
import java.time.Instant

@TypeChecked
@Component
@GraphQLApi
class ReportsService {

    @Autowired
    SurveyTeamRepository surveyTeamRepository

    @Autowired
    private JdbcTemplate jdbcTemplate

    @Autowired
    JurisdictionRepository jurisdictionRepository

    @Autowired
    OfficeRepository officeRepository

    @Autowired
    ServiceService serviceService

    @Autowired
    GeneratorService generatorService

    @Autowired
    ObjectMapper objectMapper


    //============== All Queries ====================
    @GraphQLQuery(name = "countTransactionsPerServiceOld", description = "Count transactions per service, by offices")
    List<Map<String, Object>> countTransactionsPerServiceOld(@GraphQLArgument(name = "startDate") Instant startDate,
                                                             @GraphQLArgument(name = "endDate") Instant endDate) {
        List<Office> offices = officeRepository.findAll()

        List<Service> service = serviceService.findAll()
        String query = """"""
        service.each {

//            query += """ ,count(*) filter(where  trans.service = '${it.id}') as svc${it.id.toString().replaceAll("-", "_")}"""
            query += """ ,('{"service_name": "${it.serviceName}", "count": "' || count(*) filter(where  trans.service = '${it.id}')|| '" }')::JSONB 
as svc${it.id.toString().replaceAll("-", "_")}
"""
        }

        List<Map<String, Object>> result = jdbcTemplate.queryForList("""
                    select
                    office.office_description  as office_description
                    ${query}
                     from  public.office office
                                left join public.jurisdiction jurisd on jurisd.office = office.id
                                left join lot.lot_info lotInfo on lotInfo.barangay = jurisd.barangay
                                left join lot.lot_transaction trans on trans.lot_info = lotInfo.id 
                                            and trans.created_date BETWEEN '${Timestamp.from(startDate)}' AND '${Timestamp.from(endDate)}'
                         --       left join public.user_activity activity on activity.lot_transaction = trans.id
                                 
                                

                                group by ( office.office_description)
                                 
                                order by office.office_description asc
                    ;
                     """)

        return result
    }


    @GraphQLQuery(name = "userActivitiesByDenrUpdateStatus", description = "Count user activities by denr update status, by offices")
    List<Map<String, Object>> userActivitiesByDenrUpdateStatus(@GraphQLArgument(name = "startDate") Instant startDate,
                                                               @GraphQLArgument(name = "endDate") Instant endDate) {

        List<Map<String, Object>> result = jdbcTemplate.queryForList("""
                                  select office.office_description as office_description,
 
                                count(*) filter(where  activity.pending_type = 'For Resurvey') as for_resurvey,
                                count(*) filter(where  activity.pending_type = 'Invalid Sketch Plan') as invalid_sketch_plan,
                                count(*) filter(where  activity.pending_type = 'Invalid BL Plan') as invalid_bl_plan,
                                count(*) filter(where  activity.pending_type = 'Unreachable Client') as unreachable_client,

                                count(*) filter(where  activity.denr_update_status = 'Pending (To be withdrawn)') as pending_to_be_withdrawn,
                                count(*) filter(where  activity.denr_update_status = 'Pending (Withdrawn)') as pending_withdrawn,
                                count(*) filter(where  activity.denr_update_status = 'Resubmitted') as resubmitted,
                                count(*) filter(where  activity.denr_update_status = 'DAR Covered') as dar_covered
                                
                                
                                 from  public.office office
                                left join public.jurisdiction jurisd on jurisd.office = office.id
                                left join lot.lot_info lotInfo on lotInfo.barangay = jurisd.barangay
                                left join lot.lot_transaction trans on trans.lot_info = lotInfo.id 
                                            and trans.created_date BETWEEN '${Timestamp.from(startDate)}' AND '${Timestamp.from(endDate)}'
                                left join public.user_activity activity on activity.lot_transaction = trans.id
                                and activity.status in ('FOR_APPROVAL', 'PENDING', 'FOR_TRANSMISSION', 'FINAL_STEP')


                                group by ( office.office_description)
                                 
                                order by office.office_description asc;
                                """
//                , new BeanPropertyRowMapper(DenrUpdateStatusPerOfficeDto.class)
                                   )

//                officeList.push(result)

//        }
        return result
    }


    @GraphQLQuery(name = "countTransactionsByActivity", description = "Count user activities by denr update status, by offices")
    List<Map<String, Object>> countTransactionsByActivity(@GraphQLArgument(name = "startDate") Instant startDate,
                                                          @GraphQLArgument(name = "endDate") Instant endDate) {
        List<String> activities = [
                'APPROVE_LOT_TRANSACTION',
                'MANAGE_PENDING_LOT_TRANSACTION',
                'RELEASE_SKETCH_PLAN',
                'RELEASE_APPROVED_PLAN',
                'VERIFY_SKETCH_PLAN',
                'VERIFY_BL_PLAN',
                'VERIFY_SIGNED_APPROVED_PLAN',
                'TRANSMIT_SKETCH_PLAN',
                'TRANSMIT_DENR_SKETCH_PLAN',
                'TRANSMIT_BL_PLAN',
                'TRANSMIT_LDC_AND_CAD_MAP',
                'APPROVE_SKETCH_PLAN',
                'APPROVE_DENR_PLAN',
                'APPROVE_BL_PLAN',
                'SIGN_APPROVED_PLAN',
                'SURVEY_AUTHORITY_UPDATES',
                'SURVEY_AUTHORITY_REQUIREMENTS',
                'DENR_REGION_UPDATES',
        ]
        String query = """"""
        activities.each {
            if(it == 'MANAGE_PENDING_LOT_TRANSACTION'){
                query += """  , ('{"finished": "' 
                                || 
                                count(*) filter(where  activity.is_pending is true and 
                                activity.status in ('APPROVED', 'TRANSMITTED', 'FORWARDED', 'REROUTED'))
                                
                                || 
                                '", "ongoing": "' 
                                || 
                                count(*) filter(where  activity.is_pending is true and 
                                activity.status = 'PENDING')
                                || '" }')::JSONB as ${it}"""

            }else{
                query += """  ,('{"finished": "' 
                                || 
                                count(*) filter(where  activity.activity_type = '${it}' and 
                                activity.status in ('APPROVED', 'TRANSMITTED', 'FORWARDED', 'REROUTED'))
                                
                                || 
                                '", "ongoing": "' 
                                || 
                                count(*) filter(where  activity.activity_type = '${it}' and 
                                activity.status in ('FOR_APPROVAL', 'FOR_APPROVAL' , 'FOR_TRANSMISSION', 'PENDING', 'FINAL_STEP'))
                                || '" }')::JSONB as ${it} """
            }



        }
        List<Map<String, Object>> result = jdbcTemplate.queryForList("""
                                 select 
                                office.office_description as office_description

                                ${query}

                                from  public.office office
                                left join public.jurisdiction jurisd on jurisd.office = office.id
                                left join lot.lot_info lotInfo on lotInfo.barangay = jurisd.barangay
                                left join lot.lot_transaction trans on trans.lot_info = lotInfo.id 
                                            and trans.created_date BETWEEN '${Timestamp.from(startDate)}' AND '${Timestamp.from(endDate)}'
                                left join public.user_activity activity on activity.lot_transaction = trans.id
                                 
                                

                                group by ( office.office_description)
                                 
                                order by office.office_description asc
--                                 from public.user_activity activity
--                                 left join lot.lot_transaction trans on trans.id = activity.lot_transaction
--                                 left join lot.lot_info lotInfo on lotInfo.id = trans.lot_info
--                                 left join public.jurisdiction jurisd on jurisd.barangay = lotInfo.barangay
--                                 left join public.office office on office.id = jurisd.office
--                                  group by ( office.office_description)
                                ;
                                """)

//                officeList.push(result)

//        }
        return result
    }

    @GraphQLQuery(name = "billingReports", description = "Get billing reports")
    List<Map<String, Object>> billingReports(@GraphQLArgument(name = "startDate") Instant startDate,
                                                             @GraphQLArgument(name = "endDate") Instant endDate) {



        List<Map<String, Object>> result = jdbcTemplate.queryForList("""
                    Select 
office.office_description as office_description,
-- b.*
-- COALESCE(sum(b.debit * b.item_qty) filter(where b.item_type = 'SERVICE') ,0) as total_service_cost,
COALESCE(sum(b.debit * b.item_qty) ,0) as total_service_cost,
COALESCE(sum(b.credit * b.item_qty) filter(where b.item_type = 'DEDUCTION') ,0) as total_deductions,
COALESCE(sum(b.credit * b.item_qty) filter(where b.item_type = 'PAYMENT') ,0) as total_payments,
COALESCE(sum((COALESCE(b.debit,0)  -   COALESCE(b.credit,0)) * b.item_qty),0) as total_balance


from public.office office
left join public.jurisdiction jurisd on jurisd.office = office.id
left join lot.lot_info lotInfo on lotInfo.barangay = jurisd.barangay
left join lot.lot_transaction trans on trans.lot_info = lotInfo.id 
                                and trans.created_date BETWEEN '${Timestamp.from(startDate)}' AND '${Timestamp.from(endDate)}'
left join billing.billing billing on billing.lot_transaction = trans.id
left join billing.billing_item b 
on b.status='ACTIVE' and b.billing = billing.id

group by ( office.office_description

)
                                 
order by office.office_description asc
;
                    ;
                     """)

        return result
    }


}
