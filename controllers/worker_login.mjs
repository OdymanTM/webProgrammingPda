import Worker from '../models/workers.mjs';
import jwt from 'jsonwebtoken';


export async function login(req, res){
    let pageTitle = 'Login';
    res.render('login', {pageTitle: pageTitle, layout: "login_layout"});
}


export async function loginToPosts(req, res){
    try{
      console.log('Login attempt:', req.body);
      const { username, password } = req.body;
      Worker.validateWorker(username, password,async (err, ress) => {
      if (ress == false) {
        console.log('Invalid username or password');
      } 
      else {
        const token = jwt.sign({ id: username }, 'omada22', { expiresIn: '1h' });
        req.session.token = token;
        console.log('User authenticated successfully:', token);
        res.redirect('/menu');
      }});
    }
    catch(err){
      console.log('Error during login:', err);
      res.send(err);
    }
    }