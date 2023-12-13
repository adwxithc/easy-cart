const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

require('dotenv/config')
const User=require('./model/userModel')
const userHelpers=require('./helperMethods/userHelpers')


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback',
    passReqToCallback:true
  },  
  function(request, accessToken, refreshToken, profile, done) {
    
    findOrCreateGoogleUser(profile, done); 
    
  }
));

passport.serializeUser((user,done)=>{
  
    done(null,user)
});

passport.deserializeUser((user,done)=>{
    done(null,user)
});



async function findOrCreateGoogleUser(profile, done) { 
    try {
      let user = await User.findOne({ email: profile.email });
        const spassword= await userHelpers.securePassword(profile.id)
      if (!user) {
        // User not found, create a new user
        user = await User.create({
          fname: profile.name.givenName,
          lname: profile.name.familyName,
          email: profile.email,
          password:spassword,

          // You may need to handle other fields based on your user model
        });
      }
  
      // Return the user
      return done(null, user);
    } catch (error) {
      // Handle any errors
      return done(error, null);
    }
  };