import worker from '../models/workers.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function login(req, res){
  if (req.session.token) {
    jwt.verify(req.session.token, 'omada22', (err, data) => {
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
/*

export let doRegister = async function (req, res) {
    try {
        const registrationResult = await userModel.registerUser(req.body.username, req.body.password);
        if (registrationResult.message) {
            res.render('register-password', { message: registrationResult.message })
        }
        else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('registration error: ' + error);
        //FIXME: δε θα έπρεπε να περνάμε το εσωτερικό σφάλμα στον χρήστη
        res.render('register-password', { message: error });
    }
}

export let doLogin = async function (req, res) {
    //Ελέγχει αν το username και το password είναι σωστά και εκτελεί την
    //συνάρτηση επιστροφής authenticated

    const user = await userModel.getUserByUsername(req.body.username);
    if (user == undefined || !user.password || !user.id) {
        res.render('login-password', { message: 'Δε βρέθηκε αυτός ο χρήστης' });
    }
    else {
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            //Θέτουμε τη μεταβλητή συνεδρίας "loggedUserId"
            req.session.loggedUserId = user.id;
            //Αν έχει τιμή η μεταβλητή req.session.originalUrl, αλλιώς όρισέ τη σε "/" 
            // res.redirect("/");            
            const redirectTo = req.session.originalUrl || "/tasks";

            res.redirect(redirectTo);
        }
        else {
            res.render("login", { message: 'Ο κωδικός πρόσβασης είναι λάθος' })
        }
    }
}

export let doLogout = (req, res) => {
    //Σημειώνουμε πως ο χρήστης δεν είναι πια συνδεδεμένος
    req.session.destroy();
    res.redirect('/');
}

//Τη χρησιμοποιούμε για να ανακατευθύνουμε στη σελίδα /login όλα τα αιτήματα από μη συνδεδεμένους χρήστες
export let checkAuthenticated = function (req, res, next) {
    //Αν η μεταβλητή συνεδρίας έχει τεθεί, τότε ο χρήστης είναι συνεδεμένος
    if (req.session.loggedUserId) {
        console.log("user is authenticated", req.originalUrl);
        //Καλεί τον επόμενο χειριστή (handler) του αιτήματος
        next();
    }
    else {
        //Ο χρήστης δεν έχει ταυτοποιηθεί, αν απλά ζητάει το /login ή το register δίνουμε τον
        //έλεγχο στο επόμενο middleware που έχει οριστεί στον router
        if ((req.originalUrl === "/login") || (req.originalUrl === "/register")) {
            next()
        }
        else {
            //Στείλε το χρήστη στη "/login" 
            console.log("not authenticated, redirecting to /login")
            res.redirect('/login');
        }
    }
}*/