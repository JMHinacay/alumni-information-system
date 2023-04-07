package com.backend.gbp.rest

import com.backend.gbp.domain.lot.LotTransaction
import com.backend.gbp.repository.lot.LotTransactionRepository

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import java.time.Instant

@RestController
@RequestMapping("/lotTransaction")
class LotTransactionResource {


    @Autowired
    LotTransactionRepository lotTransactionRepository

    @RequestMapping(value = "/getLotTransactionByFilter", produces = ["application/json"])
    LotTransaction getLotTransactionByFilter(
            @RequestParam UUID id

    ) {
//        if (!id || !startDate || !endDate) {
//            throw new RuntimeException("Failed to get accumulated logs.")
//        }

//        List<EmployeeAccumulatedAttendanceDto> accumulatedLogs = payrollTimeKeepingCalculatorService.getAccumulatedLogs(id, startDate, endDate)
        def lotTransaction = lotTransactionRepository.findById(id).get()
        print(lotTransaction)
        return lotTransaction

    }

}


