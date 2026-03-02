const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

//Import routes here eg. const userRoutes = require('./src/routes/users.routes')
const userRoutes = require('./src/routes/users.routes')
const postRoutes = require('./src/routes/post.routes')
const commentRoutes = require('./src/routes/comment.routes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads',express.static('uploads'))

//Route connections here (Connect routes) eg. app.use('', userRoutes)
app.use('', userRoutes)
app.use('', postRoutes)
app.use('', commentRoutes)

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Social Media API',
        now: new Date()
    })
})

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {   
        console.log('MongoDB connected successfully!')
        app.listen(process.env.PORT, () => {
        console.log(`Server is running on ${process.env.PORT}!`)
    })
})
    .catch((error) => {
        console.log('MongoDB connection error', error)
    })




/**
 NOTES TO CODE
 Line 1 - imports the express library.  Express is a function that creates a server application
 Line 2 - imports mongoose
 Line 3 - imports dotenv library.  This makes dotenv so it can be used. The   role of dotenv is to load variables from a .env file into process.env, without this node cannot read the .env file (node does not automatically 'understand' .env)
 Line 4 - runs dotenv.config() file this executes dotenv.  It looks for a file in the project root, it reads all key=value pairs and injects them into node's environment object process.env. Because .env is text, then dotenv translates this into real environment variables.  This must run before anything requiring the variables - ie. before mongoose.connect
 Note - in node.js, process is a global object that is automatically available everywhere. So process.env is an object that stores variables and each value is always a string ie process.env = {PORT:3000, MONGODB_URL:codewithuser&passwordetc}.  So process.env enables variables to be provided to your app from outside the code.
 Line 7 - const userRoutes = require('./src/routes/users.routes') this code finds the file, executes the file, takes whatever is assigned to module.exports and returns it to userRoutes.  So now the variable userRoutes holds the Express router object. This MUST be paired with line 17 so the route can be used.  In summary: require() → imports / loads; app.use() → connects / mounts ie bring me the toolbox, plug the toolbox into the application
 
 Line 11 - const app = express() calls express to execute the  express function, it creates a new application instance and stores it in the variable named app.  this is important because everything in Express attached to app
 Line 13 - app.use(express.json()) - adds JSON middleware
 Line 14 - the code ..express.urlencoded(..) parses incoming data and converts it into a JavaScript object
 Line 14 - app.use is middleware so it must run before routes so the routes can read req.body
 Line 14 - ({ extended: false })) uses a simple parser typically for simple data rather than nested objects
 Line 15 - app.use(express.static('uploads')) makes the uploads in a specific available on the normal Node.js server. In simple terms, this means: “Make everything inside the uploads folder publicly accessible via the browser.” It tells Express: Treat the uploads/ directory as public files; allow direct access using URLs and serve files automatically without writing routes. With express.static() files become viewable / downloadable wthout it they would be inaccessible on localhost:PORT_NUMBER. Effectively it enables http://localhost:3000/user-12411-1771599774403.jpeg to become a link to the photo
 Line 15 - app.use('/uploads',express.static('uploads')) - the '/uploads' part of the code means "Allow public access to the uploads folder, but only through URLs starting with /uploads ie http://localhost:3000/uploads/user-12411-1771599774403.jpeg.


 Line 18 - app.use('', userRoutes) so any request whose URL starts with /users, then hand control to userRoutes.  So this means when a request comes in…if the path begins with /users…pass the request to userRoutes (declared on line 7 and links to users/routes file).So use this router for any request starting with /users. Without this line of code the route exists but would be unreachable (404).
 
 Line 22 - '/' is the root URL, (req, res) => { } is the route handler function
 Line 23 - res.json(...) is the response back to the client
 Line 23 - 26 - {message: .., now: ... } is the object sent back to the client to confirm the server is running, that the routing works and JSON responses work
 Line 29 - mongoose.connect(process.env.MONGODB_URL) - mongoose.connect() tries to connect your Node.js app to MongoDB and (process.env.MONGODB_URL) reads the environment variables whist keeping them secret 
 
 Line 30-31 - .then(() => {...} so .connect returns a promise; .then only runs if connection succeeds so that server only starts when MongoDB is ready, then it logs a success message
 Line 32 - app.listen(process.env.PORT, ...) starts the Express server and listen for incoming requests on this port.  Important - it is placed inside the .then() so the server will not run if the database failed
 Line 36-37 - .catch((error) => {...} runs if the connection fails and logs the error so you know what went wrong.
 Lines 29-38 - Summary - Connect to MongoDB , if successful start server, if failed don't start server and log error message


 */

/* DESIGN NOTES
Social Media App Requirements
- Model
    - User
        - username (String, unique)
        - email (String, unique)
        - fullName (String)
        - bio (String)
        - profilePic (Sting because the image will be a url link)
        - timestamps (createdAt, updatedAt)

    - Post - many:1 relationship ie one user multiple posts
        - author (ObjectId ref - > refers to User model)
        - content (String)
        - postPic (String)
        - likes (Array[ObjectId ref - > User)]) - see comment sect'n below
        - timestamps (Date)

    - Comment many:1 relationship ie one user multiple comments
        - post (ObjectId ref - > refers to Post model) relationship
        - author (ObjectId ref - > refers to User model) relationship
        - content (String)
        - timestamps (Date)

- Routes:
    - users
        - GET/users (READ) - gets complete list of users
        - POST/users (CREATE) 
        - PATCH/users/:id (UPDATE)
        - DELETE/users/:id (DELETE)
        - GET/users/:id (READ) - get a specific user
    - posts 
        - GET/posts ?userId= (READ) - get posts from a specific user
        - POST/posts (CREATE) 
        - PATCH/posts/:id (UPDATE)
        - DELETE/posts/:id (DELETE)
        - GET/posts/:id (READ) - get a specific post
        - POST/posts/:id/like-toggle (CREATE) - enables a like to be added 
    -comment
        - GET/comments?postId= (READ) - get all comments related to a specific post
        - POST/comments (CREATE) 
        - PATCH/comments/:id (UPDATE)
        - DELETE/comments/:id (DELETE)

    - notes about routes
        - to decide if something classifies as a model or not, check does it have:
            - several routes or functionalities?
            - a complete lifecycle?
            - here it is true for users, posts and comments
            - here it is not true for likes (like will be on or off only; adding or removing some data)
       
General notes about databases
    - Database type selection (ie SQL or non-SQL) based on various factors
    - Some websites use a mix of databases - each database has adv & disadv
        - scalability 
        - database suitability for server
        - not sure if data will change - non SQL
        - data will not change (fixed Schema) - SQL
        - transaction support required (ie payment processing) - SQL
        - these are advanced topics in DevOps 
        - none db is not better than another but one may be better than another in specific scenarios





        



 */