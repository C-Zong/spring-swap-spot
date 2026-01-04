# DevDiary

## Jan 3, 2026

### What I did (01/03)

```MySQL
ALTER TABLE users
ADD COLUMN headline VARCHAR(255) NULL,
ADD COLUMN bio TEXT NULL,
ADD COLUMN avatar_key VARCHAR(512) NULL;
```

```Bash
# AWS CLI
aws configure
aws sts get-caller-identity

# Toast
npm install react-hot-toast
```

- Updated the sidebar
- Implemented logout
- Built the profile section in the dashboard
- Set up AWS S3 and started using it to store user avatars

### Pitfalls (01/03)

- I didn’t leave enough comments in my code (need to get better at writing comments &#x1F62E;&#x200D;&#x1F4A8;)
- Storing the user id in the SecurityContext can reduce extra database queries
- Old user avatar files need to be cleaned up manually

### Thoughts (01/03)

- I’m worried I might not finish everything before winter break &#x1F62D;
- I think I’ll prioritize shipping. I want to enjoy my break and keep things simple.

## Dec 29, 2025

### What I did (12/29)

- Built the login backend and implemented user authentication using JWT stored in HttpOnly cookies.

### Thoughts (12/29)

- Spring Security feels more related to networking concepts than to typical application logic. Each part is understandable, but if someone asked me “what exactly do you need to set up authentication?”, I don’t think I could list everything clearly yet.
- I previously used Ruby on Rails with Devise in a course project, which abstracts almost all authentication logic. It made me think about whether Spring Boot has (or should have) something similar. &#x1F914;

## Dec 26, 2025

### What I did (12/26)

```PowerShell
# Useful Docker Command
docker ps
docker exec -it <container_name> sh # bash
```

- Configured CORS and Spring Security SecurityFilterChain to permit unauthenticated OPTIONS requests for CORS preflight and public access to /api/signup and /api/login, while securing all other API endpoints.
- Built signup backend flow: request DTO validation, password hashing, transactional user insert with unique-constraint concurrency safety, unified API responses, and global exception handling.

### Thoughts (12/26)

- I've learned a bit of Spring Boot on my own, so using AI-generated code and finding bugs is not too difficult for me. However, I'm pretty sure I wouldn't be able to write the same code again without AI &#x1F605;

## Dec 23, 2025

### What I did (12/23)

- Set up Docker containers
- mybatis-plus 3.5.6
- mybatis 3.0.3

```MySQL
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

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
