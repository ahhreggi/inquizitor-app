require("dotenv").config({
  path: __dirname + "/.env"
});
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const moment = require("moment");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// HELPER FUNCTIONS //////////////////////////////////

const db = require("./src/lib/db/dbHelpers.js");
const {
  generateRandomString
} = require("./src/lib/utils");

// MIDDLEWARE & CONFIGURATIONS ///////////////////////

app.set("view engine", "ejs"); // set the view engine to EJS
app.set("views", "./src/views"); // set the views directory
app.use(bodyParser.urlencoded({
  extended: true
})); // parse req body
app.use(cookieSession({ // configure cookies
  name: "session",
  keys: ["userID", "visitorID"],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(methodOverride("_method")); // override POST requests
app.use(express.static(path.join(__dirname, "public"))); // serve public directory
app.use(flash()); // enable storage of flash messages

// Initialize local variables on every request
app.use((req, res, next) => {
  if (!req.session.visitorID) {
    req.session.visitorID = generateRandomString(10);
  }
  const visitorID = req.session.visitorID;
  const cookieUserID = req.session.userID;
  const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
  db.getUserByID(cookieUserID)
    .then(rows => {
      const userData = rows[0];
      db.getTrendingQuizzes()
        .then(rows => {
          const rankData = rows;
          res.locals.vars = {
            alerts: req.flash(),
            visitorID,
            userData: userData || null,
            currentPage: req.originalUrl,
            currentDateTime,
            rankData
          };
          next();
        });
    })
    .catch((err) => console.error(err));
});

// RESOURCE ROUTES ///////////////////////////////////

const usersRoutes = require("./src/routes/users");
const quizzesRoutes = require("./src/routes/quizzes");
const resultsRoutes = require("./src/routes/results");
const adminRoutes = require("./src/routes/admin");

app.use("/users", usersRoutes(db));
app.use("/quizzes", quizzesRoutes(db));
app.use("/results", resultsRoutes(db));
app.use("/admin", adminRoutes(db));

// ENDPOINTS & ROUTES ////////////////////////////////

// Log the user in
app.post("/login", (req, res) => {
  const {
    login,
    password
  } = req.body;
  // ERROR: Incomplete form
  if (!login || !password) {
    req.flash("danger", "Please complete all fields.");
    res.redirect("/login");
  } else {
    db.getUserByLogin(login)
      .then(rows => {
        const userData = rows[0];
        // Given a valid login, check if the password matches the hashed password
        const valid = userData ? bcrypt.compareSync(password, userData.password) : false;
        // ERROR: Credentials are invalid
        if (!valid) {
          req.flash("danger", "The username/email or password you entered is invalid.");
          res.redirect("/login");
          // SUCCESS: Credentials are valid
        } else {
          req.session.userID = userData.id;
          req.flash("success", `Login successful. Welcome back, ${userData.username}!`);
          res.redirect("/home");
        }
      });
  }
});

// Log the user out
app.post("/logout", (req, res) => {
  // SUCCESS: User is logged in
  if (req.session.userID) {
    req.session.userID = null;
    req.flash("success", "You've successfully logged out.");
  }
  res.redirect("/home");
});

// Form to login to an existing account
app.get("/login", (req, res) => {
  const {
    alerts,
    userData,
    currentPage
  } = res.locals.vars;
  // ERROR: User is already logged in
  if (userData) {
    req.flash("warning", "You are already logged in.");
    res.redirect("/home");
  } else {
    // SUCCESS: User is not logged in
    const templateVars = {
      alerts,
      userData,
      currentPage
    };
    res.render("login", templateVars);
  }
});

// Form to register a new account
app.get("/register", (req, res) => {
  const {
    alerts,
    userData,
    currentPage
  } = res.locals.vars;
  // ERROR: User is already logged in
  if (userData) {
    req.flash("warning", "You are already logged in.");
    res.redirect("/home");
  } else {
    // SUCCESS: User is not logged in
    const templateVars = {
      alerts,
      userData,
      currentPage
    };
    res.render("register", templateVars);
  }
});

// Create a new account and log the user in
app.post("/register", (req, res) => {
  const {
    username,
    email,
    password
  } = req.body;
  // ERROR: Incomplete form
  if (!username || !email || !password) {
    req.flash("danger", "Please complete all fields.");
    res.redirect("/register");
  } else if (username.length > 12) {
    req.flash("danger", "Username is too long (maximum 12 characters).");
    res.redirect("/register");
  } else if (username.includes(" ") || username.includes("@")) {
    req.flash("danger", "Invalid username.");
    res.redirect("/register");
  } else if (email.length > 60) {
    req.flash("danger", "Email is too long.");
    res.redirect("/register");
  } else {
    db.getUserByUsername(username)
      .then(rows => {
        const userData = rows[0];
        // ERROR: Username is taken
        if (userData) {
          req.flash("danger", "The username you entered is already in use.");
          res.redirect("/register");
        } else {
          db.getUserByEmail(email)
            // ERROR: Email is taken
            .then(rows => {
              const userData = rows[0];
              if (userData) {
                req.flash("danger", "The email you entered is already in use.");
                res.redirect("/register");
                // SUCCESS: Complete form and nonexistent credentials
              } else {
                const hashedPassword = bcrypt.hashSync(password, 10);
                db.addUser({
                  username,
                  email,
                  password: hashedPassword
                })
                  .then(rows => {
                    const userData = rows[0];
                    req.session.userID = userData.id;
                    req.flash("success", "Registration successful. Welcome to InquizitorApp!");
                    res.redirect("/home");
                  });
              }
            });
        }
      });
  }
});

// Study page
app.get("/study", (req, res) => {
  const {
    alerts,
    userData,
    currentPage
  } = res.locals.vars;
  const templateVars = {
    alerts,
    userData,
    currentPage
  };
  res.render("study", templateVars);
});


// Error 404 page
app.get("/404", (req, res) => {
  const {
    alerts,
    userData,
    currentPage
  } = res.locals.vars;
  const templateVars = {
    alerts,
    userData,
    currentPage
  };
  res.status(404).render("404", templateVars);
});

// Home page
app.get("/home", (req, res) => {
  const {
    alerts,
    userData,
    currentPage,
    rankData
  } = res.locals.vars;
  db.getFeaturedQuizzes()
    .then(quizData => {
      const templateVars = {
        alerts,
        userData,
        currentPage,
        quizData,
        rankData
      };
      res.render("home", templateVars);
    })
    .catch(err => console.error(err));
});

// Landing page
app.get("/", (req, res) => {
  const {
    alerts,
    userData,
    currentPage
  } = res.locals.vars;
  db.getFeaturedQuizzes()
    .then(() => {
      const templateVars = {
        alerts,
        userData,
        currentPage
      };
      res.render("index", templateVars);
    })
    .catch(err => console.error(err));
});

// Wildcard route
app.get("/*", (req, res) => {
  res.redirect("/404");
});

//////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`InquizitorApp listening on port ${PORT}`);
});