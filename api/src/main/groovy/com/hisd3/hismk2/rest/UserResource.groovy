package com.hisd3.hismk2.rest

import com.hisd3.hismk2.domain.User
import com.hisd3.hismk2.graphqlservices.billing.BillingItemServices
import com.hisd3.hismk2.repository.UserRepository
import com.hisd3.hismk2.repository.hrm.EmployeeRepository
import com.hisd3.hismk2.security.SecurityUtils
import com.hisd3.hismk2.services.DepartmentCategoryService
import com.hisd3.hismk2.services.NotificationService
import com.hisd3.hismk2.socket.SocketService
import com.hisd3.hismk2.utils.SOAPConnector
import com.sun.xml.messaging.saaj.SOAPExceptionImpl
import io.leangen.graphql.annotations.GraphQLArgument
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.event.EventListener
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import redis.clients.jedis.Jedis

import javax.persistence.EntityManager
import javax.persistence.NoResultException
import javax.servlet.http.HttpSession

@RestController
class UserResource {

    @Autowired
    SocketService socketService

    @Autowired
    NotificationService notificationService

    @Autowired
    SOAPConnector soapConnector

    @Autowired
    DepartmentCategoryService departmentCategoryService

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    EntityManager entityManager

    @Autowired
    BillingItemServices billingItemServices

    @Autowired
    UserRepository userRepository

    @Autowired
    PasswordEncoder passwordEncoder

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

    @PostMapping("/reset-password")
    ResponseEntity<User> resetPassword(@RequestParam(name = "username") String username,
                       @RequestParam(name = "password") String password,
                       @RequestParam(name = "newPassword") String newPassword) {

        User user = userRepository.findOneByLogin(username)
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if(!user) return new ResponseEntity<User>(HttpStatus.NOT_FOUND)

        if(passwordEncoder.matches(password,user.password)){
            user.password = passwordEncoder.encode(newPassword)
            user.activated = true
            user = userRepository.save(user)
            return new ResponseEntity<User>(user, HttpStatus.OK)
        }else{
            return new ResponseEntity<User>(HttpStatus.BAD_REQUEST)
        }

    }

    @RequestMapping("/checkExpiry")
    String checkExpiry() {
        try{
            Jedis jedis = new Jedis(host,port);
            Long expiryDurationMinutes = getExpiryLimitMinutes()
            Long expiryDurationMilliseconds = expiryDurationMinutes*60000
            Long lastActivity = jedis.get(SecurityUtils.currentLogin()) as Long;
            Long millisElapsed = System.currentTimeMillis()-lastActivity
            Long millisRemaining = expiryDurationMilliseconds - millisElapsed
            // println "REMAINING MINUTES : "+ millisRemaining/60000
            if(millisRemaining<0){
                SecurityContextHolder.clearContext()
                simpMessagingTemplate.convertAndSendToUser(SecurityUtils.currentLogin(), "/channel/lastActivity", "LOGOUT")
                return "NOT LOGGED IN"
            }
            if(millisRemaining<61000)
            {
                simpMessagingTemplate.convertAndSendToUser(SecurityUtils.currentLogin(), "/channel/lastActivity", "WARN")
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
