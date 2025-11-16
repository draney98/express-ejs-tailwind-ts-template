import express, { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { getAiClient } from '../services/ai/factory';
import { buildPrompt } from '../services/prompt';

const router = express.Router();

router.get('/start/:configId', async (req: Request, res: Response) => {
  const configId = Number(req.params.configId);
  const companyQuestions = await prisma.companyQuestion.findMany({
    where: { reviewConfigId: configId },
    orderBy: { orderIndex: 'asc' },
    include: { supportingQuestions: true }
  });
  if (companyQuestions.length === 0) {
    return res.redirect(`/configs/${configId}?error=${encodeURIComponent('No company questions in this config')}`);
  }
  // Create sessions for each company question
  const created = await prisma.$transaction(
    companyQuestions.map(cq =>
      prisma.reviewSession.create({
        data: {
          companyQuestionId: cq.id
        }
      })
    )
  );
  return res.redirect(`/review/session/${created[0].id}`);
});

router.get('/session/:sessionId', async (req: Request, res: Response) => {
  const sessionId = Number(req.params.sessionId);
  const session = await prisma.reviewSession.findUnique({
    where: { id: sessionId },
    include: {
      companyQuestion: {
        include: {
          supportingQuestions: { orderBy: { orderIndex: 'asc' } },
          reviewConfig: true
        }
      },
      supportingAnswers: true
    }
  });
  if (!session) return res.status(404).send('Not found');
  // Next session id to navigate
  const siblings = await prisma.reviewSession.findMany({
    where: { companyQuestion: { reviewConfigId: session.companyQuestion.reviewConfigId } },
    orderBy: { id: 'asc' },
    select: { id: true }
  });
  const ids = siblings.map(s => s.id);
  const idx = ids.indexOf(session.id);
  const nextId = idx >= 0 && idx + 1 < ids.length ? ids[idx + 1] : null;
  res.render('review/session', { title: 'Review', session, nextId });
});

router.post('/session/:sessionId/save', async (req: Request, res: Response) => {
  const sessionId = Number(req.params.sessionId);
  const session = await prisma.reviewSession.findUnique({
    where: { id: sessionId },
    include: { companyQuestion: { include: { supportingQuestions: true, reviewConfig: true } } }
  });
  if (!session) return res.status(404).send('Not found');
  const entries = Object.entries(req.body) as [string, string][];
  const toUpsert = entries
    .filter(([key]) => key.startsWith('sq_'))
    .map(([key, value]) => {
      const id = Number(key.replace('sq_', ''));
      return { supportingQuestionId: id, answer: value };
    });
  await prisma.$transaction(
    toUpsert.map(row =>
      prisma.supportingAnswer.upsert({
        where: { reviewSessionId_supportingQuestionId: { reviewSessionId: sessionId, supportingQuestionId: row.supportingQuestionId } },
        update: { answer: row.answer },
        create: { reviewSessionId: sessionId, supportingQuestionId: row.supportingQuestionId, answer: row.answer }
      })
    )
  );
  res.redirect(`/review/session/${sessionId}?success=1`);
});

router.post('/session/:sessionId/submit', async (req: Request, res: Response) => {
  const sessionId = Number(req.params.sessionId);
  const session = await prisma.reviewSession.findUnique({
    where: { id: sessionId },
    include: {
      companyQuestion: { include: { supportingQuestions: true, reviewConfig: true } },
      supportingAnswers: true
    }
  });
  if (!session) return res.status(404).send('Not found');
  const qa = session.companyQuestion.supportingQuestions.map(q => ({
    question: q.text,
    responderType: (q.responderType as 'MANAGER' | 'SELF') || 'MANAGER',
    answer: session.supportingAnswers.find(a => a.supportingQuestionId === q.id)?.answer
  }));
  const prompt = buildPrompt(session.companyQuestion.text, session.companyQuestion.prompt, qa);
  const ai = getAiClient();
  let companyAnswer = '';
  try {
    companyAnswer = await ai.generateCompanyAnswer(prompt);
  } catch (e) {
    companyAnswer = '';
  }
  await prisma.reviewSession.update({
    where: { id: sessionId },
    data: { status: 'COMPLETE', companyAnswer }
  });
  // Navigate to next or summary
  const allSessions = await prisma.reviewSession.findMany({
    where: { companyQuestion: { reviewConfigId: session.companyQuestion.reviewConfigId } },
    orderBy: { id: 'asc' },
    select: { id: true }
  });
  const ids = allSessions.map(s => s.id);
  const idx = ids.indexOf(session.id);
  const nextId = idx >= 0 && idx + 1 < ids.length ? ids[idx + 1] : null;
  if (nextId) return res.redirect(`/review/session/${nextId}`);
  return res.redirect(`/review/summary/${session.companyQuestion.reviewConfigId}`);
});

router.get('/summary/:configId', async (req: Request, res: Response) => {
  const configId = Number(req.params.configId);
  const companyQuestions = await prisma.companyQuestion.findMany({
    where: { reviewConfigId: configId },
    orderBy: { orderIndex: 'asc' },
    include: {
      sessions: { orderBy: { id: 'asc' } }
    }
  });
  res.render('review/summary', { title: 'Summary', companyQuestions });
});

export default router;


