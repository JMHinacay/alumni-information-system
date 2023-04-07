package com.backend.gbp.services.scheduler

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Configuration
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.scheduling.annotation.Async
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service

import javax.transaction.Transactional

@Configuration
@Service
@Slf4j
@EnableAsync
@EnableScheduling
class SchedulerNotificationTransaction {


	@Autowired
	JdbcTemplate jdbcTemplate

	@Scheduled(cron = "0 0 0,12 * * ?")
	@Transactional
	@Async
	def autoRemoveOldNotifications() {

		log.info("Scheduler removing all old notifications. ")
		String query = """ delete from notifications where date_notified < (NOW() - INTERVAL '2 DAYS')"""
		jdbcTemplate.execute(query)
	}
}
