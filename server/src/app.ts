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
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'], 
      credentials: true,
      methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
      optionsSuccessStatus: 200
  }))
  app.use(hpp())
  app.use(compression())
  app.use(multer().any())
  app.use(express.json({limit: '50mb'}))
  app.use(express.urlencoded({ extended: true, limit: '50mb' }))
  app.use(cookieParser())
  app.use(i18n.init)
  
  app.use((req, res, next) => {
    res.setHeader(
        'Permissions-Policy',
        'geolocation=()'
    )
    next()
  })
  
  initializeRoutes()
}

export const App = () => {
  connectToDB()
  configureI18n()
  initializeMiddlewares()
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  app.listen(port, () => {
    console.log('🌟 ===============================================');
    console.log(`🚀 Servidor iniciado en puerto ${port}`);
    console.log(`🔧 Modo: ${nodeEnv}`);
    console.log(`🌍 Entorno de desarrollo: ${nodeEnv === 'development' ? 'SÍ' : 'NO'}`);
    console.log(`💳 Webpay simulado: ${nodeEnv === 'development' ? 'ACTIVADO' : 'DESACTIVADO'}`);
    console.log('🌟 ===============================================');
    console.log(i18n.__n(`${locale.es.serverMessage}`, port))
  });
}




