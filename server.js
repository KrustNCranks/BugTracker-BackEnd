import express from 'express';

const app = express();

/**
 * Basic GET request
 */
app.get('/',(req, res) => res.send('Hello World'));

/**
 * This activates the server
 */
app.listen(4000, () => console.log('Server is Activated'))