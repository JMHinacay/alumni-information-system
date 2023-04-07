package com.backend.gbp.repository


import com.backend.gbp.domain.Position
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PositionRepository extends JpaRepository<Position, UUID> {

	@Query(
			value = '''Select p from Position p where (lower(p.code) like lower(concat('%',:filter,'%')) or 
						lower(p.description) like lower(concat('%',:filter,'%')))'''
	)
	List<Position> positionFilter(@Param("filter") String filter)

	@Query(
			value = '''Select p from Position p where (lower(p.code) like lower(concat('%',:filter,'%')) or 
						lower(p.description) like lower(concat('%',:filter,'%'))) and p.status = :status'''
	)
	List<Position> positionFilterStatus(@Param("filter") String filter, @Param("status") Boolean status)

	@Query(
			value = '''Select p from Position p where p.status = true'''
	)
	List<Position> activePositions()
}
