package com.backend.gbp.rest.dto

import com.backend.gbp.domain.UserActivity
import groovy.transform.Canonical
import org.springframework.data.domain.Page

@Canonical
class UserActivityTabDto {
	Page<UserActivity> userActivities

	String activityType
}


