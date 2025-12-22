# DevDiary

## Dec 22, 2025

```PowerShell
npm install axios
npm audit fix --force
```

### What I did (12/22)

- Upgraded Next.js to 15.5.9
- Wrote frontend login and sign up pages
- Set up the backend
  - Spring Boot 3.5.9
  - Java 21.0.8.9
  - Maven 3.9.11

### Thoughts (12/22)

- It’s very convenient to let AI handle the frontend, since the code it generates is understandable. It’s easier to modify it into a style I prefer than to start from an empty file.
- Things like configuration (e.g., process.env.NEXT_PUBLIC_API_BASE_URL) may require some learning, but I can always ask AI for step-by-step guidance.
- The trade-off is that it’s easier for me to forget the code later. For example, I may not be very familiar with code I wrote months earlier.

## Oct 18, 2025

### What I did (10/18)

- Worked on the HTML header

### Thoughts (10/18)

- Progress was a bit slow. I had planned to finish the front end, but I ended up taking the whole break to relax. Hopefully, I can finish the project after winter break &#x1F642;

## Oct 5, 2025

```PowerShell
npm install next-themes
npm install lucide-react
npm install motion
```

### What I did (10/05)

- Wrote a theme toggle

### Thoughts (10/05)

- Cool! Love the animation!

## Sep 28, 2025 (Note2)

```PowerShell
npx create-next-app@latest . --ts
npm install @reduxjs/toolkit react-redux
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
```

- Learning Next.js is easier for fast content delivery and Search Engine Optimization. Its server-side rendering pre-renders pages, so search engines can see the content right away. I'm switching from Vite to Next.js.
- Current Frontend Stack:

```Tech Stack
Framework: React + TypeScript

UI / Styling: TailwindCSS

Build Tool: Next.js

State Management: Redux Toolkit (for user login state, shopping cart, and analytics data)

Rich Text Editor: TipTap (for users to write blog posts)
```

## Sep 28, 2025 (Note1)

### What I did (09/28)

- Installed Node.js → ran `npm create vite@latest .` → React + TypeScript + React Compiler
- Tried setting up **Tailwind CSS** (ran into issues)

### Problems I hit (09/28)

- Messed around uninstalling Node.js from D drive and reinstalling on C drive
- Downloaded `tailwindcss-windows-x64.exe` (turns out that was useless)
- Learned that `npx tailwindcss init -p` is outdated

### Thoughts (09/28)

- I really hate environment setup — most of the time I don’t know what the commands actually do, so I just *pray* the instructions are correct
- Lesson learned: next time I’ll check the official docs first
