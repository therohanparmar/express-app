import express from 'express'
import router from './route.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt, { decode } from 'jsonwebtoken'

const app = express();

const PORT = 3000

app.get('/', (req, res) => {
    res.send("Hello World")
});

const users = [];

app.use(express.json())

app.post('/register', async (req, res) => {
    const {userName, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
        userName,
        hashedPassword
    });
    res.send('User Registered');
});

app.post('/login', async (req, res) => {
    const {userName, password} = req.body;
    const user = users.find(u => u.userName === userName);
    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
        return res.send("Not Authorized");
    }
    const token = jwt.sign({userName},'test#secret');
    res.json({token})
});

app.get('/dashboard', (req, res) => {
    try {
        const token = req.header('Authorization')
        const decodedToken = jwt.verify(token, 'test#secret')
        if (decodedToken.userName) {
            res.send(`Welcome, ${decodedToken.userName}`);
        } else {
            res.send('Access Denied')
        }
    } catch(error) {
        res.send('Access Denied')
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})