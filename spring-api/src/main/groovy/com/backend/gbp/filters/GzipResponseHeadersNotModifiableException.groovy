package com.backend.gbp.filters

import javax.servlet.ServletException

 class GzipResponseHeadersNotModifiableException extends ServletException {

     GzipResponseHeadersNotModifiableException(String message) {
        super(message)
    }
}