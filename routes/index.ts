import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

// Project interface
interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
}

// Sample projects data - replace with your actual projects
const projects: Project[] = []; // Starter projects list (empty)

// About page
router.get('/about', (req: Request, res: Response): void => {
  res.render('about', {
    title: 'About'
  });
});

// Contact page
router.get('/contact', (req: Request, res: Response): void => {
  res.render('contact', {
    title: 'Contact',
    query: req.query
  });
});

// Handle contact form submission
router.post('/contact', (req: Request, res: Response): void => {
  // In a real application, you would handle the form submission here
  // For now, we'll just redirect back with a success message
  console.log('Contact form submitted:', req.body);
  res.redirect('/contact?success=true');
});

export default router;

