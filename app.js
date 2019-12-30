const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const nexmo = require('nexmo');
const socketio = require('socket.io');

// Initiliaze Nexmo
const Nexmo = new nexmo({
    apiKey:'9a760d11',
    apiSecret: '3UHS6HM0zGUGZkTL'
}, {debug: true});

//Initializing the app
const app = express();

// Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index route
app.get('/', (req, res) => {
    res.render('index');
});

// Catch form submit
app.post('/', (req, res) => {
    //res.send(req.body);
    //console.log(req.body);

    const {number, text} = req.body;

    Nexmo.message.sendSms(
        '15193424663', number, text, {type: 'unicode'},
        (err, responseData) => {
            if(err) {
                console.log(err);
            } else {
                console.dir(responseData);
                const {messages} = responseData;
                const {['message-id']: id, ['to']: number, ['error-text']: error} = messages[0];
                //Get data from response
                const data = {
                    id,
                    number,
                    error
                };

                // Emit to client
                io.emit('smsStatus', data);
            }
        }
    );
});

// Define a port
const port = 8000;

// Start server
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

//Connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('Disconnected');
    })
});