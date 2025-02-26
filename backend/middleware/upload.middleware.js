import path from 'path'
import multer from 'multer'



const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/providersLogo')
    },
    filename: function (req, file, cb){
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})


const upload = multer({
    // take storage params up
    storage: storage,
    fileFilter: function(req, file, callback){
        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
            callback(null, true)
        }
        else{
            console.error('Only JPG & PNG & JPEG files are supported!')
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2 // limit file size at 2Mb
    }
})
// console.log("///////;okaw////////")
// process.exit(1)



export default upload