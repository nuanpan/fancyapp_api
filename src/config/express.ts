import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as mongoose from 'mongoose';
import { authentication } from '../modules/authentication.module';
import UsersRouter from '../routes/users.route';
import config from './config';

export default function () {
    var app: express.Express = express();

    for (let model of config.globFiles(config.models)) {
        require(path.resolve(model));
    }

    if (config.useMongo) {
        mongoose.connect(config.mongodb, {
            promiseLibrary: global.Promise
        }).catch(() => { console.log('Error connecting to mongos'); });
    }

    app.set('views', path.join(__dirname, '../../src/views'));
    app.set('view engine', 'pug');

    app.use(logger('dev'));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../../src/public')));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    app.use(authentication());
    const router =  express.Router();
    app.use("/users", UsersRouter)
    return app;
};
