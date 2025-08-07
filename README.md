# Domain8 Tier-0 System

Clean, scalable tier-0 domain monetization system for 200+ parked domains.

## Quick Start

```bash
# Install dependencies
npm install

# Deploy all tier-0 domains
npm run deploy:batch

# Sync with domain8 status
npm run deploy:sync

# Check specific domain status
npm run deploy:check example.com.au

# Start development server
npm run dev
```

## Features

- **Automated Deployment**: Batch deploy 200+ domains in minutes
- **Smart Templates**: Automatically selects landing/hero template based on business type
- **Theme Selection**: Intelligently picks theme (ecommerce, finance, comparison, etc.)
- **Domain8 Integration**: Inherits brand colors, respects tier status
- **Ad Optimization**: Enables ads based on historical CTR/revenue
- **Hot Reload**: JSON config changes reload instantly in dev mode

## Commands

### `npm run deploy:batch`
Reads domain_list.csv and generates configs for all domains:
- Skips domains with active higher tiers
- Inherits brand colors from domain8
- Generates AI prompts for content
- Creates deployment report

### `npm run deploy:sync`
Synchronizes tier-0 with domain8 status:
- Disables tier-0 when higher tiers go live
- Updates brand colors when changed
- Re-enables tier-0 when appropriate
- Creates sync report

### `npm run deploy:check <domain>`
Checks specific domain status:
- Shows tier-0 config details
- Shows domain8 integration status
- Provides recommendations
- Saves detailed status report

## Architecture

```
domain8-clean/
├── app/               # Next.js app router
├── components/        # React components
│   ├── templates/     # Landing & Hero templates
│   └── themes/        # Theme components
├── configs/           # Domain JSON configs
├── lib/              # Utilities & types
├── scripts/          # Deployment tools
└── public/           # Static assets
```

## Templates

- **Landing**: Simple centered page for basic sites
- **Hero**: Complex layout with sidebar for platforms/directories

## Themes

- basic
- comparison
- technology
- finance
- creative
- professional
- ecommerce

## Environment Variables

```bash
# Domain8 integration paths
DOMAIN8_PATH=/path/to/domain8/domains
DOMAIN8_CSV=/path/to/domain8/data/domain_list.csv
```

## Workflow

1. Domain list is read from CSV
2. Template selected based on business model
3. Theme picked based on business idea
4. Config generated with AI prompts
5. Brand colors inherited from domain8
6. Tier-0 serves unless higher tier is live
7. Sync keeps everything updated

## Performance

- Deploys 200+ domains in ~30 seconds
- Hot reloads config changes instantly
- Minimal manual work (2 minutes per domain max)
- Automatic tier management