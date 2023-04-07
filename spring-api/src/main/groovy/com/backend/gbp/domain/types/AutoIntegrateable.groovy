package com.backend.gbp.domain.types

interface AutoIntegrateable {
    String getDomain()
    String getFlagValue()
    void setFlagValue(String value)
    Map<String,String> getDetails()
}