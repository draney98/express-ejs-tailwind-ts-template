import express, { Application } from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import indexRouter from './routes/index';
import configsRouter from './routes/configs';
import reviewRouter from './routes/review';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Base directory of the project (works for ts-node and compiled output)
const baseDir = path.join(__dirname, '..');

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(baseDir, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Static files
app.use(express.static(path.join(baseDir, 'public')));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/', indexRouter);
app.use('/configs', configsRouter);
app.use('/review', reviewRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


