## Growth Gauge

A minimal app using Express, EJS, Tailwind CSS, and TypeScript. Preconfigured for easy deployment on Render.

### Use this template

- On GitHub: click “Use this template” → Create a new repository.

### Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### Reviews app usage

- Create a config at `Review Configs` → New (e.g., "EOY 2025").
- Add Company Questions with a prompt template.
- For each Company Question, add Supporting Questions (choose MANAGER or SELF).
- Start walkthrough from the config page. Save drafts or Submit to generate an AI answer.

AI provider:
- Defaults to local Ollama. Set env or inline when running:
  - AI_PROVIDER=ollama
  - OLLAMA_BASE_URL=http://localhost:11434
  - OLLAMA_MODEL=llama3.1:8b

### Build and start (production)

```bash
npm run build
npm start
```

### Render deployment

- `render.yaml` provided
- Build command: `npm install` (postinstall runs TypeScript and CSS builds)
- Start command: `npm start`

### Customize

- Views: `views/*.ejs` (hero, pages, layout)
- Routes: `routes/index.ts` (projects array, page titles)
- Styles: Tailwind classes in EJS; adjust colors in `public/css/input.css` and `tailwind.config.js`

### Project layout

```
.
├── public/css/input.css
├── prisma/schema.prisma
├── routes/index.ts
├── src/lib/prisma.ts
├── server.ts
├── views/{layout,index,projects,about,contact}.ejs
├── views/configs/{index,new,show}.ejs
├── views/review/{session,summary}.ejs
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── render.yaml
└── package.json
```

### Notes

- The projects list starts empty in `routes/index.ts`.
- Contact form POST logs to console and redirects with a success banner.

### License

ISC
