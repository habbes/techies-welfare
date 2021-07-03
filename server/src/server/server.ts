import express from 'express';
import cors from 'cors';
import { IAppServices } from '../core';
import { injectAppServices } from './middleware';
import helmet from 'helmet';

export function createServer(services: IAppServices) {
  const server = express();
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(injectAppServices(services));
  return server;
}