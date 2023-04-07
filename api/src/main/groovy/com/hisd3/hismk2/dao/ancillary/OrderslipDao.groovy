package com.hisd3.hismk2.dao.ancillary

import com.fasterxml.jackson.databind.ObjectMapper
import com.hisd3.hismk2.domain.ancillary.OrderSlipItem
import com.hisd3.hismk2.domain.ancillary.Orderslip
import com.hisd3.hismk2.repository.DepartmentRepository
import com.hisd3.hismk2.repository.ancillary.OrderSlipItemRepository
import com.hisd3.hismk2.repository.ancillary.OrderSlipViewNewRepositiry
import com.hisd3.hismk2.repository.ancillary.OrderslipRepository
import com.hisd3.hismk2.services.GeneratorService
import com.hisd3.hismk2.services.GeneratorType
import com.hisd3.hismk2.services.NotificationService
import com.hisd3.hismk2.socket.Message
import com.hisd3.hismk2.socket.SocketService
import groovy.transform.TypeChecked
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@TypeChecked
@Service
@Transactional
class OrderslipDao {

    @Autowired
    private OrderslipRepository orderslipRepository

    @Autowired
    private ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    OrderSlipItemRepository orderSlipItemRepository

    @Autowired
    NotificationService notificationService

    @Autowired
    DepartmentRepository departmentRepository
    @Autowired
    SocketService socketService
    @PersistenceContext
    EntityManager entityManager

    @Autowired
    OrderSlipViewNewRepositiry orderSlipViewNewRepositiry

    List<Orderslip> addOrderslip(List<Orderslip> orderslips) {

        List<Orderslip> res = []
        orderslips.each {
            it ->
                it.orderSlipNo = generatorService?.getNextValue(GeneratorType.OrderSlip_NO, { i ->
                    StringUtils.leftPad(i.toString(), 6, "0")
                })
                it.status = "NEW"
                it.deleted = false
                res.add(orderslipRepository.save(it))

        }
        return res
    }

    List<OrderSlipItem> insertOrderTransaction(Orderslip orderSlip, List<OrderSlipItem> orderItems) {

        List<OrderSlipItem> res = []
        Orderslip ret

        if (orderSlip.id == null) {
            orderSlip.status = "NEW"
            orderSlip.deleted = false
            orderSlip.orderSlipNo = generatorService?.getNextValue(GeneratorType.OrderSlip_NO, { i -> StringUtils.leftPad(i.toString(), 6, "0") })
            ret = orderslipRepository.save(orderSlip)
        } else {
            ret = orderSlip
        }

        orderItems.each {
            it ->
                it.orderslip = ret
                it.itemNo = generatorService?.getNextValue(GeneratorType.OrderSlipItem_NO, { i -> StringUtils.leftPad(i.toString(), 6, "0") })
                orderSlipItemRepository.save(it).tap {
                    ot ->
                        res.add(ot)
                }

                def department = departmentRepository.findById(it.service.department.id).get()
                println(department)
                //notify
                try {
                    notificationService.notifyUsersOfDepartment(department.parentDepartment.id, "New Service Request", "(" + it.service.category + ") " + it.service.serviceName, "")
                    Message payload = new Message()
                    payload.from = department.parentDepartment.id
                    payload.topic = "New Order Slip"
                    payload.message = "Please Reload Data"
                    socketService.updatesToDepartment(payload)
                }
                catch (Exception e) {
                    println(e)
                }

        }

        return res
    }

//	Orderslip save(Orderslip oSlip) {
//		orderslipRepository.save(oSlip)
//	}

    /*List<Orderslip> orderslipsByPatientType2(String department, String ptype, String filter, String status, String start, String end) {

        Pageable pageable =  PageRequest.of(0, 10, Sort.Direction.DESC, 'createdDate')

        Timestamp startTimeS = Timestamp.valueOf(start)
        Timestamp endTimeS = Timestamp.valueOf(end)

        Instant startDate = startTimeS.toInstant()
        Instant endDate = endTimeS.toInstant()

        return orderslipRepository.orderslipsByPatientType(department,ptype, filter, status, startDate, endDate,pageable).content

    }
*/

    /*List<Orderslip> orderslipsByPatientType(String department, String ptype, String filter, String status, String start, String end) {

        //Pageable pageable =  PageRequest.of(page, pageSize, Sort.Direction.DESC, 'createdDate')

        Timestamp startTimeS = Timestamp.valueOf(start)
        Timestamp endTimeS = Timestamp.valueOf(end)

        Instant startDate = startTimeS.toInstant()
        Instant endDate = endTimeS.toInstant()

        Set<Orderslip> uniqOrderSlip = []
        def results
        if (department == "") {
             results = orderSlipItemRepository.orderslipsByPatientType(ptype, filter, status, startDate, endDate).sort {
                 it.createdDate
             }
            results.reverse(true)


            for (def item : results) {
                uniqOrderSlip.add(item.orderslip)
            }
        } else {

             results = orderSlipItemRepository.orderslipsByPatientTypeWithDep(UUID.fromString(department), ptype, filter, status, startDate, endDate).sort {
                 it.createdDate
             }
            results.reverse(true)
            for (def item : results) {
                uniqOrderSlip.add(item.orderslip)
            }
        }

        return uniqOrderSlip as List<Orderslip>

    }*/

    List<OrderSlipItem> orderSlipsByDepartment(String caseId, String departmentId) {

        Set<Orderslip> uniqOrderSlip = []
        def results =orderSlipItemRepository.orderslipsByDepartmentV2(caseId,departmentId).sort{it.createdDate}
        results.reverse(true)

//        results = orderSlipItemRepository.orderslipsByDepartmentV2(caseId,department).sort { it.createdDate
//        }
//        results.reverse(true)

//        if (department == "") {
//             results = orderSlipItemRepository.findByCase(UUID.fromString(caseId)).sort {
//                it.createdDate
//            }
//            results.reverse(true)
////            for (def item : results) {
////                uniqOrderSlip.add(item.orderslip)
////            }
//        } else {
//
//             results = orderSlipItemRepository.orderslipsByDepartment(UUID.fromString(caseId), UUID.fromString(department)).sort {
//                it.createdDate
//            }
//            results.reverse(true)
////            for (def item : results) {
////                uniqOrderSlip.add(item.orderslip)
////            }
//        }

        return results
    }

    List<Orderslip> orderSlipsByDepartment_old(String caseId, String department) {

        Set<Orderslip> uniqOrderSlip = []
//        def results
        if (department == "") {
             def results = orderSlipItemRepository.findByCase(UUID.fromString(caseId)).sort {
                it.createdDate
            }
            results.reverse(true)
            for (def item : results) {
                uniqOrderSlip.add(item.orderslip)
            }
        } else {

            def results = orderSlipItemRepository.orderslipsByDepartment(UUID.fromString(caseId), UUID.fromString(department)).sort {
                it.createdDate
            }
            results.reverse(true)
            for (def item : results) {
                uniqOrderSlip.add(item.orderslip)
            }
        }

        return uniqOrderSlip as List<Orderslip>
    }
}
