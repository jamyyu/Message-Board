import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './router/index.js';
import { get404Page } from './controllers/error.js';


const app = express();

// ES 裡沒有 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(get404Page);

const server = http.createServer(app);
server.listen(3000, () => {console.log('Server is running on port 3000')});
