package com.backend.gbp.repository


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.SurveySched
import com.backend.gbp.domain.SurveyTeamMember
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface SurveySchedRepository extends JpaRepository<SurveySched, UUID> {

    @Query(
            value = '''Select a from SurveySched a where a.lotTransaction.id = :lotTransactionId'''
    )
    List<SurveySched> findByLotTransactionId (@Param("lotTransactionId") UUID lotTransactionId)

//    @Query(
//            value = '''Select a from SurveySched a where a. = :lotTransactionId'''
//    )
//    List<SurveySched> findConflict (@Param("lotTransactionId") UUID lotTransactionId)

//    @Query(
//            value = '''Select a from SurveySched a where a.lotTransaction.id = :lotTransactionId'''
//    )
//    List<SurveySched> findBySurveyTeamMember (@Param("id") UUID lotTransactionId)

}
