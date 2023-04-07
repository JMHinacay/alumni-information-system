package com.backend.gbp.socket

import groovy.transform.Canonical

@Canonical
class Message {
	String from = ""
	String topic = ""
	String message = ""
//	Date time = new Date()
}