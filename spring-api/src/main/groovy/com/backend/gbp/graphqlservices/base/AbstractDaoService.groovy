package com.backend.gbp.graphqlservices.base

import com.backend.gbp.dao.base.IGenericDao
import com.backend.gbp.services.EntityObjectMapperService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page

import javax.persistence.Query
import javax.persistence.TypedQuery

interface Callback<T> {
	
	T call(T entity, boolean forInsert)
	
}

abstract class AbstractDaoService<T extends Serializable> implements IGenericDao<T> {
	
	private IGenericDao<T> dao
	private Class<T> ct
	
	@Autowired
	EntityObjectMapperService entityObjectMapperService
	
	AbstractDaoService(Class<T> classType) {
		ct = classType
	}
	
	@Override
	void setClazz(Class<T> clazzToSet) {
		dao.setClazz(clazzToSet)
	}
	
	@Autowired
	void setDao(IGenericDao<T> daoToSet) {
		dao = daoToSet
		setClazz(ct)
	}
	
	@Override
	T findOne(UUID id) {
		dao.findOne(id)
	}
	
	@Override
	List<T> findAll() {
		dao.findAll()
	}
	
	@Override
	T save(T entity) {
		dao.save(entity)
	}
	
	@Override
	void delete(T entity) {
		
		dao.delete(entity)
	}
	
	@Override
	void deleteById(UUID entityId) {
		dao.deleteById(entityId)
	}
	
	@Override
	Query createGenericQuery(String jpql) {
		dao.createGenericQuery(jpql)
	}
	
	@Override
	TypedQuery<T> createQuery(String jpql, Class<T> aClass) {
		dao.createQuery(jpql, aClass)
	}
	
	@Override
	TypedQuery<T> createQuery(String jpql) {
		dao.createQuery(jpql)
	}
	
	@Override
	TypedQuery<Long> createCountQuery(String jpql) {
		dao.createCountQuery(jpql)
	}
	
	@Override
	TypedQuery<T> createQuery(String jpql, Map<String, Object> params) {
		try{
			dao.createQuery(jpql, params)
		}catch(Exception e){
			e.printStackTrace()
		}

	}
	
	@Override
	Long getCount(String jpql, Map<String, Object> params) {
		dao.getCount(jpql, params)
	}
	
	//code ni wilson
	@Override
	BigDecimal getSum(String jpql, Map<String, Object> params) {
		dao.getSum(jpql, params)
	}
	
	@Override
	Page<T> getPageable(String queryStr, String countQueryStr, int page, int size, Map<String, Object> params) {
		dao.getPageable(queryStr, countQueryStr, page, size, params)
	}

	
	def <X> X updateFromMap(X entity, Map<String, Object> fields) {
		entityObjectMapperService.updateFromMap(entity, fields)
	}
	
	T upsertFromMap(UUID id, Map<String, Object> fields) {
		if (id) {
			T entity = findOne(id)
			updateFromMap(entity, fields)
			save(entity)
		} else {
			T entity = ct.newInstance()
			updateFromMap(entity, fields)
			save(entity)
			
		}
	}
	
	T upsertFromMap(UUID id, Map<String, Object> fields, Callback<T> callback) {
		
		if (id) {
			T entity = findOne(id)
			
			updateFromMap(entity, fields)
			if (callback)
				callback(entity, false)
			
			save(entity)
		} else {
			
			T entity = ct.newInstance()
			updateFromMap(entity, fields)
			if (callback)
				callback(entity, true)
			
			save(entity)
			
		}
	}
}
