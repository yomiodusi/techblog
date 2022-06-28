// express mysql2 sequelize nodemon dotenv bcrypt
// todo use momentjs to show user what workout they did today/ what workout they should do on a specific day

//importing
const express = require("express");
const path = require("path");
const sequelize = require('./config/connection');
const routes = require("./controllers");
const connection = require("./config/connection");

require("dotenv").config();

// instantuate app and get port
const app = express();
const PORT = process.env.PORT || 3001;

const exphbs = require("express-handlebars");
const helpers = require("./utils/helpers");
const hbs = exphbs.create({ helpers });
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// allows you to save/configure style sheet/ javascript
app.use(express.static(path.join(__dirname, "public")));

// use routes for directing web flow
app.use(routes);

// any other route
app.use((req, res) => {
  res.status(404).end();
});

// force true means, if there area any changes, update and re-run database changes.
connection.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Backend Server Live on ${PORT}`);
  });
});
