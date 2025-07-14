import express, { Request, Response } from 'express';
import i18n from 'i18n'
import locale from './locales'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import multer from 'multer'
import { dbUrl, nodeEnv, port } from './configs/env';
import { connect, set } from 'mongoose'

import path from 'path';
import { initializeAdminDatabase } from './services/Initial.services';
import router from './routes';
import { logger, stream } from './utils/logger';
const app: express.Application = express()

const connectToDB = async () => {
  try {
    if (nodeEnv === 'development') {
      set('debug', true)
    }
    console.log(dbUrl);
    connect(dbUrl).then(() => {
      
      //initializeAdminDatabase()

      logger.info('********************');
      logger.info('Conected to Mongo DB');
      logger.info('********************');
    }).catch((error) => {
      console.log(error)
    })
  } catch (error) {
    
  }
}

const initializeRoutes = () => {
  app.use('/', router)
}

const configureI18n = () => {
  i18n.configure({
      directory: __dirname + '/locales',
      defaultLocale: 'es',
      queryParameter: 'language',
      cookie: 'language',
      register: global
  })
  i18n.setLocale('es')
}

const initializeMiddlewares = () => {
  if (nodeEnv === 'development') {
      app.use(morgan('dev', { stream }))
  }
  app.use(cors({
      origin:true, 
      credentials:true,
      /* methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
      optionsSuccessStatus: 200 */
  }))
  app.use(hpp())
  app.use(compression())
  app.use(multer().any())
  app.use(express.json({limit: '50mb'}))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))
  app.use(cookieParser())
  app.use(i18n.init)
  initializeRoutes()
  app.use(express.urlencoded({ extended: true }))
  app.use(helmet({
      crossOriginEmbedderPolicy: false
  }))
  app.use((req, res, next) => {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    res.setHeader(
        'Permissions-Policy',
        'geolocation=()'
    )
    next()
  })
  // Eliminado el intento de servir archivos estáticos y el index.html para evitar crash

}

export const App = () => {
  connectToDB()
  configureI18n()
  initializeMiddlewares()
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  app.listen(port, () => {
    console.log(i18n.__n(`${locale.es.serverMessage}`, port))
  });
}




