# america250-site

A Next.js 13+ project for the America 250 radio archive site.

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Backup & Archive Folders](#backup--archive-folders)
- [Learn More](#learn-more)
- [Deployment](#deployment)
- [License](#license)

## Project Structure

/
├── src/                   # Main application source code
├── archive-baseline/      # Baseline backup of working configuration
├── archive-broken/        # Archive of broken/legacy configuration
├── public/                # Static assets
├── .gitignore
├── package.json
├── README.md
└── ...

## Getting Started

1. **Clone the repository:**
   git clone https://github.com/w4ovt/america250-site.git
   cd america250-site

2. **Install dependencies:**
   npm install

3. **Run the development server:**
   npm run dev
   Open http://localhost:3000 in your browser.

4. **Edit pages:**
   - Start with `app/page.tsx`. The page auto-updates as you edit.

## Scripts

- npm run dev — Start development server
- npm run build — Build for production
- npm run start — Start production server

## Environment Variables

- Configure environment variables in `.env.local` as needed.
- Example:
  DATABASE_URL=your_database_url
  NEXT_PUBLIC_API_KEY=your_public_api_key

## Backup & Archive Folders

- archive-baseline/: Contains a backup of the last known working configuration.
- archive-broken/: Contains legacy or broken configurations for reference or troubleshooting.
- These folders are for developer use and are not part of the production build.

## Learn More

- Next.js Documentation: https://nextjs.org/docs
- Learn Next.js: https://nextjs.org/learn

## Deployment

- Deploy on Vercel (https://vercel.com/) or your preferred platform.
- See Next.js deployment docs (https://nextjs.org/docs/deployment) for more.

## License

MIT
