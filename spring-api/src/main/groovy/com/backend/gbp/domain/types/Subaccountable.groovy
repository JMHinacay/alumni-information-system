package com.backend.gbp.domain.types

interface Subaccountable extends CodeAndDescable{
    UUID getId()
    String getDomain()
}