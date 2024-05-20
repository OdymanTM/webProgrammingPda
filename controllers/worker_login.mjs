import Worker from '../models/workers.mjs';
import jwt from 'jsonwebtoken';


export async function login(req, res){
    let pageTitle = 'Login';
    res.render('login', {pageTitle: pageTitle, layout: "login_layout"});
}


export async function loginToPosts(req, res, next){
  console.log('Login attempt:', req.body);
    try{
      const { username, password } = req.body;
      Worker.validateWorker(username, password,async (err, ress) => {
      if (ress == false) {
        console.log('Invalid username or password');
      } 
      else {
        const token = jwt.sign({ id: username }, 'omada22', { expiresIn: '7d' });
        req.session.token = token;
        console.log('User authenticated successfully:', token);
        res.redirect('/worker/menu');
      }});
    }
    catch(err){
      console.log('Error during login:', err);
      throw err;
    }
    }


export async function authenticateToken(req, res, next) {
  
  console.log(req.session);
  const token = req.session.token;
  if (token==undefined) {
    console.log('No token found');  
    res.redirect('/worker/');}
  else {jwt.verify(token, 'omada22', (err, user) => {
      if (err) throw err;
      console.log(user);
      next();
  });}
};