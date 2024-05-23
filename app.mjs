import express from 'express';
import session from 'express-session';
import FileStore from 'session-file-store';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import exphbs from 'express-handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
const port = process.env.PORT || '3000';
app.listen(port,'0.0.0.0', () => { console.log(`http://Localhost:${port}`) });

const hbs = exphbs.create({  // Creating Handlebars instance with custom helper
  helpers: {
    json: function (context) {
      return JSON.stringify(context);
    }
  },
  extname: 'hbs', 
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, '/views/layouts') 
});

app.engine('hbs', engine(hbs));
app.set('view engine', 'hbs');

const FileStoreSession = FileStore(session);
app.use(session({
  store: new FileStoreSession({ path: './sessions' }),
  secret: "omada22",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 },
  name: "customer_sid"
}));
app.use((req, res, next) => {console.log(req.session); next();});

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import worker_routes from './routes/worker.mjs';
import customer_routes from './routes/customer.mjs';
app.use('/', customer_routes);
app.use('/worker', worker_routes);
