## Blog website

![Blog website](public/assets/preview.png)
[Live Demo](https://oliverblogger.herokuapp.com/)

### description

this a simple blog website built with express js ejs and css

### features

- session based authentication with express-session
- files upload with multer
- serverside user input validation with express validator
- middleware to protect routes a user can only visit the create post page if they are logged in.

### getting started

clone this repository into your machine.
cd into the project directory.
install all the dependancies

```npm
npm install
```

configuring mongodb

```
MONGO_URL = `your mongo url`
```

to start the local development server.

```
npm run devStart
```

visit http://localhost:8080 on your favourite browser
enjoy 🎉.
