package com.backend.gbp.rest

import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.services.NotificationService
import com.backend.gbp.socket.SocketService
import com.backend.gbp.utils.SOAPConnector
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import redis.clients.jedis.Jedis

import javax.persistence.EntityManager

@RestController
class UserResource {

    @Autowired
    SocketService socketService

    @Autowired
    NotificationService notificationService

    @Autowired
    SOAPConnector soapConnector

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    EntityManager entityManager


    @Autowired
    JdbcTemplate jdbcTemplate

    @Value('${redis.host}')
    String host

    @Value('${redis.port}')
    Integer port = 6379


    @Autowired
    SimpMessagingTemplate simpMessagingTemplate

    void updateLastActivity(String username)
    {
        Jedis jedis = new Jedis(host,port);
        jedis.set(username, System.currentTimeMillis().toString());

    }

    @RequestMapping("/checkExpiry")
    String checkExpiry() {
        try{
            Jedis jedis = new Jedis(host,port);
            Long expiryDurationMinutes = getExpiryLimitMinutes()
            Long expiryDurationMilliseconds = expiryDurationMinutes*60000
            Long lastActivity = jedis.get(com.backend.gbp.security.SecurityUtils.currentLogin()) as Long;
            Long millisElapsed = System.currentTimeMillis()-lastActivity
            Long millisRemaining = expiryDurationMilliseconds - millisElapsed
            // println "REMAINING MINUTES : "+ millisRemaining/60000
            if(millisRemaining<0){
                SecurityContextHolder.clearContext()
                simpMessagingTemplate.convertAndSendToUser(com.backend.gbp.security.SecurityUtils.currentLogin(), "/channel/lastActivity", "LOGOUT")
                return "NOT LOGGED IN"
            }
            if(millisRemaining<61000)
            {
                simpMessagingTemplate.convertAndSendToUser(com.backend.gbp.security.SecurityUtils.currentLogin(), "/channel/lastActivity", "WARN")
                return "WARN"
            }
            return "REMAINING MINUTES : "+ millisRemaining/60000
        }
        catch (Exception e)
        {
            e.printStackTrace()
            // println "NOT LOGGED IN"
            return "NOT LOGGED IN"
            // e.printStackTrace()
        }

    }

    @RequestMapping("/refreshExpiry")
    String refreshExpiry() {
        return "OK"
    }

    Long getExpiryLimitMinutes() {
        Jedis jedis = new Jedis(host,port);

        Long loginExpiryLimitMinutes = jedis.get("loginExpiryLimit") as Long;
        if(loginExpiryLimitMinutes==null || loginExpiryLimitMinutes.intValue()==0)
        {

            try{
                String query = """select login_inactive_duration from hospital_configuration.login_configuration where id = '8b9125ea-0895-467d-80c8-b88221cc1895'"""
                Long dbLoginExpiryLimitMinutes = jdbcTemplate.queryForObject(query,Long) as Long
                jedis.set("loginExpiryLimit", dbLoginExpiryLimitMinutes.toString());
            }
            catch (Exception e)
            {
                e.printStackTrace()
            }
        }
        else
            return loginExpiryLimitMinutes
    }
}
