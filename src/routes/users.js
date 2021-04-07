const express = require("express");
const router = express.Router();
const moment = require("moment");

module.exports = (db) => {

  // /users/dashboard
  router.get("/dashboard", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;

    let userQuizzes, userHistory, userFavorites;
    if (!userData) {
      req.flash("warning", "You must be logged in to do that!");
      res.redirect("/login");
    } else {
      db.getQuizzesForUser(userData.id)
      .then(rows => {
        userQuizzes = rows;
        for (let quiz of userQuizzes) {
          quiz.creation_time = moment(quiz.creation_time).format("LLLL");
        }
        return db.getSessionsByUser(userData.id);
      })
      .then(rows => {
        userHistory = rows;
        for (let session of userHistory) {
          session.end_time = moment(session.end_time).format("LLLL");
        }

        return db.getFavoritesForUser(userData.id);
      })
      .then(rows => {
        userFavorites = rows;
        for (let quiz of userFavorites) {
          quiz.creation_time = moment(quiz.creation_time).format("LLLL");
        }
        const templateVars = {
          alerts,
          userData,
          currentPage,
          rankData,
          userQuizzes,
          userHistory,
          userFavorites
        };
        res.render("users_dashboard", templateVars);
      })
      .catch(err => console.error(err));
    }
  });

  // /users/:userid
  // Account => form to configure user info
  router.get("/:userID", (req, res) => {
    const {
      alerts,
      userData,
      currentPage,
      rankData
    } = res.locals.vars;
    // ERROR: User is not logged in
    if (!userData) {
      console.log("You must be logged in to do that!");
      req.flash("warning", "You must be logged in to do that!");
      res.redirect("/login");
    } else {
      // ERROR: User is logged in but trying to access with a different user ID
      if (Number(req.params.userID) !== userData.id) {
        console.log(req.params.userID);
        console.log(userData.id);
        req.flash("danger", "You don't have permission to access this page.");
        res.redirect("/");
      } else {
        // SUCCESS: User is logged in and accessing their own account page
        const templateVars = {
          alerts,
          userData,
          currentPage,
          rankData
        };
        res.render("users_account", templateVars);
      }
    }
  });



  return router;
};