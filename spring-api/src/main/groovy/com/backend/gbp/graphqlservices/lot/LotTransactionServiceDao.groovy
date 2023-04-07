//package com.backend.gbp.graphqlservices.lot
//
//
//import com.backend.gbp.domain.lot.Claimant
//import com.backend.gbp.domain.lot.LotAreaInfo
//import com.backend.gbp.domain.lot.LotInfo
//import com.backend.gbp.domain.lot.LotTransaction
//import com.backend.gbp.graphqlservices.base.AbstractDaoService
//import com.backend.gbp.repository.PositionRepository
//import com.backend.gbp.repository.lot.ClaimantRepository
//import com.backend.gbp.repository.lot.LotAreaInfoRepository
//import com.backend.gbp.repository.lot.LotInfoRepository
//import com.backend.gbp.repository.lot.LotTransactionRepository
//import com.backend.gbp.services.GeneratorService
//import com.fasterxml.jackson.databind.ObjectMapper
//import groovy.transform.TypeChecked
//import io.leangen.graphql.annotations.GraphQLArgument
//import io.leangen.graphql.annotations.GraphQLMutation
//import io.leangen.graphql.annotations.GraphQLQuery
//import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
//import org.springframework.beans.factory.annotation.Autowired
//import org.springframework.data.domain.Page
//import org.springframework.stereotype.Component
//
//import javax.transaction.Transactional
//import java.time.Instant
//
//@TypeChecked
//@Component
//@GraphQLApi
//class LotTransactionServiceDao extends AbstractDaoService<LotTransaction>{
//
//    LotTransactionServiceDao() {
//        super(LotTransaction.class)
//    }
//    @Autowired
//    PositionRepository positionRepository
//
//    @Autowired
//    LotInfoRepository lotInfoRepository
//
//    @Autowired
//    LotAreaInfoRepository lotAreaInfoRepository
//
//    @Autowired
//    LotTransactionRepository lotTransactionRepository
//
//    @Autowired
//    ClaimantRepository claimantRepository
//
//    @Autowired
//    GeneratorService generatorService
//
//    @Autowired
//    ObjectMapper objectMapper
//
//
//
//
////============== All Queries ====================
//
//    @GraphQLQuery(name = "lotTransaction", description = "Get All Lot Transaction")
//    List<LotTransaction> findAll() {
//        lotTransactionRepository.findAll().sort { it.createdDate }
//    }
//
//    @GraphQLQuery(name = "lotTransactionByFilter", description = "Get All Lot Transaction")
//    Page<LotTransaction> lotTransactionByFilter(
//            @GraphQLArgument(name = "filter") String filter,
//            @GraphQLArgument(name = "status") String status,
//            @GraphQLArgument(name = "province") UUID province,
//            @GraphQLArgument(name = "city") UUID city,
//            @GraphQLArgument(name = "barangay") UUID barangay,
//            @GraphQLArgument(name = "service") UUID service,
//            @GraphQLArgument(name = "startDate") Instant startDate,
//            @GraphQLArgument(name = "endDate") Instant endDate,
//            @GraphQLArgument(name = "page") Integer page,
//            @GraphQLArgument(name = "size") Integer size
//    ) {
//        List<UUID> lotInfoIds = lotAreaInfoRepository.getLotInfoIdsByFilter(filter)
//
////        if(startDate && endDate)
////        {
////            if(filter && status && service)
////            {
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            return lotTransactionRepository.findByFilterStatusServiceBarangayDate(
////                                    lotInfoIds,
////                                    status,
////                                    service,
////                                    barangay,
////                                    startDate,
////                                    endDate,
////                                    new PageRequest(page, size, Sort.Direction.ASC, "createdDate"))
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByFilterStatusServiceCityDate(
////                                    lotInfoIds,
////                                    status,
////                                    service,
////                                    city,
////                                    startDate,
////                                    endDate)
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByFilterStatusServiceProvinceDate(
////                                lotInfoIds,
////                                status,
////                                service,
////                                province,
////                                startDate,
////                                endDate)
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByFilterStatusServiceDate(
////                            lotInfoIds,
////                            status,
////                            service,
////                            startDate,
////                            endDate)
////                }
////            }
////            else if(filter && status && !service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByFilterStatusBarangayDate(
////                                    lotInfoIds,
////                                    status,
////                                    barangay,
////                                    startDate,
////                                    endDate
////                            )
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByFilterStatusCityDate(
////                                    lotInfoIds,
////                                    status,
////                                    city,
////                                    startDate,
////                                    endDate
////                            )
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByFilterStatusProvinceDate(
////                                lotInfoIds,
////                                status,
////                                province,
////                                startDate,
////                                endDate
////                        )
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByFilterStatusDate(
////                            lotInfoIds,
////                            status,
////                            startDate,
////                            endDate
////                    )
////                }
////            }
////            else if(filter && !status && service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByFilterServiceBarangayDate
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByFilterServiceCityDate
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByFilterServiceProvinceDate
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByFilterStatusServiceDate
////                }
////            }
////            else if(!filter && status && service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByFilterStatusServiceBarangayDate
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByFilterStatusServiceCityDate
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByFilterStatusServiceProvinceDate
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByFilterStatusServiceDate
////                }
////
////            }
////            else if(filter && !status && !service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByFilterBarangayDate
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByFilterCityDate
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByFilterProvinceDate
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByFilterDate
////                }
////            }
////            else if(!filter && status && !service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByStatusBarangayDate
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByStatusCityDate
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByStatusProvinceDate
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByStatusDate
////                }
////            }
////            else if(!filter && !status && service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByServiceBarangay
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByServiceCity
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByServiceProvince
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByService
////                }
////            }
////            else{
////                lotTransactionRepository.findByDate()
////            }
////        }
////        else{
////            if(filter && status && service)
////            {
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByFilterStatusServiceBarangay
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByFilterStatusServiceCity
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByFilterStatusServiceProvince
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByFilterStatusService
////                }
////            }
////            else if(filter && status && !service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByFilterStatusBarangay
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByFilterStatusCity
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByFilterStatusProvince
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByFilterStatus
////                }
////            }
////            else if(filter && !status && service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByFilterServiceBarangay
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByFilterServiceCity
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByFilterServiceProvince
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByFilterStatusService
////                }
////            }
////            else if(!filter && status && service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByFilterStatusServiceBarangay
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByFilterStatusServiceCity
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByFilterStatusServiceProvince
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByFilterStatusService
////                }
////
////            }
////            else if(filter && !status && !service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByFilterBarangay
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByFilterCity
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByFilterProvince
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByFilter
////                }
////            }
////            else if(!filter && status && !service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByStatusBarangay
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByStatusCity
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByStatusProvince
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByStatus
////                }
////            }
////            else if(!filter && !status && service){
////                if(province)
////                {
////                    if(city)
////                    {
////                        if(barangay)
////                        {
////                            lotTransactionRepository.findByServiceBarangay
////                        }
////                        else
////                        {
////                            lotTransactionRepository.findByServiceCity
////                        }
////                    }
////                    else{
////                        lotTransactionRepository.findByServiceProvince
////                    }
////                }
////                else{
////                    lotTransactionRepository.findByService
////                }
////            }
////            else{
////                lotTransactionRepository.findByDate()
////            }
////        }
//
//        String query = "Select a from LotTransaction a  where a.lotInfo.id in :lotInfoIds"
//        String countQuery = "Select a from LotTransaction a  where a.lotInfo.id in :lotInfoIds"
//        Map<String, Object> params = new HashMap<>()
//        params.put('lotInfoIds', lotInfoIds)
//
//
//        getPageable(query,countQuery, page, size,  params)
//
//    }
//
//
//    @GraphQLQuery(name = "lotTransactionById", description = "Get Position By Id")
//    LotTransaction findById(@GraphQLArgument(name = "id") UUID id) {
//        return id ? lotTransactionRepository.findById(id).get() : null
//    }
//
//    //============== All Mutations ====================
//    @GraphQLMutation(name = "upsertLotTransaction")
//    @Transactional
//    LotTransaction upsertLotTransaction(
//            @GraphQLArgument(name = "id") UUID id,
//            @GraphQLArgument(name = "lotTransaction") Map<String, Object> lotTransactionParam,
//            @GraphQLArgument(name = "lotInfo") Map<String, Object> lotInfoParam,
//            @GraphQLArgument(name = "claimant") ArrayList<Map<String, Object>> claimantParam,
//            @GraphQLArgument(name = "lotArea") ArrayList<Map<String, Object>> lotAreaParam
//    ) {
//        LotTransaction lotTransaction = objectMapper.convertValue(lotTransactionParam, LotTransaction.class)
//        LotInfo lotInfo  = objectMapper.convertValue(lotInfoParam, LotInfo.class)
//        def claimantsTemp = claimantParam as List<Claimant>
//        def lotAreasInfosTemp = lotAreaParam as List<LotAreaInfo>
//        List<Claimant> claimants = new ArrayList<Claimant>()
//        List<LotAreaInfo> lotAreaInfos = new ArrayList<LotAreaInfo>()
//
//        claimantsTemp.each {
//            Claimant claimant = new Claimant()
//            claimant.lotTransaction = lotTransaction
//            claimant.claimantAddress = it.claimantAddress
//            claimant.claimantContactNo = it.claimantContactNo
//            claimant.claimantFullName = it.claimantFullName
//            claimants.add(claimant)
//        }
//        lotAreasInfosTemp.each {
//            LotAreaInfo lotAreaInfo = new LotAreaInfo()
//            lotAreaInfo.lotInfo = lotInfo
//            lotAreaInfo.lotNo = it.lotNo
//            lotAreaInfo.deleted = it.deleted
//            lotAreaInfo.lotAreaSize = it.lotAreaSize
//            lotAreaInfos.add(lotAreaInfo)
//        }
//
//        lotTransaction.lotInfo = lotInfo
//        lotInfoRepository.save(lotInfo)
//        lotAreaInfoRepository.saveAll(lotAreaInfos)
//        claimantRepository.saveAll(claimants)
//        lotTransactionRepository.save(lotTransaction)
//
//        return lotTransaction
//    }
//
//
//}
//
//
//
