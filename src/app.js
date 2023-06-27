//Imports
import 'dotenv/config.js'
import express from 'express';
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

import viewsRouter from './routes/views.routes.js'
import usersRouter from './routes/users.routes.js';
import './passportStrategies.js'
import './persistence/dbConfig.js'
import passport from 'passport';

const app = express()
const PORT = process.env.PORT

//Config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

//Sessions
app.use(
    session({
        store: new MongoStore({
            mongoUrl: process.env.URL_MONGODB_ATLAS,
            ttl: 15
        }),
        secret: 'sessionSecret',
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 60000}
    })
)

//Passport
app.use(passport.initialize())
app.use(passport.session())


app.use('/api/views', viewsRouter)
app.use('/api/users', usersRouter)

app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`)
})