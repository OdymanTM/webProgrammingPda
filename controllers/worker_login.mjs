import worker from '../models/workers.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function login(req, res){
  if (req.cookies.worker) {
    jwt.verify(req.cookies.worker, 'omada22', (err, data) => {
        if (err) throw err;
        if(data.exp < Date.now() / 1000) {
            res.redirect('/worker/');
        }
        res.redirect('/worker/menu');
    });
  }else{
    let pageTitle = 'Login';
    res.render('login', {pageTitle: pageTitle, layout: "login_layout"});
  }
}

export async function loginToPosts(req, res, next){
    try{
      const { username, password } = req.body;
      await worker.validateWorker(username, password,async (err, ress) => {
      if (ress == false) {
        res.status(401).send('Invalid username or password');
        console.log('Invalid username or password');
      } 
      else {
        const token = jwt.sign({ username: username }, 'omada22', { expiresIn: '7d' });
        res.cookie('worker',
          token,
          { maxAge: 1000 * 60 * 60 * 24 * 7, 
            httpOnly: true, 
            secure: false, 
            sameSite: true }); 
        res.redirect('/worker/menu');
      }});
    }
    catch(err){
      console.log('Error during login:', err);
      throw err;
    }
  }

 export let doLogout = (req, res) => {
  res.clearCookie('worker');
  res.redirect('/worker');
}


export async function register(req,res){
  let pageTitle = 'Register';
  res.render('register', {pageTitle: pageTitle, layout: "login_layout"});
}

export async function registerToLogin(req,res){
  const {admin_password, admin_username, name, username, password, isAdmin } = req.body;
  await worker.validateWorker(admin_username, admin_password, async (err, ress) => {
    if (ress == false) {
      res.status(401).send('Invalid admin username or password');
      console.log('Invalid admin username or password');
    } 
    else {
      await worker.isUserAdmin(admin_username, async (err, isUserAdmin) => {
        if(isUserAdmin)  {
            await worker.addWorker(username, name, isAdmin, 0, password, (err, ress) => {
              if (err) {
                res.status(500).send('Error registering');
                console.log('Error registering');
              } else {
                //res.status(200).send('Worker registered');
                res.redirect('/worker');
              }
            });
          } else{
            res.status(401).send('You are not an admin');
            console.log('You are not an admin');
          }
      });
    }
  });
}

export async function posts(req, res){

  try{
      pageTitle = 'Posts';
      res.render('posts', { pageTitle: pageTitle});
  }
  catch(err){
      res.send(err);
  }
}
