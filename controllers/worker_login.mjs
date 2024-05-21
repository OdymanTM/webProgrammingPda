import Worker from '../models/workers.mjs';
import jwt from 'jsonwebtoken';


export async function login(req, res){
  console.log(req.session);
  let pageTitle = 'Login';
  res.render('login', {pageTitle: pageTitle, layout: "login_layout"});
}


export async function loginToPosts(req, res, next){
    try{
      const { username, password } = req.body;
      await Worker.validateWorker(username, password,async (err, ress) => {
      if (ress == false) {
        res.status(401).send('Invalid username or password');
        console.log('Invalid username or password');
      } 
      else {
        const token = jwt.sign({ username: username }, 'omada22', { expiresIn: '7d' });
        req.session.token = token;
        res.redirect('/worker/menu');
      }});
    }
    catch(err){
      console.log('Error during login:', err);
      throw err;
    }
    }

 export let doLogout = (req, res) => {
  delete req.session.token;
  res.redirect('/worker/');
}
