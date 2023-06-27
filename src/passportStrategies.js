import passport from "passport";
import { usersModel } from './persistence/models/users.model.js'
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { hashData, compareData } from "./utils.js";

//STRATEGIES
//LOCAL
passport.use('login', 
    new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
        }, async (req, email, password, done) => {
            try {
                const user = await usersModel.findOne({email})
                if(!user){
                    return done(null, false)
                }
                const checkPassword = await compareData(password, user.password)
                if(!checkPassword){
                    return done(null, false)
                }
                done(null, user)
            } catch (error) {
                done(error)
            }
        }
    )
)

//GITHUB
passport.use('githubSignup', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/users/github"
    }, async(accessToken, refreshToken, profile, done) => {
        const {name, email} = profile._json
        try {
            const userDB = await usersModel.findOne({email})
            if(userDB){
                return done(null, userDB)
            }
            const user = {
                first_name: name.split('')[0],
                last_name: name.split('')[1] || '',
                email,
                password: ''
            }
            const newUserGithub = await usersModel.create(user)
            done(null, newUserGithub)
        } catch (error) {
            done(error)
        }
    })
)



//
passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersModel.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})