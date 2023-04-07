package com.backend.gbp.config

import com.backend.gbp.filters.GZipServletFilter
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@ConditionalOnProperty(
        value="graphql.compressed",
        havingValue = "true",
        matchIfMissing = true)
class Webconfig {

    @Bean
     FilterRegistrationBean<GZipServletFilter> loggingFilter(){
        FilterRegistrationBean<GZipServletFilter> registrationBean = new FilterRegistrationBean<>()

        registrationBean.setFilter(new GZipServletFilter())
        registrationBean.addUrlPatterns("/graphql/*")
        return registrationBean
    }

}
