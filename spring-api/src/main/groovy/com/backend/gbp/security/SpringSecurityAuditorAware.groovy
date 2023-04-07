package com.backend.gbp.security

import org.springframework.data.domain.AuditorAware
import org.springframework.stereotype.Component

@Component
class SpringSecurityAuditorAware implements AuditorAware<String> {
	@Override
	Optional<String> getCurrentAuditor() {
		return new Optional<String>(SecurityUtils.currentLogin())
	}
}
