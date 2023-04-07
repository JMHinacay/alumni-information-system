package com.hisd3.hismk2.services.eclaims.stash

import com.fasterxml.jackson.databind.ObjectMapper
import com.hisd3.hismk2.domain.eclaims.EclaimsIntegrationSetting
import com.hisd3.hismk2.repository.eclaims.EClaimsIntegration
import com.hisd3.hismk2.repository.eclaims.EcProviderRepository
import com.hisd3.hismk2.services.eclaims.generalservices.EcIntegrationAccountService
import com.squareup.okhttp.*
import groovy.json.JsonSlurper
import groovy.transform.TypeChecked
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.http.NameValuePair
import org.apache.http.message.BasicNameValuePair
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service

@Service("StashEclaimsIntegration")
@TypeChecked
@Component
@GraphQLApi
class StashEclaimsIntegration implements EClaimsIntegration{


    String eclaimProvider = "Stash"


    @Autowired
    ObjectMapper objectMapper

    @Autowired
    EcIntegrationAccountService ecIntegrationAccountService

    @Autowired
    EcProviderRepository ecProviderRepository

    @Override
     integrationAuth(Map<String, Object> fields, UUID id) {
        EclaimsIntegrationSetting provSetting = ecProviderRepository.findByProvider(eclaimProvider)


        String  json =  new JSONObject(fields);


        OkHttpClient client = new OkHttpClient()

        MediaType mediaType = MediaType.parse("application/json;charset=UTF-8")
        RequestBody body = RequestBody.create(mediaType, json ?: "")
        def request = new com.squareup.okhttp.Request.Builder()
                .url(provSetting.host + "/api/v1/account/auth")
                .method("POST", body)
                .addHeader("Content-Type", "application/json;charset=UTF-8")
                .build()
        Response response = client.newCall(request).execute()

        Object respObj = new JsonSlurper().parseText(response.body().string())

        return respObj["data"]["token"]
    }

    @Override
     searchCaseRates(Map<String, Object> fields) {
        EclaimsIntegrationSetting provSetting = ecProviderRepository.findByProvider(eclaimProvider)
        def cr = objectMapper.convertValue(fields, CaseRateDto)

        OkHttpClient client = new OkHttpClient()
        HttpUrl.Builder httpBuilder = HttpUrl.parse(provSetting.host + "/api/client/philhealth/caserate/").newBuilder()
        httpBuilder.addQueryParameter("icd", cr.icd)
        httpBuilder.addQueryParameter("rvs", cr.rvs)
        httpBuilder.addQueryParameter("description", cr.description)

        def request = new com.squareup.okhttp.Request.Builder()
                .url(httpBuilder.build())
                .method("GET", null)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Authorization", "Bearer " + fields.token.toString())
                .build()
        Response response = client.newCall(request).execute()

        Object respObj = new JsonSlurper().parseText(response.body().string())

        return respObj
    }

     @Override
     searchPatientPin(Map<String, Object> fields) {
         EclaimsIntegrationSetting provSetting = ecProviderRepository.findByProvider(eclaimProvider)
        def pdet = objectMapper.convertValue(fields, IntegPatientDetailDto)

        def form = new ArrayList<NameValuePair>(2)
        form.add(new BasicNameValuePair("birthDate", pdet.birthDate))
        form.add(new BasicNameValuePair("firstName", pdet.firstName))
        form.add(new BasicNameValuePair("lastName", pdet.lastName))
        form.add(new BasicNameValuePair("middleName", pdet.middleName))
        form.add(new BasicNameValuePair("suffix", pdet.suffix))
        form.add(new BasicNameValuePair("pin", pdet.pin))
        form.add(new BasicNameValuePair("type", pdet.type))

        MediaType mediaType = MediaType.parse("application/x-www-form-urlencoded")
        String requestBody = contentBuilder(form) ?: ""
        RequestBody body = RequestBody.create(mediaType, requestBody)

        OkHttpClient client = new OkHttpClient()
        HttpUrl.Builder httpBuilder = HttpUrl.parse(provSetting.host + "/api/client/philhealth/member/pin").newBuilder()
        def request = new com.squareup.okhttp.Request.Builder()
                .url(httpBuilder.build())
                .method("POST", body)
                .addHeader("Content-Type", "application/json;charset=UTF-8")
                .addHeader("Authorization", "Bearer " + fields.token.toString())
                .build()

        Response response = client.newCall(request).execute()

        Object respObj = new JsonSlurper().parseText(response.body().string())

        return respObj

    }

    @Override
     checkDrAccreditationValidation(Map<String, Object> fields) {
        EclaimsIntegrationSetting provSetting = ecProviderRepository.findByProvider(eclaimProvider)

        def dav = objectMapper.convertValue(fields, DoctorAccreValidation)
        def form = new ArrayList<NameValuePair>(2)
        form.add(new BasicNameValuePair("doctorAccreCode", dav.doctorAccreCode))
        form.add(new BasicNameValuePair("admissionDate", dav.admissionDate))
        form.add(new BasicNameValuePair("dischargeDate", dav.dischargeDate))
        form.add(new BasicNameValuePair("showResult", dav.showResult))

        MediaType mediaType = MediaType.parse("application/x-www-form-urlencoded")
        String requestBody = contentBuilder(form) ?: ""
        RequestBody body = RequestBody.create(mediaType, requestBody)

        OkHttpClient client = new OkHttpClient()
        HttpUrl.Builder httpBuilder = HttpUrl.parse(provSetting.host + "/api/client/philhealth/doctor/accredited").newBuilder()
        def request = new com.squareup.okhttp.Request.Builder()
                .url(httpBuilder.build())
                .method("POST", body)
                .addHeader("Content-Type", "multipart/form-data")
                .addHeader("Authorization", "Bearer " + fields.token.toString())
                .build()

        Response response = client.newCall(request).execute()

        Object respObj = new JsonSlurper().parseText(response.body().string())

        return respObj
    }

    @Override
    Object createNewClaim(Map<String, Object> fields) {
        EclaimsIntegrationSetting provSetting = ecProviderRepository.findByProvider(eclaimProvider)

        String  json =  new JSONObject(fields);

        OkHttpClient client = new OkHttpClient()

        MediaType mediaType = MediaType.parse("application/json;charset=UTF-8")
        RequestBody body = RequestBody.create(mediaType, json ?: "")
        def request = new com.squareup.okhttp.Request.Builder()
                .url(provSetting.host + "/api/client/philhealth/claims/")
                .method("POST", body)
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", "Bearer " + fields.token.toString())
                .build()
        Response response = client.newCall(request).execute()

        Object respObj = new JsonSlurper().parseText(response.body().string())

        return respObj
    }

    @Override
    Object updateClaim(Map<String, Object> fields) {

        EclaimsIntegrationSetting provSetting = ecProviderRepository.findByProvider(eclaimProvider)

        String  json =  new JSONObject(fields);

        OkHttpClient client = new OkHttpClient()

        MediaType mediaType = MediaType.parse("application/json;charset=UTF-8")
        RequestBody body = RequestBody.create(mediaType, json ?: "")
        def request = new com.squareup.okhttp.Request.Builder()
                .url(provSetting.host + "/api/client/philhealth/claims/")
                .method("POST", body)
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", "Bearer " + fields.token.toString())
                .build()
        Response response = client.newCall(request).execute()

        Object respObj = new JsonSlurper().parseText(response.body().string())

        return respObj
    }

    @Override
    Object generateCf4(Map<String, Object> fields) {

        EclaimsIntegrationSetting provSetting = ecProviderRepository.findByProvider(eclaimProvider)

        String  json =  new JSONObject(fields);

        OkHttpClient client = new OkHttpClient()

        MediaType mediaType = MediaType.parse("application/json;charset=UTF-8")
        RequestBody body = RequestBody.create(mediaType, json ?: "")
        def request = new com.squareup.okhttp.Request.Builder()
                .url(provSetting.host + "/api/client/philhealth/claims/cf4")
                .method("POST", body)
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", "Bearer " + fields.token.toString())
                .build()
        Response response = client.newCall(request).execute()

        Object respObj = new JsonSlurper().parseText(response.body().string())

        return respObj

    }

    @Override
    Object createEligibility(Map<String, Object> fields) {

        EclaimsIntegrationSetting provSetting = ecProviderRepository.findByProvider(eclaimProvider)

        def dav = objectMapper.convertValue(fields, DoctorAccreValidation)
        def pdet = objectMapper.convertValue(fields, IntegPatientDetailDto)
        def mdet = objectMapper.convertValue(fields, IntegPhilhMemnerDetailDto)
        def el = objectMapper.convertValue(fields, IntegEligibilityDto)

        def form = new ArrayList<NameValuePair>(2)
        form.add(new BasicNameValuePair("totalAmountActual", el.totalAmountActual))
        form.add(new BasicNameValuePair("totalAmountClaimed",el.totalAmountClaimed))
        form.add(new BasicNameValuePair("member.firstName", mdet.mem_firstName))
        form.add(new BasicNameValuePair("member.lastName",mdet.mem_lastName))
        form.add(new BasicNameValuePair("member.middleName", mdet.mem_middleName))
        form.add(new BasicNameValuePair("member.suffix",mdet.mem_suffix))
        form.add(new BasicNameValuePair("member.type",mdet.mem_type))
        form.add(new BasicNameValuePair("member.pin", mdet.mem_pin))
        form.add(new BasicNameValuePair("patient.lastName", pdet.lastName))
        form.add(new BasicNameValuePair("patient.firstName", pdet.firstName))
        form.add(new BasicNameValuePair("patient.birthDate", pdet.birthDate))
        form.add(new BasicNameValuePair("patient.suffix",pdet.suffix))
        form.add(new BasicNameValuePair("patient.middleName",pdet.middleName))
        form.add(new BasicNameValuePair("patient.gender",pdet.gender))
        form.add(new BasicNameValuePair("patientIs",el.patientIs))
        form.add(new BasicNameValuePair("accreditation.admissionDate",dav.admissionDate))
        form.add(new BasicNameValuePair("accreditation.dischargeDate",dav.dischargeDate))
        form.add(new BasicNameValuePair("isFinal",el.isFinal ))
        form.add(new BasicNameValuePair("isDisabled",el.isDisabled))
        form.add(new BasicNameValuePair("member.birthDate", pdet.birthDate))

        MediaType mediaType = MediaType.parse("application/x-www-form-urlencoded")
        String requestBody = contentBuilder(form) ?: ""
        RequestBody body = RequestBody.create(mediaType, requestBody)

        OkHttpClient client = new OkHttpClient()
        HttpUrl.Builder httpBuilder = HttpUrl.parse(provSetting.host + "/api/client/philhealth/claims/eligibility").newBuilder()
        def request = new com.squareup.okhttp.Request.Builder()
                .url(httpBuilder.build())
                .method("POST", body)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Authorization", "Bearer " + fields.token.toString())
                .build()

        Response response = client.newCall(request).execute()

        Object respObj = new JsonSlurper().parseText(response.body().string())

        return respObj
    }

    @Override
    Object getEligibility(Map<String, Object> fields) {
        EclaimsIntegrationSetting provSetting = ecProviderRepository.findByProvider(eclaimProvider)

        OkHttpClient client = new OkHttpClient()
        HttpUrl.Builder httpBuilder = HttpUrl.parse(provSetting.host + "/api/client/philhealth/eligibility/" + fields.id.toString()).newBuilder()

        def request = new com.squareup.okhttp.Request.Builder()
                .url(httpBuilder.build())
                .method("GET", null)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Authorization", "Bearer " + fields.token.toString())
                .build()
        Response response = client.newCall(request).execute()

        Object respObj = new JsonSlurper().parseText(response.body().string())

        return respObj
    }

    String contentBuilder(ArrayList<NameValuePair> params) {

        EclaimsIntegrationSetting provSetting = ecProviderRepository.findByProvider(eclaimProvider)

        String contentBuilder = ""

        params.eachWithIndex { NameValuePair entry, int i ->
            if (i == params.size() - 1) {
                contentBuilder += entry.name + "=" + entry.value
            } else {
                contentBuilder += entry.name + "=" + entry.value + "&"
            }
        }

        return contentBuilder
    }






}
