package com.backend.gbp.repository


import com.backend.gbp.domain.Position
import com.backend.gbp.domain.UploadedFiles
import com.backend.gbp.domain.address.Barangay
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface UploadedFilesRepository extends JpaRepository<UploadedFiles, UUID> {

    @Query(value = """Select a from UploadedFiles a where  a.lotTransaction.id = :lotTransactionId and a.docType in :docTypes""")
    List<UploadedFiles> findByDocTypes(@Param("lotTransactionId") UUID lotTransactionId, @Param("docTypes") List docTypes)


}
