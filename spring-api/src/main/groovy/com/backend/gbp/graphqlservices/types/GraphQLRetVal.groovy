package com.backend.gbp.graphqlservices.types

import groovy.transform.Canonical

@Canonical
class GraphQLRetVal<T> {
	T payload
	boolean success = false
	String message = ""
	UUID returnId = null
}
