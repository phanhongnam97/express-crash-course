const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
// const logger = require('./middleware/logger');
const members = require('./members');

const app = express();

// Init middleware
// app.use(logger);

// HTTP logger middleware
app.use(morgan("combined"));

// Handlebars template engine
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// Homepage router
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Members App', 
        members
    })
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Member API routes
app.use('/api/members', require('./routers/api/members'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));