package com.backend.gbp.domain


import com.backend.gbp.domain.lot.LotTransaction
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

@TypeChecked
@Entity
@Table(schema = "public", name = "uploaded_files")
class UploadedFiles extends  AbstractAuditingEntity{ //domain is connected ni sa table

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "file_name", columnDefinition = "varchar")
	String fileName

	@GraphQLQuery
	@Column(name = "file_extension", columnDefinition = "varchar")
	String fileExtension

	@GraphQLQuery
	@Column(name = "file_path", columnDefinition = "varchar")
	String filePath

	@GraphQLQuery
	@Column(name = "is_deleted", columnDefinition = "bool")
	Boolean isDeleted

	@GraphQLQuery
	@Column(name = "doc_type", columnDefinition = "varchar")
	String docType

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lot_transaction", referencedColumnName = "id")
	LotTransaction lotTransaction

}
