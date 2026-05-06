import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import fs from 'fs'
import connectDB from './configs/mongodb.js';
import { stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';

// initialize express 
const app = express();


// connect to db
await connectDB();
fs.mkdirSync('uploads', { recursive: true });


// middleware
app.use(cors());
app.use('/uploads', express.static('uploads'));


// Routes
app.get('/', (req,res)=>{res.send("Edemy API is working fine!")})
app.use('/api/auth', express.json(), authRouter);
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks);



// port
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
    
})
