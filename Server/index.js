import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoute from './routes/auth.js';
import userRoute from './routes/users.js';
import postRoute from './routes/posts.js';
import { register } from './controller/auth.js';
import { createPost } from './controller/posts.js';
import { verifyToken } from './middleware/auth.js';
/*import User from './models/user.js';
import Post from './models/posts.js';
import { users, posts } from './data/index.js';*/


//configuration of the server

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

//File storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });
//routes with files 
app.post("/auth/register", upload.single('picture'), register);
app.post('./posts', verifyToken, upload.single("picture"), createPost)

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/posts', postRoute)

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
        /*User.insertMany(users);
        Post.insertMany(posts);*/
    })
}).catch((err) => {
    return console.log(`${err} did not connect`)
})