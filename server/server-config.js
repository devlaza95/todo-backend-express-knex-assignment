import 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import { serve, setup } from 'swagger-ui-express';
import swaggerSpec from './utils/swagger-docs.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import organizationsRoutes from './routes/organizations.routes.js';
import cors from 'cors';
import workspacesRoutes from "./routes/workspaces.routes.js";

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  legacyHeaders: false,
  standardHeaders: true,
});
app.use(limiter);
app.use('/api-docs', serve, setup(swaggerSpec));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/organizations', organizationsRoutes);
app.use('/api/workspaces', workspacesRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

export default app;
