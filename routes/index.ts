import express, { Request, Response, Router } from 'express';
const router: Router = express.Router();
interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
}
const projects: Project[] = []; // Starter projects list (empty)
// Homepage
router.get('/', (req: Request, res: Response): void => {
  res.render('index', { title: 'Home', projects: projects.slice(0, 3) });
});
// Projects page
router.get('/projects', (req: Request, res: Response): void => {
  res.render('projects', { title: 'Projects', projects });
});
// About page
router.get('/about', (req: Request, res: Response): void => {
  res.render('about', { title: 'About' });
});
// Contact page
router.get('/contact', (req: Request, res: Response): void => {
  res.render('contact', { title: 'Contact', query: req.query });
});
// Contact form (placeholder)
router.post('/contact', (req: Request, res: Response): void => {
  console.log('Contact form submitted:', req.body);
  res.redirect('/contact?success=true');
});
export default router;
