const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
//metodo de serializado
passport.serializeUser((user,done) =>{
    done(null,user.id);    
});
passport.deserializeUser(async (id,done) =>{
    const user = await User.findById(id);
    done(null,user);        
});

passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, async (req, email, password, done) => {
    //conexiondb
    //objeto en blanco
    const user = await User.findOne({email : email});
    if(user){
        return done(null,false, req.flash('signupMessage','El correo ya existe'));
    } else {
        const newUser = new User();
        newUser.name= req.body.name;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    }    
}));
// autenticacion para logearme
passport.use('local-sign', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, async(req, email, password,done) =>{
    const user = await User.findOne({email:email});
    if(!user){ 
        return done(null, false, req.flash('signinMessage', 'Usuario no encontrado.'));
    } 
    if(!user.comparePassword(password)){
        return done(null, false, req.flash('signinMessage', 'Contraseña incorrecta'))
    }
    return done(null, user)
}));