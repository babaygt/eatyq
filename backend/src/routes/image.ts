import express from 'express'
import multer from 'multer'
import cloudinary from '../config/cloudinary'
import { checkAuth } from '../middleware/auth'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

interface CloudinaryUploadResult {
	secure_url: string
}

router.post('/image', checkAuth, upload.single('image'), async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ message: 'No file uploaded' })
	}

	try {
		const result = await new Promise<CloudinaryUploadResult>(
			(resolve, reject) => {
				const stream = cloudinary.uploader.upload_stream(
					{ folder: 'menu_items' },
					(error, result) => {
						if (error) reject(error)
						else resolve(result as CloudinaryUploadResult)
					}
				)

				stream.end(req.file!.buffer)
			}
		)

		res.json({ url: result.secure_url })
	} catch (error) {
		console.error('Error uploading to Cloudinary', error)
		res.status(500).json({ message: 'Error uploading image' })
	}
})

router.delete('/image/:publicId', checkAuth, async (req, res) => {
	const { publicId } = req.params
	const fullPath = 'menu_items/' + publicId
	try {
		const destimage = await cloudinary.uploader.destroy(fullPath)
		console.log(destimage)
		res.json({ message: 'Image deleted' })
	} catch (error) {
		console.error('Error deleting image from Cloudinary', error)
		res.status(500).json({ message: 'Error deleting image' })
	}
})

export default router
