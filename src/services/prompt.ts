export function buildPrompt(
  companyQuestionText: string,
  promptTemplate: string,
  qa: { question: string; answer?: string; responderType: 'MANAGER' | 'SELF' }[]
) {
  const body = qa
    .filter(x => x.answer && x.answer.trim())
    .map(x => `[${x.responderType}]\nQ: ${x.question}\nA: ${x.answer}`)
    .join('\n\n');
  return `${promptTemplate}\n\nCompany Question:\n${companyQuestionText}\n\nSupporting Evidence:\n${body || '(no answers provided)'}`;
}


