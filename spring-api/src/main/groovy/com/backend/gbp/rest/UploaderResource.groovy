package com.backend.gbp.rest

import com.backend.gbp.domain.UploadedFiles
import com.backend.gbp.graphqlservices.UploadedFilesService
import com.backend.gbp.repository.UploadedFilesRepository
import com.backend.gbp.repository.lot.LotTransactionRepository
import groovy.transform.TypeChecked
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.transaction.annotation.Transactional
import org.springframework.util.StringUtils
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartRequest

import javax.imageio.ImageIO
import java.awt.*
import java.awt.image.BufferedImage


@TypeChecked
@RestController
class UploaderResource {

	@Autowired
	JdbcTemplate jdbcTemplate

	@Autowired
	UploadedFilesRepository uploadedFilesRepository

	@Autowired
	LotTransactionRepository lotTransactionRepository

	@Autowired
	UploadedFilesService uploadedFilesService

	BufferedImage resize(BufferedImage img , Integer newH) {
		Integer oldH = img.height
		Integer oldW = img.width
		Number heightPercent = newH.div(oldH)
		Integer newW = (oldW*heightPercent)

		def tmp = img.getScaledInstance(newW, newH, Image.SCALE_SMOOTH)
		BufferedImage dimg = new BufferedImage(newW, newH, BufferedImage.SCALE_SMOOTH)

		def g2d = dimg.createGraphics()
		g2d.drawImage(tmp, 0, 0, null)
		g2d.dispose()

		return dimg
	}


	def resizer(File orignalImage,int width,int height,String extension) {

		try {
			BufferedImage origBuffImg = ImageIO.read(orignalImage)
			int type = origBuffImg.getType() == 0 ? BufferedImage.TYPE_INT_ARGB : origBuffImg.getType()

			BufferedImage resizedBuffImg = new BufferedImage(width, height, type)
			Graphics2D g = resizedBuffImg.createGraphics()
			g.drawImage(origBuffImg, 0, 0, width, height, null)
			g.dispose()

			String newFile = orignalImage.getAbsolutePath().substring(0, orignalImage.getAbsolutePath().lastIndexOf(".")) + "_" + width + "x" + height + "." + extension
			ImageIO.write(resizedBuffImg, extension, new File(newFile))

			System.out.println("File created : " + newFile)

		} catch (IOException e) {
			e.printStackTrace()
		}
	}



	@Transactional
	@RequestMapping(method = RequestMethod.POST, value = "/api/upload-file")
	ResponseEntity<String> attachments(@RequestParam UUID lotTransactionId, @RequestParam String docType, MultipartRequest request) {

//		OrderSlipItem orderSlipItem = orderSlipItemRepository.findById(UUID.fromString(id)).get()
		def attachment = request.getFiles("file")
//		println("id => "+ lotTransactionId)
		println("nisud sa function")

		try {

			attachment.forEach { file ->
				MultipartFile f = file
//				String filename = StringUtils.cleanPath(f.getOriginalFilename());
//				String filename = StringUtils.cleanPath(f.getOriginalFilename());
//				String newFileName = filename.toLowerCase().replaceAll(" ", "-");
				println("file => "+ file)
				UploadedFiles uploadedResult = new UploadedFiles()
//                resutSlipResource.data = file.bytes.toTypedArray()
//				uploadedResult.fileName = f.originalFilename
				uploadedResult.docType = docType
				uploadedResult.filePath = "uploads/"

					def lotTrans = lotTransactionRepository.findById(lotTransactionId).get()
					uploadedResult.lotTransaction = lotTrans


				uploadedResult = uploadedFilesRepository.save(uploadedResult)
				//get added file again
				String filename = StringUtils.cleanPath(f.getOriginalFilename());
				int lastIndexOf = filename.lastIndexOf(".");
				if (lastIndexOf == -1) {
					String extension = ""; // empty extension
				}
				String extension = filename.substring(lastIndexOf);

				uploadedResult = uploadedFilesRepository.findById(uploadedResult.id).get()
				uploadedResult.fileExtension = extension

				lastIndexOf = f.originalFilename.lastIndexOf(extension)
				StringBuilder newFileName = new StringBuilder();
				newFileName.append(f.originalFilename.substring(0,lastIndexOf))

				uploadedResult.fileName = newFileName

				uploadedResult = uploadedFilesRepository.save(uploadedResult)
				//update flags

					uploadedFilesService.updateFlags(lotTransactionId, docType)


//				String filename = StringUtils.cleanPath(uploadedResult.id.toString());
//				String newFileName = filename.toLowerCase().replaceAll(" ", "-");
//				uploadedResult.mimetype = f.contentType
//				uploadedResult.service = orderSlipItem.service
//				uploadedResult.orderSlipItem = orderSlipIteml
				println("C:/xampp/htdocs/uploads/" + uploadedResult.id.toString())
				try {

					/*** ready for NAS***/
//					f.transferTo( new File("C:/Users/pange/Desktop/Michael Thesis/uploads/" + uploadedResult.id.toString() ));
//					f.transferTo( new File("C:/Users/pange/Desktop/Michael Thesis/uploads/" + newFileName ));



						f.transferTo( new File("C:/xampp/htdocs/uploads/" + uploadedResult.id.toString() + extension ));



//					String origin = f.resource.filename
//					String extension = FilenameUtils.getExtension(origin)
//					String idfname = uploadedResult.file_name
//						byte[] byteData = f.getBytes()
//					uploadedResult.url_path = resultWitterOnSmb(orderSlipItem, byteData, idfname)
//					uploadedFilesRepository.save(uploadedResult)
				} catch (Exception e) {
					e.printStackTrace()
					throw e
				}
			}

		} catch (Exception e) {
			e.printStackTrace()
			throw e
		}

		return new ResponseEntity<>(
				"Success Uploading Files",
				HttpStatus.OK)
	}




}
