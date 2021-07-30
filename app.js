if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
// console.log(process.env.SECRET)

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const appError = require('./utils/appError');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');



const {
    func
} = require('joi');

const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users');
const {
    contentSecurityPolicy
} = require('helmet');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/camp-karo';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('database connected')
});

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(helmet({
    contentSecurityPolicy: false
}));

const secret = process.env.SECRET || 'thisisabetterscret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
});

store.on("error", function (e) {
    console.log("session store error", e)
});

const cookieConfig = {
    store,
    name: 'biscuit',
    secret,
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(cookieConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})



app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);


app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new appError('Something went wrong', 404))
})

app.use((err, req, res, next) => {
    const {
        message = "something went wrong", status = "500"
    } = err;
    res.status(status).render('error', {
        err
    });
})

app.listen(3000, () => {
    console.log('listening on 3000');
});