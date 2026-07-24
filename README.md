# Jolter Website & Documentation Portal (`jolter.dev`)

Official website, documentation hub, and engineering blog for [Jolter](https://github.com/jolterjs/jolter) — the fast, reliable JavaScript runtime and toolchain manager.

Built with **Next.js 16 (App Router & Turbopack)**, **React 19**, **Tailwind CSS v4**, and **MDX**.

---

## Getting Started

### Prerequisites

- **Bun** (recommended) or **Node.js** (`>= 18.0.0`)
- **Git**

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/jolterjs/www.git
cd www
bun install
```

### Development Server

Start the local development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Copy `.env.example` to `.env` to configure optional feedback and analytics integrations:

```bash
cp .env.example .env
```

| Variable                         | Description                                              | Default / Fallback                                  |
| :------------------------------- | :------------------------------------------------------- | :-------------------------------------------------- |
| `DISCORD_WEBHOOK_URL`            | Discord Webhook URL for receiving docs feedback          | `undefined` (logs to console in dev)                |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile Site Key for anti-spam CAPTCHA      | `1x00000000000000000000AA` (testing key)            |
| `TURNSTILE_SECRET_KEY`           | Cloudflare Turnstile Secret Key for backend verification | `1x0000000000000000000000000000000AA` (testing key) |

---

## Adding Documentation Pages

1. **Create MDX File**: Add a new `.mdx` file inside `src/content/docs/` (or subdirectories like `guides/`, `maintainers/`).

   ```mdx
   ---
   title: "Your Feature Title"
   description: "Brief summary of your guide or reference page."
   ---

   ## Overview

   Your content here...
   ```

2. **Register in Navigation**: Open `src/content/docs/docs.json` and add the relative slug to the appropriate navigation group:
   ```json
   {
     "group": "Guides",
     "pages": ["guides/your-feature-title"]
   }
   ```
3. **Verify Build**: Run `bun run build` to ensure all links and MDX components compile cleanly.

---

## Available Scripts

| Command          | Action                                                             |
| :--------------- | :----------------------------------------------------------------- |
| `bun run dev`    | Starts Next.js development server with Turbopack                   |
| `bun run build`  | Builds optimized production bundle & verifies all static doc pages |
| `bun run start`  | Runs production server                                             |
| `bun run format` | Formats codebase using Prettier                                    |

---

## Contributing & Community Standards

We welcome contributions to the Jolter website and documentation!

- Read our [Contributing Guide](CONTRIBUTING.md) to get started.
- Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## License

Distributed under the [MIT License](LICENSE).
