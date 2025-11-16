import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = express.Router();

const createConfigSchema = z.object({
  name: z.string().min(1, 'Name is required')
});

const createCompanyQuestionSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  prompt: z.string().min(1, 'Prompt is required'),
  orderIndex: z.coerce.number().int().min(0).default(0)
});

const createSupportingQuestionSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  responderType: z.enum(['MANAGER', 'SELF']).default('MANAGER'),
  orderIndex: z.coerce.number().int().min(0).default(0)
});

router.get('/', async (req: Request, res: Response) => {
  const configs = await prisma.reviewConfig.findMany({
    orderBy: { createdAt: 'desc' },
    include: { companyQuestions: true }
  });
  res.render('configs/index', { title: 'Review Configs', configs });
});

router.get('/new', (req: Request, res: Response) => {
  res.render('configs/new', { title: 'New Review Config' });
});

router.post('/', async (req: Request, res: Response) => {
  const parsed = createConfigSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = parsed.error.errors[0]?.message || 'Invalid input';
    return res.redirect(`/configs/new?error=${encodeURIComponent(error)}`);
  }
  const config = await prisma.reviewConfig.create({
    data: { name: parsed.data.name }
  });
  res.redirect(`/configs/${config.id}`);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const config = await prisma.reviewConfig.findUnique({
    where: { id },
    include: {
      companyQuestions: {
        orderBy: { orderIndex: 'asc' },
        include: { supportingQuestions: { orderBy: { orderIndex: 'asc' } } }
      }
    }
  });
  if (!config) return res.status(404).send('Not found');
  res.render('configs/show', { title: config.name, config });
});

router.post('/:id/company-questions', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const parsed = createCompanyQuestionSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = parsed.error.errors[0]?.message || 'Invalid input';
    return res.redirect(`/configs/${id}?error=${encodeURIComponent(error)}`);
  }
  await prisma.companyQuestion.create({
    data: {
      reviewConfigId: id,
      text: parsed.data.text,
      prompt: parsed.data.prompt,
      orderIndex: parsed.data.orderIndex
    }
  });
  res.redirect(`/configs/${id}?success=1`);
});

router.post('/company-questions/:cqId/supporting-questions', async (req: Request, res: Response) => {
  const cqId = Number(req.params.cqId);
  const parsed = createSupportingQuestionSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = parsed.error.errors[0]?.message || 'Invalid input';
    return res.redirect(`/configs/${req.query.configId}?error=${encodeURIComponent(error)}`);
  }
  await prisma.supportingQuestion.create({
    data: {
      companyQuestionId: cqId,
      text: parsed.data.text,
      responderType: parsed.data.responderType,
      orderIndex: parsed.data.orderIndex
    }
  });
  const redirectConfigId = req.query.configId;
  res.redirect(`/configs/${redirectConfigId || ''}?success=1`);
});

router.post('/company-questions/:cqId/delete', async (req: Request, res: Response) => {
  const cqId = Number(req.params.cqId);
  const configId = Number(req.query.configId);
  await prisma.companyQuestion.delete({ where: { id: cqId } });
  res.redirect(`/configs/${configId}?success=1`);
});

router.post('/supporting-questions/:sqId/delete', async (req: Request, res: Response) => {
  const sqId = Number(req.params.sqId);
  const configId = Number(req.query.configId);
  await prisma.supportingQuestion.delete({ where: { id: sqId } });
  res.redirect(`/configs/${configId}?success=1`);
});

export default router;


