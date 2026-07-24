# Contributing to the Jolter Website & Documentation

Thank you for helping improve the Jolter website and documentation!

---

## Code of Conduct

Contributors must follow our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## Getting Started

### Prerequisites

- **Bun** or **Node.js** (`>= 18`)
- **Git**

### Installation & Development Server

1. **Install dependencies**:

   ```bash
   bun install
   ```

2. **Run local dev server**:
   ```bash
   bun run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the website.

---

## Quality & Verification

Before submitting a pull request, build the site locally to ensure Next.js compiles all MDX pages, Tailwind CSS styles, and TypeScript files cleanly:

```bash
bun run build
```

---

## Documentation Structure

- All docs pages live in `src/content/docs/`.
- Navigation hierarchy is managed in `src/content/docs/docs.json`.
- When adding a new docs page, create the `.mdx` file and register its path in `docs.json`.
