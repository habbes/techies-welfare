import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

export function createServer() {
  const server = express();
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  return server;
}