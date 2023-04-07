package com.backend.gbp.repository


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.SurveySched
import com.backend.gbp.domain.SurveyTeam
import com.backend.gbp.domain.SurveyTeamMember
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface SurveyTeamRepository extends JpaRepository<SurveyTeam, UUID> {
    @Query(
            value = '''Select a from SurveyTeam a where a.surveyTeamMember.id = :id'''
    )
    List<SurveyTeam> findBySurveyTeamMember (@Param("id") UUID id)

}
