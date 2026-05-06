import multer from 'multer'

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
        const safeOriginalName = file.originalname.replace(/\s+/g, '-');
        callback(null, `${Date.now()}-${safeOriginalName}`);
    }
})

const upload = multer({storage})

export default upload;
