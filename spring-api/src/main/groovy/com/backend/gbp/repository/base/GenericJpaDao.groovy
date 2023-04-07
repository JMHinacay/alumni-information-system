package com.backend.gbp.repository.base

import com.backend.gbp.dao.base.AbstractJpaDao
import com.backend.gbp.dao.base.IGenericDao
import org.springframework.beans.factory.config.BeanDefinition
import org.springframework.context.annotation.Scope
import org.springframework.stereotype.Repository

@Repository
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
class GenericJpaDao<T extends Serializable>
		extends AbstractJpaDao<T> implements IGenericDao<T> {

}
