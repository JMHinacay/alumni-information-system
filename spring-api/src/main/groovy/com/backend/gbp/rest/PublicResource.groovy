package com.backend.gbp.rest

import com.backend.gbp.rest.dto.PatientBasicDto
import com.backend.gbp.utils.RequestDumpUtil
import com.google.gson.Gson
import org.apache.http.HttpEntity
import org.apache.http.client.methods.HttpGet
import org.apache.http.impl.client.CloseableHttpClient
import org.apache.http.impl.client.HttpClients
import org.apache.http.params.HttpProtocolParams
import org.apache.http.util.EntityUtils
import org.json.JSONArray
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.BeanPropertyRowMapper
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.user.SimpUser
import org.springframework.messaging.simp.user.SimpUserRegistry
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController

import javax.servlet.http.HttpServletRequest

@RestController
@RequestMapping("/public")
class PublicResource {


    @Autowired
    SimpUserRegistry simpUserRegistry

    @Autowired
    JdbcTemplate jdbcTemplate

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate

    @Autowired
    PasswordEncoder passwordEncoder

/*
    @RequestMapping(value = "/passwordEncoder", produces = ["text/plain"] )
    String passwordEncoder(@RequestParam String password) {

        return passwordEncoder.encode(password)

    }*/
    @RequestMapping(value = "/remoteIp", produces = ["text/plain"] )
    String remoteIp(HttpServletRequest request) {

        def sb = new StringBuilder()
        RequestDumpUtil.dumpRequest(sb,request)
        sb.append("====\n")
        RequestDumpUtil.dumpRequestHeader(sb,request)
        sb.append("====\n")
        RequestDumpUtil.dumpRequestParameter(sb,request)
        sb.append("====\n")
        RequestDumpUtil.dumpRequestSessionAttribute(sb,request)

        return sb.toString()
    }
    @RequestMapping(value = "/getUsers" )
    List<String> getUsers(HttpServletRequest request) {

        List<String> forRet = new ArrayList<>();
        for(SimpUser simpUser in simpUserRegistry.users)
        {
            forRet.add(simpUser.name)
        }
        return forRet
    }
    @RequestMapping(value = "/testCompare" )
    List<String> testCompareTo(HttpServletRequest request) {
        String input = "Bayocboc"
        String comparison1 = "BAYOCBOC GREGG"
        String comparison2 = "BAYOCBOK GREGG"
        String comparison3 = "limaad"
        String comparison4 = "elopre"
        String comparison5 = "baayocbocz"
        String comparison6 = "baayocboc"
        String comparison7 = "bayocbo"
        String comparison8 = "boyocboc"
        println input.compareToIgnoreCase(comparison1)
        println input.compareToIgnoreCase(comparison2)
        println input.compareToIgnoreCase(comparison3)
        println input.compareToIgnoreCase(comparison4)
        println input.compareToIgnoreCase(comparison5)
        println input.compareToIgnoreCase(comparison6)
        println input.compareToIgnoreCase(comparison7)
        println input.compareToIgnoreCase(comparison8)
    }

    @RequestMapping(value = "/getPts", produces = ["application/JSON"] )
    List<PatientBasicDto> getAllPatientDto(HttpServletRequest request){
        println request.remoteUser
        String sql = "select id,first_name as \"firstname\", last_name as \"lastname\", middle_name as \"middlename\", dob,name_suffix as \"suffix\" from pms.patients"
        List<PatientBasicDto> items = jdbcTemplate.query(sql, new BeanPropertyRowMapper(PatientBasicDto.class))
        List<PatientBasicDto> close = new ArrayList<>()


        return items
    }

}
