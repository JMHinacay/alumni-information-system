package com.hisd3.hismk2.graphqlservices.eclaims

import com.hisd3.hismk2.domain.eclaims.EclaimsCaseRef
import com.hisd3.hismk2.domain.eclaims.EclaimsIntegrationAccount
import com.hisd3.hismk2.domain.eclaims.EclaimsIntegrationSetting
import com.hisd3.hismk2.repository.eclaims.EClaimsIntegration
import com.hisd3.hismk2.repository.eclaims.EcAccountRepository
import com.hisd3.hismk2.repository.eclaims.EcCaseRefRepository
import com.hisd3.hismk2.repository.eclaims.EcProviderRepository
import com.hisd3.hismk2.services.eclaims.generalservices.EcCaseReferenceService
import com.hisd3.hismk2.services.eclaims.generalservices.EcIntegrationAccountService
import com.hisd3.hismk2.services.eclaims.generalservices.EcIntegrationSettingService
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service

@Service
@GraphQLApi
class EcService {
    @Autowired
    @Qualifier("StashEclaimsIntegration")
    EClaimsIntegration eClaimsIntegration

    @Autowired
    EcProviderRepository ecProviderRepository

    @Autowired
    EcIntegrationAccountService ecIntegrationAccountService

    @Autowired
    EcAccountRepository ecAccountRepository

    @Autowired
    EcIntegrationSettingService ecIntegrationSettingService

    @Autowired
    EcCaseReferenceService ecCaseReferenceService

    @Autowired
    EcCaseRefRepository ecCaseRefRepository


    @GraphQLMutation(name = 'integrationAuth', description = "Stash Auth")
    integrationAuth(@GraphQLArgument(name = "fields") Map<String, Object> fields,
                    @GraphQLArgument(name = "id") UUID id
    ) {
        eClaimsIntegration.integrationAuth(fields, id)
    }


    @GraphQLQuery(name = 'searchCaseRates', description = "Search Case Rates")
    searchCaseRates(@GraphQLArgument(name = "fields") Map<String, Object> fields){
        eClaimsIntegration.searchCaseRates(fields)
    }

    @GraphQLQuery(name = 'searchPatientPin', description = "Search Patient Pin")
     searchPatientPin(@GraphQLArgument(name = "fields") Map<String, Object> fields){
        eClaimsIntegration.searchPatientPin(fields)
    }

    @GraphQLQuery(name = 'checkDrAccredValidation', description = "Check Doctor Accreditation Validation")
    checkDrAccreditationValidation(@GraphQLArgument(name = "fields") Map<String, Object> fields){
        eClaimsIntegration.checkDrAccreditationValidation(fields)
    }

    @GraphQLMutation(name = 'createNewClaim', description = "Create New Claim")
    Object createNewClaim(@GraphQLArgument(name = "fields") Map<String, Object> fields){
        eClaimsIntegration.createNewClaim(fields)
    }

    @GraphQLMutation(name = 'updateClaim', description = "Create New Claim")
    Object updateClaim(@GraphQLArgument(name = "fields") Map<String, Object> fields){
        eClaimsIntegration.updateClaim(fields)
    }

    @GraphQLMutation(name = 'generateCf4', description = "Generate CF4")
    Object generateCf4(@GraphQLArgument(name = "fields") Map<String, Object> fields){
        eClaimsIntegration.generateCf4(fields)
    }

    @GraphQLMutation(name = 'createEligibility', description = "Create Eligibility")
    Object createEligibility(@GraphQLArgument(name = "fields") Map<String, Object> fields){
        eClaimsIntegration.createEligibility(fields)
    }

    @GraphQLMutation(name = 'upsertEclaimSetting')
    EclaimsIntegrationSetting upsertEclaimSetting(@GraphQLArgument(name = "fields") Map<String, Object> fields,
                                                  @GraphQLArgument(name = "id") UUID id
    ){
        ecIntegrationSettingService.UpsertEclaimSettings(fields, id)
    }

    @GraphQLMutation(name = 'upsertEclaimAccount')
    EclaimsIntegrationAccount upsertEclaimAccount(@GraphQLArgument(name = "fields") Map<String, Object> fields,
                                                  @GraphQLArgument(name = "id") UUID id
    ){
        ecIntegrationAccountService.UpsertEclaimAccount(fields, id)
    }

    @GraphQLQuery(name = 'getEclaimProvider')
    getEclaimProvider(@GraphQLArgument(name = "provider") String provider){
        ecProviderRepository.findByProvider(provider)
    }

    @GraphQLQuery(name = 'getEclaimAccount')
    EclaimsIntegrationAccount getEclaimAccount(@GraphQLArgument(name = "id") UUID id){
        ecAccountRepository.findByEmployee(id)
    }

    @GraphQLMutation(name = 'upsertEclaimCaseRef')
    EclaimsCaseRef upsertEclaimCaseRef(@GraphQLArgument(name = "fields") Map<String, Object> fields,
                                       @GraphQLArgument(name = "id") UUID id
    ){
        ecCaseReferenceService.UpsertEclaimCaseReference(fields, id)
    }

    @GraphQLQuery(name = 'getEclaimCaseRef')
    EclaimsCaseRef getEclaimCaseRef(@GraphQLArgument(name = "caseId") UUID caseId){
        ecCaseRefRepository.findByCase(caseId)
    }




}
