import bcrypt from 'bcrypt';
import fs from 'fs';
import * as loginController from '../controllers/worker_login.mjs';


//const usernames = loginController.getAllWorkersUsernames();
//const passwords = loginController.getAllWorkersPasswords();

let pageTitle;

export async function login(req, res){

    try{
      pageTitle = 'Login';
      res.render('login', {pageTitle: pageTitle, layout: "login_layout"});
    }
    catch(err){
      res.send(err);
    }
}
/*

*code for the login screen using the database 

export async function loginToPosts(req,res){
    try{
      const {username, password} = req.body;
      const userIndex = usernames.findIndex(username);
      
      if (userIndex === -1 || !bcrypt.compareSync(password, passwords[userIndex])) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      else{
      const user = { username: usernames[userIndex], password: passwords[userIndex] };
      req.session.user = user;
      await posts(req,res);
      }
    } 
    catch (err) {
      res.send(err);
    }
}*/

export async function loginToPosts(req, res){

    try{
      const { username, password } = req.body;
      const user = users.find(user => user.username === username);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid username or password' });
      } 
      else {
        req.session.user = user;
        console.log('User authenticated successfully:', user);
        res.redirect('/posts');
      }
    }
    catch(err){
      console.error('Error during login:', err);
      res.send(err);
    }
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

export async function menuInit(req, res){

    try{
        pageTitle = 'Menu';
        res.render('menu', { pageTitle: pageTitle, menuCats: menuCats.categories, chosenCat: 'Beverages', items: menuData.items });
    }
    catch(err){
        res.send(err);
    }
}

export async function menuCategory(req, res){

    try{
        pageTitle = 'Menu';
    
        const prevChosenCategory = menuCats.categories.find(cat => cat.chosen);
        if (prevChosenCategory) {
            delete prevChosenCategory.chosen;
        }
        const chosenCategory = menuCats.categories.find(cat => cat.category === req.params.category);
        if (chosenCategory) {
            chosenCategory.chosen = true;
        }
  
        res.render('menu', { pageTitle: pageTitle, menuCats: menuCats.categories, chosenCat: req.params.category, items: menuData.items });
    }

    catch(err){
        res.send(err);
    }
}

export async function ordersHistoryInit(req,res){

    try{
        pageTitle = 'Orders History';
        res.render('orders_history', { pageTitle: pageTitle, orders: ordersHistory.orders});
    }
    catch(err){
        res.send(err);
    }
}

export async function tablesInit(req,res){

    try{
        pageTitle = 'Tables';
        res.render('tables', {pageTitle: pageTitle, sectors: sectors.sectors, chosenSector: 'Sector 1', tables: tables.tables});
    }
    catch(err){
        res.send(err);
    }
}

export async function tablesSector(req,res){

    try{
        pageTitle = 'Tables';
        const prevChosenSector = sectors.sectors.find(cat => cat.chosen);
        if (prevChosenSector) {
            delete prevChosenSector.chosen;
        }
        const chosenSector = sectors.sectors.find(cat => cat.sector === req.params.sector);
        if (chosenSector) {
            chosenSector.chosen = true;
        }  
  
        res.render('tables', { pageTitle: pageTitle, sectors: sectors.sectors, chosenSector: req.params.sector, tables: tables.tables });
    }
    catch(err){
        res.send(err);
    }
}
