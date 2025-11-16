## Express + EJS + Tailwind + TypeScript Starter (Render-ready)

A minimal starter template using Express, EJS, Tailwind CSS, and TypeScript. Preconfigured for easy deployment on Render.

### Use this template

- On GitHub: click “Use this template” → Create a new repository.

### Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

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
├── routes/index.ts
├── server.ts
├── views/{layout,index,projects,about,contact}.ejs
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
