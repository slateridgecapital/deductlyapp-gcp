# Property Tax Reduction - Frontend

## Purpose

Landing page for the property tax reduction application. Educates homeowners on property tax assessment discrepancies and provides a property search interface for analyzing potential tax savings.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)
- **Deployment**: Google Cloud Run (Docker container)

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

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
frontend/
├── Dockerfile              # Multi-stage Docker build for Cloud Run
├── .dockerignore           # Files excluded from Docker build
├── next.config.ts          # Next.js config (standalone output)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with Inter font
│   │   ├── page.tsx           # Main landing page
│   │   ├── globals.css        # Tailwind + CSS variables
│   │   ├── api/
│   │   │   ├── calculate/route.ts           # Proxy to calculator backend
│   │   │   └── places/
│   │   │       ├── autocomplete/route.ts    # Google Places autocomplete
│   │   │       └── details/route.ts         # Google Places details
│   │   └── estimate/page.tsx                # Estimate results page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── header.tsx     # Navigation header
│   │   │   └── footer.tsx     # Site footer
│   │   ├── sections/
│   │   │   ├── hero-section.tsx           # Hero with property search
│   │   │   ├── assessment-gap-section.tsx # Tax gap visualization
│   │   │   ├── process-section.tsx        # 3-step process cards
│   │   │   ├── testimonials-section.tsx   # Testimonials carousel
│   │   │   └── estimate-savings/          # Estimate savings flow
│   │   └── ui/                # shadcn components
│   ├── hooks/
│   │   ├── use-address-autocomplete.ts    # Address autocomplete hook
│   │   └── use-progress-steps.ts          # Multi-step progress hook
│   └── lib/
│       └── utils.ts           # Utility functions (cn helper)
```

## Page Sections

1. **Header** - TaxSaver Pro logo, navigation links, Client Login button
2. **Hero Section** - Headline, subheadline, property search card with address input
3. **Assessment Gap Section** - Explanation of tax gap with valuation comparison bars
4. **Process Section** - 3 cards explaining Data Aggregation, Assessment Audit, Filing Preparation
5. **Testimonials Section** - Carousel of user testimonials
6. **Footer** - Links and legal disclaimer

## shadcn/ui Components Used

- `button` - CTA buttons
- `card` - Content containers
- `input` - Address input field
- `badge` - Status indicators
- `separator` - Visual dividers
- `progress` - Valuation comparison bars
- `carousel` - Testimonials slider
- `skeleton` - Loading states
- `tooltip` - Contextual help

## Adding New Components

```bash
npx shadcn@latest add [component-name]
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_PLACES_API_KEY` | Yes | Google Places API (New) key for address autocomplete. Create in [Google Cloud Console](https://console.cloud.google.com/apis/credentials). Enable Places API (New). |
| `CALCULATOR_URL` | Yes (production) | URL of the calculator Cloud Function backend. Defaults to `http://localhost:8080` for local dev. |

Copy `.env.example` to `.env.local` and add your API keys for local development.

## GCP Resources

- **Cloud Run Service**: `property-tax-frontend`
  - Region: us-central1
  - Memory: 512Mi
  - CPU: 1
  - Max instances: 10
  - Timeout: 60s
  - URL: `https://property-tax-frontend-965120872458.us-central1.run.app`

- **Service Account**: `965120872458-compute@developer.gserviceaccount.com`
  - `roles/run.invoker` on `property-tax-service` Cloud Function (backend access)

- **Labels**: `app=deductly`, `service=property-tax-frontend`, `environment=prod`, `managed-by=gcloud`

## Dependencies

**Upstream**: None (entry point for users)

**Downstream**:
- Calculator Cloud Function at `POST /calculate` (authenticated via Google ID token)
- Google Places API (New) for address autocomplete

**Authentication**:
- Frontend-to-backend calls use `google-auth-library` to obtain ID tokens
- Tokens are cached for 1 hour with a 5-minute refresh buffer
- Organization policy requires all Cloud Run/Function access to be authenticated

## Deployment

### Prerequisites

- Google Cloud SDK authenticated (`gcloud auth login`)
- Project set to `deductlyapp` (`gcloud config set project deductlyapp`)
- Cloud Run API enabled (`gcloud services enable run.googleapis.com`)

### Deploy from Source

```bash
cd apps/property-tax-reduction/frontend

# Build and deploy (uses Dockerfile)
gcloud run deploy property-tax-frontend \
  --source . \
  --region us-central1 \
  --platform managed \
  --no-allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --max-instances 10 \
  --set-env-vars "CALCULATOR_URL=https://us-central1-deductlyapp.cloudfunctions.net/property-tax-service,GOOGLE_PLACES_API_KEY=YOUR_KEY" \
  --update-labels app=deductly,service=property-tax-frontend,environment=prod,managed-by=gcloud
```

### Deploy from Pre-Built Image

If the image is already built in Artifact Registry, deploy directly:

```bash
gcloud run deploy property-tax-frontend \
  --image us-central1-docker.pkg.dev/deductlyapp/cloud-run-source-deploy/property-tax-frontend:latest \
  --region us-central1 \
  --platform managed \
  --no-allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --max-instances 10 \
  --set-env-vars "CALCULATOR_URL=https://us-central1-deductlyapp.cloudfunctions.net/property-tax-service,GOOGLE_PLACES_API_KEY=YOUR_KEY" \
  --update-labels app=deductly,service=property-tax-frontend,environment=prod,managed-by=gcloud
```

### Grant Backend Access (One-Time)

After initial deployment, grant the Cloud Run service account permission to invoke the backend:

```bash
gcloud functions add-invoker-policy-binding property-tax-service \
  --region=us-central1 \
  --gen2 \
  --member="serviceAccount:965120872458-compute@developer.gserviceaccount.com"
```

### Verify Deployment

```bash
# Check service status
gcloud run services describe property-tax-frontend --region=us-central1

# Test with authentication
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  https://property-tax-frontend-965120872458.us-central1.run.app/

# Test calculate API proxy
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main St, San Francisco, CA"}' \
  https://property-tax-frontend-965120872458.us-central1.run.app/api/calculate
```

## Monitoring

- **Logs**: Cloud Logging
  ```
  resource.type="cloud_run_revision"
  resource.labels.service_name="property-tax-frontend"
  ```

- **Metrics**: Cloud Monitoring
  - `run.googleapis.com/request_count`
  - `run.googleapis.com/request_latencies`
  - `run.googleapis.com/container/memory/utilizations`

- **View Logs**:
  ```bash
  gcloud run logs read property-tax-frontend --region=us-central1 --limit=50
  ```

## Docker Configuration

The app uses a multi-stage Docker build (`Dockerfile`):

1. **Builder stage**: Installs dependencies, builds Next.js in standalone mode
2. **Runner stage**: Minimal Alpine image with only production artifacts

Key settings in `next.config.ts`:
- `output: "standalone"` - Bundles dependencies into a self-contained server

## Current Status

- **Address autocomplete**: Google Places API (New) powers address suggestions. Set `GOOGLE_PLACES_API_KEY` for autocomplete.
- **Apartment/condo handling**: When a multi-unit property is detected, a required "Unit / Apt #" field appears. Validation blocks submission if unit is missing.
- **Calculator integration**: `/api/calculate` proxies to the calculator backend with authenticated service-to-service calls.
- **Cloud Run deployment**: Live at `https://property-tax-frontend-965120872458.us-central1.run.app` (requires authentication due to org policy).
