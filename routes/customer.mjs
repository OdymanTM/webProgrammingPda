import express from 'express'
const customer_routes = express.Router();
import dotenv from 'dotenv';
import * as menuController from '../controllers/menu_customer.mjs';
import * as ordersHistoryController from '../controllers/orders_history.mjs';
import * as basketController from '../controllers/basket.mjs';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Customer from '../models/customer.mjs';

let basket;
let token;

customer_routes.use(
    (req, res, next) => {
        if (req.session.passport) {
            res.locals.loggedInUser = req.session.passport.user;
            res.locals.logoutpath = '/customer/logout';
        }else{
            res.locals.loggedInUser = false;
            res.locals.loginpath = '/auth/google';
        }
        next();
    }
);
customer_routes.get('/', (req, res) => {
  res.redirect('/menu');
});
customer_routes.get('/menu', menuController.getMenu);
customer_routes.get('/menu/:category', menuController.getOneCategory);
customer_routes.get('/orders_history', ordersHistoryController.getOrdersHistory);
customer_routes.get('/basket', basketController.getBasket);
customer_routes.post('/basket/add', basketController.addToBasket);
customer_routes.get('/auth/google', (req, res, next) => {
    basket = req.session.basket;
    token = req.session.token;
    next();
},passport.authenticate('google', { scope: ['email'] }));
customer_routes.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/menu' }),
    
    function(req, res) {
    req.session.token = token;
    req.session.basket = basket;
    res.redirect('/menu');
});
customer_routes.get('/customer/logout', (req, res) => {
    //req.logout(function(err) {
      //if (err) { return next(err); }
      delete req.session.passport;
      delete req.session.basket;
      res.redirect('/menu');
   // });
});


passport.serializeUser((user, done) => {
    Customer.addCustomer(user._json.email, (err, res) => {console.log(err);})
    done(null, user._json.email);
  });
  
passport.deserializeUser((user, done) => {
done(null, user);
});
  
passport.use(new GoogleStrategy({
clientID: process.env.CLIENT_ID,
clientSecret: process.env.CLIENT_SECRET,
callbackURL: "http://localhost:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
return cb(null, profile);
}));
  


export default customer_routes;