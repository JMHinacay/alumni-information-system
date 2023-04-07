package com.backend.gbp.repository

import com.backend.gbp.domain.Agent
import com.backend.gbp.domain.SurveyTeamMember
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface SurveyTeamMemberRepository extends JpaRepository<SurveyTeamMember, UUID> {

    @Query(
            value = '''Select a from SurveyTeamMember a where (lower(a.employee.fullName) like lower(concat('%',:filter,'%')))'''
    )
    List<SurveyTeamMember> surveyTeamMembersByFilter (@Param("filter") String filter)

    @Query(
            value = '''Select a from SurveyTeamMember a where (lower(a.employee.fullName) like lower(concat('%',:filter,'%')))
					 and a.isActive = :status'''
    )
    List<SurveyTeamMember> surveyTeamMembersByFilterStatus(@Param("filter") String filter, @Param("status") Boolean status)

}
