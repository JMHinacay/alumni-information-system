package com.backend.gbp.rest

import com.backend.gbp.domain.DenrUpdates
import com.backend.gbp.domain.Service
import com.backend.gbp.domain.UserActivity
import com.backend.gbp.domain.WeeklyUpdates
import com.backend.gbp.domain.lot.Claimant
import com.backend.gbp.domain.lot.LotAreaInfo
import com.backend.gbp.domain.lot.LotInfo
import com.backend.gbp.domain.lot.LotTransaction
import com.backend.gbp.graphqlservices.DenrUpdatesService
import com.backend.gbp.graphqlservices.address.AddressServices
import com.backend.gbp.graphqlservices.lot.LotTransactionService
import com.backend.gbp.repository.DenrUpdatesRepository
import com.backend.gbp.repository.ServiceRepository
import com.backend.gbp.repository.ServiceStepRepository
import com.backend.gbp.repository.UserActivityRepository
import com.backend.gbp.repository.WeeklyUpdatesRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.lot.ClaimantRepository
import com.backend.gbp.repository.lot.LotAreaInfoRepository
import com.backend.gbp.repository.lot.LotInfoRepository
import com.backend.gbp.repository.lot.LotTransactionRepository
import com.backend.gbp.rest.dto.ClaimantDto
import com.backend.gbp.rest.dto.DenrUpdatesDto
import com.backend.gbp.rest.dto.EmployeeDto
import com.backend.gbp.rest.dto.LotAreaInfoDto
import com.backend.gbp.rest.dto.LotInfoDto
import com.backend.gbp.rest.dto.LotTransactionDto
import com.backend.gbp.rest.dto.PositionDto
import com.backend.gbp.rest.dto.ServiceDto
import com.backend.gbp.rest.dto.TrackerDto
import com.backend.gbp.rest.dto.UserActivityDto
import com.backend.gbp.rest.dto.UserDto
import com.backend.gbp.rest.dto.WeeklyUpdatesDto
import com.backend.gbp.services.NotificationService
import com.backend.gbp.socket.SocketService
import com.backend.gbp.utils.SOAPConnector
import com.fasterxml.jackson.databind.ObjectMapper
import com.sun.xml.messaging.saaj.SOAPExceptionImpl
import groovy.transform.Canonical
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.event.EventListener
import org.springframework.http.ResponseEntity
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import org.springframework.web.context.support.RequestHandledEvent
import ph.gov.doh.uhmistrn.ahsr.webservice.index.GetDataTable
import ph.gov.doh.uhmistrn.ahsr.webservice.index.GetDataTableResponse

import javax.persistence.EntityManager
import javax.persistence.NoResultException
import javax.servlet.http.HttpSession

@Canonical
class CitySelect {
    String label
    String value
}

@RestController
class CommonResource {

    @Autowired
    SocketService socketService

    @Autowired
    NotificationService notificationService

    @Autowired
    SOAPConnector soapConnector

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    UserResource userResource

    @Autowired
    EntityManager entityManager

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    AddressServices addressServices

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate

    @Autowired
    LotTransactionService lotTransactionService

    @Autowired
    LotTransactionRepository lotTransactionRepository

    @Autowired
    ClaimantRepository claimantRepository

    @Autowired
    ServiceRepository serviceRepository

    @Autowired
    LotInfoRepository lotInfoRepository

    @Autowired
    LotAreaInfoRepository lotAreaInfoRepository

    @Autowired
    ServiceStepRepository serviceStepRepository

    @Autowired
    UserActivityRepository userActivityRepository

    @Autowired
    WeeklyUpdatesRepository weeklyUpdatesRepository

    @Autowired
    DenrUpdatesService denrUpdatesService

    @Autowired
    DenrUpdatesRepository denrUpdatesRepository
    /*
    ANNOTATION_PAYMENTS_GROUPS
    ANNOTATION_NOTIFICATION_GROUPS
    http://localhost:8080/testbillingannotation?billingId=5ab3ea62-5dcb-489c-842a-e5bbfdcf74a1&billingItemType=ANNOTATION_PAYMENTS_GROUPS&description=PAYMENT_OR11211&amount=10000
     */


    @RequestMapping(value = "/soapTest", produces = "text/xml")
    String soapTest() {
        try {
            GetDataTable request = new GetDataTable()
            request.hfhudcode = "DOH000000000000000"
            request.reportingyear = "2020"
            request.table = "genInfoClassification"
            GetDataTableResponse response =
                    (GetDataTableResponse) soapConnector.callWebService("http://uhmistrn.doh.gov.ph/ahsr/webservice/index.php/getDataTable", request)
            println("Got Response As below ========= : ")
            println("Name : " + response.return)

            return response.return
        } catch (SOAPExceptionImpl e) {
            println(e.message)
        }

    }

    @RequestMapping("/ping")
    String ping() {
        "PONG"
    }

    @RequestMapping("/test")
    String test() {

        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(false)
        println "Last Accessed " + session.getLastAccessedTime()
        println "Current Time " + System.currentTimeMillis();
        session.getLastAccessedTime()
    }

    @RequestMapping("/")
    String index() {
        "WELCOME TO Backend GBP GraphQL Server."
    }

    @RequestMapping("/serverTime")
    String serverTime() {
        System.currentTimeMillis()
    }

    @RequestMapping("/hey")
    String hey() {
        //	HISD3WebsocketMessage message = new HISD3WebsocketMessage()
        //	message.from = "TEST"
        //	message.message = "Pack Yow"
        //	message.type = HISD3MessagewType.TEST_TYPE
        //	socketService.payloadToUser(message, 'admin', '/channel/test')
        notificationService.notifyUser(UUID.fromString("3eec9518-f3b0-41fe-84d2-97a2f30ab83a"), "Sample Title", "Sample Message")
    }

    //THIS FUNCTION IS REQUEST LISTENER, IT DOES LISTEN TO REQUESTS THAT ARE CONSIDERED "USER ACTIVITY" TO MONITOR INACTIVE USERS AND WARN FOR LOGOUT
    @EventListener
    void handleEvent(RequestHandledEvent e) {
        String url = e.getAt("requestUrl").toString()
        Boolean exemptedURL = url.contains("serverTime") || url.contains("favicon") || url.contains("websocket") || url.contains("checkExpiry")

        if (!e.wasFailure() && !exemptedURL) {
            //System.out.println("-- RequestHandledEvent --"+SecurityUtils.currentLogin());
            //System.out.println(e.getAt("requestUrl"));
            // userResource.updateLastActivity(SecurityUtils.currentLogin())
            // println "Valid URL : "+e.getAt("requestUrl")
        }
        //else
        //   if(exemptedURL)
        //        println "Exempted URL : "+ url
    }


    @RequestMapping("/tracker/transaction")
    def getTransaction(@RequestParam("transactionId") String transactionId) {
//        def lotTransaction =  lotTransactionService.getTransactionById(UUID.fromString(id))
        def lotTransaction = lotTransactionRepository.getByTransactionId(transactionId)
        if (!lotTransaction) {
            return null
        }
        lotTransaction.service.id
        println("id => " + transactionId)

        ServiceDto serviceDto = new ServiceDto()
        serviceDto.id = lotTransaction.service.id
        serviceDto.serviceName = lotTransaction.service.serviceName
        serviceDto.serviceCost = lotTransaction.service.serviceCost
        serviceDto.serviceType = lotTransaction.service.serviceType
        serviceDto.allowMultipleLot = lotTransaction.service.allowMultipleLot
        serviceDto.status = lotTransaction.service.status


        //get lotAreaInfos
        List<LotAreaInfoDto> lotAreaInfoDtos = new ArrayList<LotAreaInfoDto>()
        lotTransaction.lotInfo.lotAreaInfos.each {
            LotAreaInfoDto lotAreaInfoDto = new LotAreaInfoDto()
            lotAreaInfoDto.id = it.id
            lotAreaInfoDto.surveyNo = it.surveyNo
            lotAreaInfoDto.lotNo = it.lotNo
            lotAreaInfoDto.lotAreaSize = it.lotAreaSize
            lotAreaInfoDtos.add(lotAreaInfoDto)
        }

        //get lotInfos
        LotInfoDto lotInfoDto = new LotInfoDto()
        lotInfoDto.id = lotTransaction.lotInfo.id
        lotInfoDto.lotType = lotTransaction.lotInfo.lotType
        lotInfoDto.barangay = lotTransaction.lotInfo.barangay
        lotInfoDto.city = lotTransaction.lotInfo.city
        lotInfoDto.province = lotTransaction.lotInfo.province
        lotInfoDto.ownerFirstName = lotTransaction.lotInfo.ownerFirstName
        lotInfoDto.ownerMiddleName = lotTransaction.lotInfo.ownerMiddleName
        lotInfoDto.ownerLastName = lotTransaction.lotInfo.ownerLastName
        lotInfoDto.lotAreaInfos = lotAreaInfoDtos

        //get Claimants
        List<ClaimantDto> claimantsDto = new ArrayList<ClaimantDto>()
        lotTransaction.claimants.each {
            ClaimantDto claimant = new ClaimantDto()
            claimant.id = it.id
            claimant.claimantFullName = it.claimantFullName
            claimant.claimantAddress = it.claimantAddress
            claimant.claimantContactNo = it.claimantContactNo
            claimantsDto.add(claimant)
        }

        List<UserActivity> userActivities = userActivityRepository.findByLotTransactionId(lotTransaction.id)


        def transaction = new LotTransactionDto(
                id: lotTransaction.id,
                service: serviceDto, //service.id
                serviceName: null,
                lotInfo: lotInfoDto,
                claimants: claimantsDto,
                status: lotTransaction.status,
                closedType: lotTransaction.closedType,
                closedBy: lotTransaction.closedBy,
                transactionId: lotTransaction.transactionId,

                lotType: lotTransaction.lotType,
                barangayName: lotTransaction.barangayName,
                cityName: lotTransaction.cityName,
                provinceName: lotTransaction.provinceName,
                ownerFirstName: lotTransaction.ownerFirstName,
                ownerLastName: lotTransaction.ownerLastName,
                ownerMiddleName: lotTransaction.ownerMiddleName
        )
        List<UserActivityDto> userActivityDtos = new ArrayList<UserActivityDto>()
        userActivities.each {
            UserActivityDto userActivity = new UserActivityDto()
            userActivity.id = it.id
            userActivity.activityType = it.activityType
            userActivity.status = it.status
            userActivity.forwardedBy = it.forwardedBy
            userActivity.landStatus = it.landStatus
            def fullName = it.user.employee.fullName
            def positionDescription = it.user.employee.position.description
            UserDto user = new UserDto(
                    employee: new EmployeeDto(
                            fullName: fullName,
                            position: new PositionDto(description: positionDescription)
                    )
            )
            userActivity.user = user
//            userActivity.user = null
            userActivity.isOverride = it.isOverride
            userActivity.isPending = it.isPending
            userActivity.pendingType = it.pendingType
            userActivity.pendingBy = it.pendingBy
            userActivity.remarks = it.remarks
            userActivityDtos.add(userActivity)
        }

        //Weekly Updates
        List<WeeklyUpdates> weeklyUpdates = weeklyUpdatesRepository.findByLotTransactionId(lotTransaction.id).sort { it.createdDate }
        List<WeeklyUpdatesDto> weeklyUpdatesDtos = new ArrayList<WeeklyUpdatesDto>()
        weeklyUpdates.each {
            WeeklyUpdatesDto update = new WeeklyUpdatesDto()
            update.id = it.id
            update.createdDate = it.createdDate
            update.remarks = it.remarks
            weeklyUpdatesDtos.add(update)
        }

        List<DenrUpdates> landStatus = denrUpdatesRepository.findByLotTransactionIdUpdateType(lotTransaction.id, "LAND_STATUS")
        List<DenrUpdatesDto> landStatusDto = new ArrayList<DenrUpdatesDto>()
        landStatus.each {
            DenrUpdatesDto dto = new DenrUpdatesDto()
            dto.id = it.id
            dto.updateType = it.updateType
            dto.currentUnit= it.currentUnit
            dto.currentName = it.currentName
            dto.assignedUnit = it.assignedUnit
            dto.assignedName = it.assignedName
            dto.remarks = it.remarks
            dto.status = it.status
            dto.currentlyHandledBy = it.currentlyHandledBy
            landStatusDto.add(dto)
        }

        List<DenrUpdates> surveyAuthUpdates = denrUpdatesService.denrUpdatesByLotTransactionUpdateType(lotTransaction.id, "SURVEY_AUTHORITY_UPDATE")
        List<DenrUpdatesDto> surveyAuthUpdatesDto = new ArrayList<DenrUpdatesDto>()
        surveyAuthUpdates.each {
            DenrUpdatesDto dto = new DenrUpdatesDto()
            dto.id = it.id
            dto.updateType = it.updateType
            dto.currentUnit= it.currentUnit
            dto.currentName = it.currentName
            dto.assignedUnit = it.assignedUnit
            dto.assignedName = it.assignedName
            dto.remarks = it.remarks
            dto.status = it.status
            dto.currentlyHandledBy = it.currentlyHandledBy
            surveyAuthUpdatesDto.add(dto)
        }

        List<DenrUpdates> denrRegionUpdates = denrUpdatesService.denrUpdatesByLotTransactionUpdateType(lotTransaction.id, "SURVEY_AUTHORITY_UPDATE")
        List<DenrUpdatesDto> denrRegionUpdatesDto = new ArrayList<DenrUpdatesDto>()
        denrRegionUpdates.each {
            DenrUpdatesDto dto = new DenrUpdatesDto()
            dto.id = it.id
            dto.updateType = it.updateType
            dto.currentUnit= it.currentUnit
            dto.currentName = it.currentName
            dto.assignedUnit = it.assignedUnit
            dto.assignedName = it.assignedName
            dto.remarks = it.remarks
            dto.status = it.status
            dto.currentlyHandledBy = it.currentlyHandledBy
            denrRegionUpdatesDto.add(dto)
        }

        def tracker = new TrackerDto(
                lotTransaction: transaction,
                userActivities: userActivityDtos,
                weeklyUpdates: weeklyUpdatesDtos,
                landStatus: landStatusDto,
                denrRegionUpdates: denrRegionUpdatesDto,
                surveyAuthUpdates: surveyAuthUpdatesDto

        )

        return tracker
    }


}
