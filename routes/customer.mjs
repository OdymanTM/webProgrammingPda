import express from 'express'
const customer_routes = express.Router();
import dotenv from 'dotenv';
import * as menuController from '../controllers/menu_customer.mjs';
import * as ordersHistoryController from '../controllers/orders_history.mjs';
import * as basketController from '../controllers/basket.mjs';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Customer from '../models/customer.mjs';
import * as orderController from '../controllers/order.mjs';

let basket;
let token;
let table;
let worker;

//check sign in status
customer_routes.use(
    (req, res, next) => {
        if (req.session.passport) {
            res.locals.loggedInUser = req.session.passport.user;
            res.locals.logoutpath = '/customer/logout';
        }else{
            res.locals.loggedInUser = false;
            res.locals.loginpath = '/auth/google';
        }
        if (!req.cookies.basket) {
            req.cookies.basket = [];
          }
          res.locals.numberOfBasketItems = req.cookies.basket.length;
        next();
    }
);
//check sign in status




customer_routes.get('/', (req, res) => {
    res.redirect('/menu');
});
customer_routes.get('/menu/table/:tableid', orderController.tableCheck);
customer_routes.get('/menu', menuController.getMenu);
customer_routes.get('/menu/:category', menuController.getOneCategory);
customer_routes.get('/orders_history', ordersHistoryController.getOrdersHistory);
customer_routes.get('/basket', basketController.getBasket);
customer_routes.post('/basket/submit', orderController.noOtherActiveOrderCheck ,orderController.selectedTableCheck, orderController.loggedinCheck ,orderController.submitOrder);
customer_routes.post('/basket/clear', basketController.clearBasket);
customer_routes.post('/basket/add', basketController.addToBasket);





//google login logic
customer_routes.get('/auth/google',passport.authenticate('google', { scope: ['email'] }));
customer_routes.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/menu' }),

function(req, res) {
    res.redirect('/menu');
});
customer_routes.get('/customer/logout', (req, res) => {
    delete req.session.passport;
    res.redirect('/menu');
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
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
}));
//google login logic


export default customer_routes;