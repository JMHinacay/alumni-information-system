package com.backend.gbp.config

import com.backend.gbp.repository.eventhandlers.EventHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.rest.core.config.RepositoryRestConfiguration
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer

@Configuration
class SpringDataRestConfig implements RepositoryRestConfigurer {
	
	@Override
	void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		config.exposeIdsFor(
		)
	}
	
	@Bean
	EventHandler eventHandler() {
		return new EventHandler()
	}
}
