package com.backend.gbp.repository.lot


import com.backend.gbp.domain.Service
import com.backend.gbp.domain.lot.LotTransaction
import org.springframework.data.domain.Page
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

import java.awt.print.Pageable
import java.time.Instant

interface LotTransactionRepository extends JpaRepository<LotTransaction, UUID> {

//	@Query(
//			value = '''Select s from Service s where (lower(s.service_name) like lower(concat('%',:filter,'%')))'''
//	)
//	List<Service> serviceFilter(@Param("filter") String filter)
//	ReturnType <ReturnValue> functionName(parameters)

    @Query(
            value = '''Select a from LotTransaction a
            where a.lotInfo.id in :lotInfoIds
            and a.status = :status
            and a.service = :service
            and a.lotInfo.barangay = :barangay
            and a.createdDate >= :startDate
            and a.createdDate < :endDate
            '''
    )
    List<LotTransaction> findByFilterStatusServiceBarangayDate(
            @Param("lotInfoIds") List<UUID> lotInfoIds,
            @Param("status") String status,
            @Param("service") UUID service,
            @Param("barangay") UUID barangay,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate

    )

    @Query(
            value = '''Select a from LotTransaction a
            where a.id = :id
            '''
    )
   LotTransaction findByLotTransactionId(
            @Param("id") UUID id

    )


    @Query(
            value = '''Select a.lotInfo.id from LotTransaction a where (lower(a.lotInfo.id) like lower(concat('%',:filter,'%'))) or 
            (lower(a.transactionId) like lower(concat('%',:filter,'%'))) '''
    )
    List<UUID> getLotInfoIdsByFilter(@Param("filter") String filter)

    @Query(
            value = '''Select a.lotInfo.id from LotTransaction a where (lower(a.transactionId) like lower(concat('%',:filter,'%')))  '''
    )
    List<UUID> getLotInfoIdsFilterByTransactionId(@Param("filter") String filter)

    @Query(
            value = '''Select a from LotTransaction a where a.transactionId =  :transactionId'''
    )
    LotTransaction getByTransactionId(@Param("transactionId") String transactionId)

//    @Query(
//            value = '''Select a from LotTransaction a
//            where a.lotInfo.id in :lotInfoIds
//            and a.status = :status
//            and a.service = :service
//            and a.lotInfo.barangay = :barangay
//            and a.createdDate >= :startDate
//            and a.createdDate < :endDate
//            ''',
//            countQuery = '''Select count(a) from LotTransaction a
//            where a.lotInfo.id in :lotInfoIds
//            and a.status = :status
//            and a.service = :service
//            and a.lotInfo.barangay = :barangay
//            and a.createdDate >= :startDate
//            and a.createdDate < :endDate
//            '''
//    )
//    Page<LotTransaction> findByFilterStatusServiceBarangayDate(
//            @Param("lotInfoIds") List<UUID> lotInfoIds,
//            @Param("status") String status,
//            @Param("service") UUID service,
//            @Param("barangay") UUID barangay,
//            @Param("startDate") Instant startDate,
//            @Param("endDate") Instant endDate,
//            Pageable pageable
//    )
//
//
//
//
//
//
//
//
//
//
//
//
//    @Query(
//            value = '''Select a from LotTransaction a
//            where a.lotInfo.id in :lotInfoIds
//            and a.status = :status
//            and a.service = :service
//            and a.lotInfo.city = :city
//            and a.createdDate >= :startDate
//            and a.createdDate < :endDate
//            '''
//    )
//    List<LotTransaction> findByFilterStatusServiceCityDate(
//            @Param("lotInfoIds") List<UUID> lotInfoIds,
//            @Param("status") String status,
//            @Param("service") UUID service,
//            @Param("city") UUID city,
//            @Param("startDate") Instant startDate,
//            @Param("endDate") Instant endDate
//    )
//
//    @Query(
//            value = '''Select a from LotTransaction a
//            where a.lotInfo.id in :lotInfoIds
//            and a.status = :status
//            and a.service = :service
//            and a.lotInfo.province = :province
//            and a.createdDate >= :startDate
//            and a.createdDate < :endDate
//            '''
//    )
//    List<LotTransaction> findByFilterStatusServiceProvinceDate(
//            @Param("lotInfoIds") List<UUID> lotInfoIds,
//            @Param("status") String status,
//            @Param("service") UUID service,
//            @Param("province") UUID province,
//            @Param("startDate") Instant startDate,
//            @Param("endDate") Instant endDate
//    )
//
//    @Query(
//            value = '''Select a from LotTransaction a
//            where a.lotInfo.id in :lotInfoIds
//            and a.status = :status
//            and a.service = :service
//            and a.createdDate >= :startDate
//            and a.createdDate < :endDate
//            '''
//    )
//    List<LotTransaction> findByFilterStatusServiceDate(
//            @Param("lotInfoIds") List<UUID> lotInfoIds,
//            @Param("status") String status,
//            @Param("service") UUID service,
//            @Param("startDate") Instant startDate,
//            @Param("endDate") Instant endDate
//    )
//
//    @Query(
//            value = '''Select a from LotTransaction a
//            where a.lotInfo.id in :lotInfoIds
//            and a.status = :status
//            and a.lotInfo.barangay = :barangay
//            and a.service = :service
//            and a.createdDate >= :startDate
//            and a.createdDate < :endDate
//            '''
//    )
//    List<LotTransaction> findByFilterStatusBarangayDate(
//            @Param("lotInfoIds") List<UUID> lotInfoIds,
//            @Param("status") String status,
//            @Param("barangay") UUID barangay,
//            @Param("startDate") Instant startDate,
//            @Param("endDate") Instant endDate
//    )
//
//    @Query(
//            value = '''Select a from LotTransaction a
//            where a.lotInfo.id in :lotInfoIds
//            and a.status = :status
//            and a.lotInfo.city = :city
//            and a.createdDate >= :startDate
//            and a.createdDate < :endDate
//            '''
//    )
//    List<LotTransaction> findByFilterStatusCityDate(
//            @Param("lotInfoIds") List<UUID> lotInfoIds,
//            @Param("status") String status,
//            @Param("city") UUID city,
//            @Param("startDate") Instant startDate,
//            @Param("endDate") Instant endDate
//    )
//
//    @Query(
//            value = '''Select a from LotTransaction a
//            where a.lotInfo.id in :lotInfoIds
//            and a.status = :status
//            and a.lotInfo.province = :province
//            and a.createdDate >= :startDate
//            and a.createdDate < :endDate
//            '''
//    )
//    List<LotTransaction> findByFilterStatusProvinceDate(
//            @Param("lotInfoIds") List<UUID> lotInfoIds,
//            @Param("status") String status,
//            @Param("province") UUID province,
//            @Param("startDate") Instant startDate,
//            @Param("endDate") Instant endDate
//    )
//
//    @Query(
//            value = '''Select a from LotTransaction a
//            where a.lotInfo.id in :lotInfoIds
//            and a.status = :status
//            and a.createdDate >= :startDate
//            and a.createdDate < :endDate
//            '''
//    )
//    List<LotTransaction> findByFilterStatusDate(
//            @Param("lotInfoIds")List<UUID> lotInfoIds,
//            @Param("status") String status,
//            @Param("startDate") Instant startDate,
//            @Param("endDate") Instant endDate
//    )
//
//    @Query(
//            value = '''Select a from LotTransaction a
//            where a.lotInfo.id in :lotInfoIds
//            and a.status = :status
//            and a.createdDate >= :startDate
//            and a.createdDate < :endDate
//            '''
//    )
//    List<LotTransaction> findByFilterServiceBarangayDate(
//            @Param("lotInfoIds")List<UUID> lotInfoIds,
//            @Param("status") String status,
//            @Param("startDate") Instant startDate,
//            @Param("endDate") Instant endDate
//    )

}

//select * from lot_transaction lt where lt.status ='COMPLETE'
//and lt.created_date  >= '2022-03-07 13:15:34.068'
//and  lt.created_date < '2022-03-10 13:15:34.068'
//and a.lo

