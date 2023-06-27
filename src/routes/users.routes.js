import { Router } from 'express';
import { usersModel } from '../persistence/models/users.model.js'
import { hashData } from '../utils.js';
import passport from 'passport';

const usersRouter = Router()

//SIGNUP
//--Email
usersRouter.post('/signup', async (req, res)=>{
    const {firstName, lastName, email, age, password} = req.body
    const user = await usersModel.findOne({email});
    if(user){
        return res.redirect('api/views/errorSignup')
    }
    const hashPassword = await hashData(password)
    const newUser = {...req.body, password: hashPassword}
    await usersModel.create(newUser)
    res.redirect('/api/views/')
})

//--Github
usersRouter.get('/api/users/githubSignup',
    passport.authenticate('githubSignup', {scope: ['user:email']})
)

usersRouter.get('/github',
    passport.authenticate('githubSignup', {failureRedirect: '/api/views'}),
    function(req, res) {
        res.redirect('/api/views/products')
    }
)


//LOGIN con Passport
usersRouter.post('/login', 
    passport.authenticate('login', {
        passReqToCallback: true,
        failureRedirect: '/api/views/errorLogin',
        successRedirect: '/api/views/products'
    })
)

//LOGOUT
usersRouter.get('/logout', (req, res)=>{
    req.session.destroy(error =>{
        if(error){
            console.log(error)
            res.send(error)
        } else{
            res.redirect('/api/views')
        }
    })
})

export default usersRouter