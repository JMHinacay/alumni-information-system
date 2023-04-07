package com.hisd3.hismk2.repository.referential

import com.hisd3.hismk2.domain.referential.DohPosition
import com.hisd3.hismk2.domain.referential.DohPositionOthers
import groovy.transform.TypeChecked
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

@TypeChecked
interface DohPositionOthersRepository extends JpaRepository<DohPositionOthers, UUID> {


	@Query(value = "SELECT c FROM DohPositionOthers c WHERE c.postdesc = :postDesc")
	List<DohPositionOthers> getDOHPositionByPostDesc(@Param("postDesc") String postDesc)

	@Query(value = "SELECT c FROM DohPositionOthers c WHERE c.status = true")
	List<DohPositionOthers> getActivePositions()
}
