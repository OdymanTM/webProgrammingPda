import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Customer from '../models/customer.mjs';
import e from 'express';

export async function isLoggedIn() {
    if (req.session.passport.user) {return true}
    else{return false}
  };


  
