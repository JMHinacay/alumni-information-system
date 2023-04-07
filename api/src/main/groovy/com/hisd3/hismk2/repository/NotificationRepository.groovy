package com.hisd3.hismk2.repository

import com.hisd3.hismk2.domain.Notification
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.query.Param

interface NotificationRepository extends JpaRepository<Notification, UUID> {
	
	// Please dont use
	//@Query("select n from Notification n where n.to = :to")
	//List<Notification> findByTo(@Param("to") UUID to);
	
	List<Notification> findTop10ByToOrderByDatenotifiedDesc(@Param("to") UUID to)
}
