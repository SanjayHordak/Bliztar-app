import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    filename:(req, file, cb) => {
        const ext = path.extname(file.originalname || "").toLowerCase();
        const safeExt = [".jpeg", ".jpg", ".png", ".webp"].includes(ext) ? ext : "";
        const unique = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${unique}${safeExt}`);

    },
})

// File filter jpeg,png,jpg,webp
const fileFilter = (req,file,cb)=>{
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if(extname && mimetype){
        cb(null,true)
    }else{
        cb(new Error('Only images of type jpeg,jpg,png,webp are allowed'));
    }
}


export const upload = multer({
    storage,
    limits:{fileSize:5 * 1024 * 1024}, //5MB
    fileFilter
});

