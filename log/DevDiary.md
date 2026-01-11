# DevDiary

## Jan 11, 2026

### What I did (01/11)

```Bash
# Ubuntu
ssh -i ~/.ssh/swapspot-ec2.pem ubuntu@<Public IP>

sudo apt update && sudo apt upgrade -y

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
exit
sudo apt install -y docker-compose-plugin
docker compose version

sudo mkdir -p /opt/swapspot
sudo chown -R ubuntu:ubuntu /opt/swapspot

scp -i ~/.ssh/swapspot-ec2.pem docker-compose.yml .env ubuntu@<Public IP>:/opt/swapspot/
echo "PASTE_CLASSIC_TOKEN" | docker login ghcr.io -u <User Name> --password-stdin
docker compose pull
docker compose up -d

docker compose logs --tail=200 nginx
```

## Jan 10, 2026

### What I did (01/10)

```PowerShell
npm i @tiptap/react @tiptap/starter-kit @tiptap/html uuid @tiptap/extension-history
```

```MySQL
-- a_id < b_id
CREATE TABLE dm_threads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  a_id BIGINT UNSIGNED NOT NULL,
  b_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_pair (a_id, b_id),
  KEY idx_a (a_id),
  KEY idx_b (b_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE dm_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  thread_id BIGINT UNSIGNED NOT NULL,
  sender_id BIGINT UNSIGNED NOT NULL,
  content_json JSON NOT NULL,
  client_msg_id VARCHAR(36) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_thread_id_id (thread_id, id),
  KEY idx_sender (sender_id),
  UNIQUE KEY uniq_client_msg (sender_id, client_msg_id),
  CONSTRAINT fk_dm_messages_thread
    FOREIGN KEY (thread_id) REFERENCES dm_threads(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE dm_thread_user_state (
  thread_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  cleared_before_msg_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
  is_hidden TINYINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (thread_id, user_id),
  KEY idx_user_hidden (user_id, is_hidden),
  CONSTRAINT fk_dm_state_thread
    FOREIGN KEY (thread_id) REFERENCES dm_threads(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

- Implemented messages page

## Jan 9, 2026

### What I did (01/09)

```PowerShell
npm i chart.js react-chartjs-2
```

- Implemented seller and current user profile pages
- Added search bar logic.

## Jan 8, 2026

### What I did (01/08)

```MySQL
CREATE TABLE item_favorites (
  user_id INT NOT NULL,
  item_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id, item_id),
  INDEX idx_item_fav_item (item_id),

  CONSTRAINT fk_item_fav_item
    FOREIGN KEY (item_id) REFERENCES items(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE cart_items (
  user_id INT NOT NULL,
  item_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (user_id, item_id),
  INDEX idx_cart_item_user (user_id),
  INDEX idx_cart_item_item (item_id),

  CONSTRAINT fk_cart_item_item
    FOREIGN KEY (item_id) REFERENCES items(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE purchase_records (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,

  item_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL,

  price_cents INT NOT NULL,
  currency CHAR(3) NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_purchase_buyer (buyer_id),
  INDEX idx_purchase_seller (seller_id),
  INDEX idx_purchase_item (item_id),

  CONSTRAINT fk_purchase_item
    FOREIGN KEY (item_id) REFERENCES items(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

- Implemented Discover and Cart pages

### Pitfalls (01/08)

- The Discover page doesn’t know whether an item is already in the cart.
- Checkout won’t create orders for now. It’s not hard to implement, but it takes time and adds a lot of logic. I’m keeping it simple without things like order status updates or seller notifications. This is mainly a full-stack learning project, so I’m not focusing too much on UX or doing repeated work, since the logic would be very similar anyway.
- I considered using tags to build a recommendation system, but it would slow me down, so I decided to keep things simple for now.
- I learned a bit about Redux Toolkit but didn’t use it. And the frontend code is messier than before. &#x1F616;

## Jan 6, 2026

### What I did (01/06)

```MySQL
CREATE TABLE items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  seller_id INT NOT NULL,

  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,

  price_cents INT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',

  category ENUM('Clothing','Electronics','Furniture','Books','Other') NOT NULL DEFAULT 'Other',
  item_condition ENUM('New','Like New','Good','Fair','For parts') NOT NULL DEFAULT 'Good',

  trade_method ENUM('Pickup','Meetup','Shipping') NOT NULL DEFAULT 'Meetup',
  location VARCHAR(120) NOT NULL,

  tags_json JSON NULL,

  quantity INT NOT NULL DEFAULT 1,
  negotiable BOOLEAN NOT NULL DEFAULT TRUE,

  status ENUM('Draft','Active','Sold','Archived') NOT NULL DEFAULT 'Draft',

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_items_seller (seller_id),
  INDEX idx_items_status (status),
  INDEX idx_items_category (category),
  INDEX idx_items_updated_at (updated_at),

  CONSTRAINT fk_items_seller
    FOREIGN KEY (seller_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE item_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  item_id BIGINT UNSIGNED NOT NULL,

  s3_key VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uk_item_images_item_order (item_id, sort_order),
  INDEX idx_item_images_item (item_id),

  CONSTRAINT fk_item_images_item
    FOREIGN KEY (item_id) REFERENCES items(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

- Built the item management flow.

### Pitfalls (01/06)

- The folder structure is getting a bit messy. Next time I should probably organize it first instead of jumping straight into coding (but I don’t want to refactor it this time).
- Some parts of the code are repeated. Same root cause: I should plan/organize earlier.

### Thoughts (01/06)

- AI can generate code that works, but it still takes time to tweak it to match the UI style I want.
- Re logic: If AI can remember the earlier conversation and the code I’ve already written, I think it can generate code that doesn’t need much debugging.
- Frontend: Sometimes it adds redundant UX logic. For example, it suggested having both “Save” and “Publish”, but since the form already lets me change the status, “Publish” is unnecessary.
- If AI ever becomes powerful enough to remember everything and understand what humans truly want… then anyone could build websites without much expertise. So… what’s my job going to be? &#x1F605;

## Jan 3, 2026

### What I did (01/03)

```MySQL
ALTER TABLE users
ADD COLUMN headline VARCHAR(255) NULL,
ADD COLUMN bio TEXT NULL,
ADD COLUMN avatar_key VARCHAR(512) NULL;
```

```PowerShell
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
