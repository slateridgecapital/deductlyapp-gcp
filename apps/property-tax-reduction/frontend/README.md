# Property Tax Reduction - Frontend

## Purpose

Landing page for the property tax reduction application. Educates homeowners on property tax assessment discrepancies and provides a property search interface for analyzing potential tax savings.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

The development server runs on [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout with Inter font
│   ├── page.tsx           # Main landing page
│   └── globals.css        # Tailwind + CSS variables
├── components/
│   ├── layout/
│   │   ├── header.tsx     # Navigation header
│   │   └── footer.tsx     # Site footer
│   ├── sections/
│   │   ├── hero-section.tsx           # Hero with property search
│   │   ├── assessment-gap-section.tsx # Tax gap visualization
│   │   └── process-section.tsx        # 3-step process cards
│   └── ui/                # shadcn components
└── lib/
    └── utils.ts           # Utility functions (cn helper)
```

## Page Sections

1. **Header** - TaxSaver Pro logo, navigation links, Client Login button
2. **Hero Section** - Headline, subheadline, property search card with address input
3. **Assessment Gap Section** - Explanation of tax gap with valuation comparison bars
4. **Process Section** - 3 cards explaining Data Aggregation, Assessment Audit, Filing Preparation
5. **Footer** - Links and legal disclaimer

## shadcn/ui Components Used

- `button` - CTA buttons
- `card` - Content containers
- `input` - Address input field
- `badge` - Status indicators
- `separator` - Visual dividers
- `progress` - Valuation comparison bars

## Adding New Components

```bash
npx shadcn@latest add [component-name]
```

## Environment Variables

Currently no environment variables required. Future API integration will require:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

## GCP Resources

- **Labels**: `app=deductly`, `service=property-tax-frontend`, `environment=dev`

## Dependencies

**Upstream**: None (static UI only)

**Downstream**: None (future: calculator service at `POST /calculate`)

## Deployment

```bash
# Build and deploy to Cloud Run (future)
gcloud run deploy property-tax-frontend \
  --source . \
  --region us-central1 \
  --update-labels app=deductly,service=property-tax-frontend,environment=prod,managed-by=gcloud
```

## Current Status

This is a **static UI implementation** with no backend integration:
- Address input is non-functional (placeholder only)
- All displayed values are hardcoded examples
- Button clicks have no action

Future phases will connect to the existing calculator backend at `POST /calculate`.
