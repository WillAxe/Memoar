import multer from "multer"
import path from "path"
import fs from "fs"

const uploadDir = path.join(process.cwd(), "uploads", "images")

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now()
    cb(null, uniqueName + path.extname(file.originalname))
  },
})

export const upload = multer({ storage })
