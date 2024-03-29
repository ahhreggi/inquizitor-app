<!-- TITLE -->
<div align="center">
<img src="public/images/lightbulb-circle.png" width="100" />
<h1>InquizitorApp</h1>
<p>A full-stack application for generating and sharing quizzes
</p>

<p>Built with <a href="https://nodejs.org/en/">Node.js</a>, <a href="https://expressjs.com/">Express</a>, <a href="https://www.postgresql.org/">PostgreSQL</a>, <a href="https://jquery.com">jQuery</a>, CSS/<a href="https://sass-lang.com/">SASS</a> and <a href="https://getbootstrap.com/docs/4.6/">Bootstrap 4</a>

</div>

<!-- INTRODUCTION -->

## 📚 Introduction

<b>InquizitorApp</b> is a RESTful, responsive full-stack web application that allows users to create, modify, and take quizzes, as well as share their results.

Created by Maria Regina Sirilan ([**@ahhreggi**](https://github.com/ahhreggi)) and Paul Ladd ([**@itspladd**](https://github.com/itspladd)).

This app was created as part of our midterm project for Lighthouse Labs' Web Development bootcamp. The goal was to create a full-stack application from start to finish in just one week.

<b>Built with <a href="https://nodejs.org/en/">Node.js</a>, <a href="https://expressjs.com/">Express</a>, <a href="https://www.postgresql.org/">PostgreSQL</a>, <a href="https://jquery.com">jQuery</a>, CSS/<a href="https://sass-lang.com/">SASS</a>, and <a href="https://getbootstrap.com/docs/4.6/">Bootstrap 4</a>.</b>

<!-- FEATURES -->
## ⭐ Features
- Login by username/email or register an account
- Create and attempt public and unlisted quizzes
- View all public quizzes by category, trending, or featured
- Submit quiz reviews
- Share quiz results via unique links
- Add quizzes to your favorites
- **Dashboard:** View/modify your quizzes, favorites, and history
- **Account settings:** Customize your account avatar or delete your account
- **Admin accounts:** Special nametags + access to a control panel that overrides all permissions to delete, publish/unlist, or feature a quiz on the front page

## 📝 Dev Notes

Maria Regina Sirilan ([**@ahhreggi**](https://github.com/ahhreggi)) - *Front-end, UI/UX, API*

> My goal was to create a mobile-first, responsive UI that would help make the user experience as seamless as possible. Every bit of the app is designed with contextual feedback in mind - to provide relevant information to the user through visuals alone so that the UI could remain simple and intuitive. I also focused on scalability early on by dispersing assets and utilities into modular components. This minimized the variety of data passed between the client and server, making it significantly easier to implement additional stretch features towards the end while maintaining a high degree of customizability. Huge props to Paul (and their GOD queries) for holding our crazy database together and keeping up with my requests for progressively granular data! - Reggi ✌️

Paul Ladd ([**@itspladd**](https://github.com/itspladd)) - *Back-end architecture, database, API*

> Thanks, Reggi! My goal was to enforce a well-normalized database structure, to stop any data duplication errors before they could start. The database API is designed with a single point-of-entry, making it easy to bundle the entire database access API into server routes. Within the database API, I did my best to strike a balance between making the functions *flexible* and making them *intuitive*. Lower-level functions are designed to handle an arbitrary amount of input data, while higher-level functions are more granular, with longer, descriptive names designed to be easier to read in the server code. I also handled deployment to Heroku - my first Heroku app, and I learned a LOT! And likewise, huge props to Reggi for both her incredible front-end design and development skills and vision for the project as a whole!

<!-- INSTALLATION -->

## 🛠 Installation

1. Clone or download this repository
   ```
   git clone https://github.com/ahhreggi/inquizitor-app
   ```
2. Navigate to the project directory and install dependencies
   ```
   cd inquizitor-app
   npm install
   ```
3. Set up a local PostgreSQL db and seed the database
   ```
   npm run db:reset
   ```
4. Launch the development web server
   ```
   npm run local
   ```
5. Visit <a href="http://localhost:8080/">http://localhost:8080/</a> on your browser

## 📷 Screenshots
<img src="public/images/screenshots/landing.png" alt="landing" />
<img src="public/images/screenshots/register.png" alt="register" />
<img src="public/images/screenshots/home.png" alt="home" />
<img src="public/images/screenshots/allquizzes.png" alt="allquizzes" />
<img src="public/images/screenshots/show.png" alt="show" />
<img src="public/images/screenshots/play.png" alt="play" />
<img src="public/images/screenshots/review.png" alt="review" />
<img src="public/images/screenshots/results.png" alt="results" />
<img src="public/images/screenshots/create.png" alt="create" />
<img src="public/images/screenshots/dashboard.png" alt="dashboard" />
<img src="public/images/screenshots/account.png" alt="account" />
