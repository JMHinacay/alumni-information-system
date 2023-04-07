package com.hisd3.hismk2.dao.census

import com.hisd3.hismk2.domain.Department
import com.hisd3.hismk2.domain.billing.PriceTierDetail
import com.hisd3.hismk2.domain.pms.Case
import com.hisd3.hismk2.domain.pms.Transfer
import com.hisd3.hismk2.graphqlservices.base.AbstractDaoService
import com.hisd3.hismk2.repository.DepartmentRepository
import com.hisd3.hismk2.repository.pms.CaseRepository
import com.hisd3.hismk2.repository.pms.TransferRepository
import com.hisd3.hismk2.rest.dto.DepartmentCensusDto
import groovy.transform.TypeChecked
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.AutoConfigureOrder
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

import javax.transaction.Transactional
import java.sql.Timestamp
import java.time.Instant

@TypeChecked
@Service
@Transactional
class CaseDao extends AbstractDaoService<Case> {
	CaseDao() {
		super(Case.class)
	}
	@Autowired
	CaseRepository caseRepository

	@Autowired
	TransferRepository transferRepository

	@Autowired
	DepartmentRepository departmentRepository

	@Autowired
	JdbcTemplate jdbcTemplate

	List<Case> getAllCase() {
		
		return caseRepository.getAllPatientCase()
	}
	
	List<Case> getAllCasesToday() {
		
		return caseRepository.getAllCaseByDate(Instant.now())
	}
	
	List<Case> getAllCasesByRegistryType(String allcasesbyregistrytype, String from, String to) {
		return caseRepository.getAllCasesByRegistryType(allcasesbyregistrytype)
	}
	
	List<Case> getAllCaseByEntryDatetime(String registryType, String from, String to) {
		
		Timestamp sFromStamp = Timestamp.valueOf(from)
		Timestamp sToStamp = Timestamp.valueOf(to)
		
		Instant sFrom = sFromStamp.toInstant()
		Instant sTo = sToStamp.toInstant()
		
		return caseRepository.getAllCaseByEntryDatetime(registryType, sFrom, sTo)
	}
	
	List<Case> getAllAccommodationType(String accommodation) {
		return caseRepository.getAllAccommodationType(accommodation)
	}
	
	List<Case> getAllInPatients() {
		return caseRepository.getAllInPatients()
	}

	List<DepartmentCensusDto> getCensus(String filter, Integer year) {

		List<Department> departmentList = departmentRepository.getPatientsDepartments()
		//List<Transfer> transferList = transferRepository.getTransfersByFilter(filter, year)
//		List<DepartmentCensusDto> transList = jdbcTemplate.queryForList('''select
//															t.registry_type,
//															c.entry_datetime,
//															t.department,
//															d.department_name,
//															p.last_name,
//															p.first_name,
//															p.middle_name
//														from
//															pms.transfers t
//															inner join pms.cases c on t."case" = c.id
//															inner join pms.patients p on c.patient = p.id
//															inner join departments d on t.department = d.id
//														where
//															c.entry_datetime between '2020-01-01 00:00:00.00'
//															and '2021-01-01 00:00:00.00' ''') as List<DepartmentCensusDto>
//
//		List<DepartmentCensusDto> list = []
//
//		departmentList.each {
//			department ->
//
//				def newList = transList.findAll {
//					if(it['department'] == department.id.toString()){
//
//					}
//				}
//
//				//list.add(new DepartmentCensusDto(department, newList))
//		}

		return []
	}
	
}
