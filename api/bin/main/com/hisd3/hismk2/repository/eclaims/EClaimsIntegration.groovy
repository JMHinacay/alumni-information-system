package com.hisd3.hismk2.repository.eclaims

interface EClaimsIntegration {

    def integrationAuth(Map<String, Object> fields, UUID id)

    def searchCaseRates(Map<String, Object> fields)

    def searchPatientPin(Map<String, Object> fields)

    def checkDrAccreditationValidation(Map<String, Object> fields)

    Object createNewClaim(Map<String, Object> fields)

    Object updateClaim(Map<String, Object> fields)

    Object generateCf4(Map<String, Object> fields)

    Object createEligibility(Map<String, Object> fields)

    Object getEligibility(Map<String, Object> fields)
}