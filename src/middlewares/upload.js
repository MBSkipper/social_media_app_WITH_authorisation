const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage ({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    }, 
    filename: function (req, file, cb) {
        const now = Date.now()
        const randomNum = Math.floor(Math.random()*10000 + 10000)
        const extension = path.extname(file.originalname)
        const customFilename = `user-${randomNum}-${now}${extension}`
        cb(null, customFilename)
    }
})

const upload = multer ({ storage })

module.exports = upload




/*
NOTES TO CODE 
Line 1 - imports multer without which Express cannot read file uploads
Line 3 - multer.diskStorage ({...}) defines how and where the files are stored - diskStorage saves files to your filesystem, or memoryStorage - keeps files in RAM (used for cloud uploads, image processing etc).  Here files will be written to disk
Line 4 - destination: function (req, file, cb) - req = full Express request object, file = metadata about the upload, cb = callback you must call
Line 5 - No error → null; Save file inside 'uploads/' directory. Note 'uploads/' is relative to where you start Node; the folder must exist, or Multer throws an error
Summary lines 3 - 5 This confit defines destination, not filename. (note When you omit filename, Multer auto-generates one: this prevents collisions)
Line 9 - creates a timestamp
Line 10 - creates a rounded down random number
Line 11 - creates the extension from the original file uploaded 
Line 12 - this creates a custom filename by adding user-(a_random_number)-(a_timestamp)-(the_extension_from_original_file).  
Line 12 - The filename function tells Multer: “What should the saved file be called on disk? ie cb(error, filename).cb(null, customFilename) - here Multer is expecting cb(error, value) ie error → Did something fail? and value → The result you want Multer to use.  Here cb(null, customFilename) means no error occurred (null) and Use this value (filename).  So the code literally tells Multer: “Everything is fine — save the file using this filename.”  Why null? Because in Node-style callbacks: null = no error; anything else = error object.  Summary Mental model (very helpful).Think of Multer asking: “What should I name this file?” The callback answers: “No problems — call it THIS.”    NOTE if it had been left as file.originalname - it would be the file name on the users computer. NOTE this would have introduced a file overwrite risk ie if the file is uploaded a second time the second upload overwrites the first with no warning and no error.  Therefore to avoid collisions and guarantee uniqueness a random number and a timestamp has been added in the code

Line 16 - const upload = multer ({ storage }) creates the actual middleware instance.  You are telling Multer:
“Use this storage configuration when handling uploads”; upload is now a middleware function generator. Create manually: /uploads as Multer will NOT create it.

Line 18 - module.exports = upload - this makes the middleware potentially available to the app anywhere that a file states require('') you are tellling Node “When another file uses require(...), give it this upload object” ie it makes it importable via require(), it enables reuse across routes, and it does not execute anything by itself
IMPORTANT  'upload' needs to be added to the API that will require  upload you need to specify which field will use the uploaded data and then the file can be accessed using the req.file command.  Refer to tutor file: FullStackBatch-Node-Express-Server/index.js line 49 -54 which is :
 app.post('/process-registration', upload.single('resume'), (req, res) => {
  console.log(req.body)
  console.log(req.file)
  const { firstName, lastName } = req.body
  res.send(`Thank you for registering, ${firstName} ${lastName}!`)
})
This then needs to attach to the correct route so in this folder 

In this file refer to users.routes.js line 14 which enables the API to use the uploaded profilePic file defined in the users.models.js file line 24


in the user.routes.js file.  It sill be this is this code on line 13 
router.post('/users', createUser) 

*/