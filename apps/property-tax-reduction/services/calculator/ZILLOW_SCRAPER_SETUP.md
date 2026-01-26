# Zillow Scraper Setup Guide

## What Was Built

A new Cloud Function endpoint (`scrapeProperty`) that integrates with Apify's Zillow Detail Scraper to fetch comprehensive property data including:

1. **Property Address** - Formatted full address
2. **Purchase History** - Array of all historical sales with dates and prices
3. **Tax History** - Array of tax years with paid amounts, assessed values, and calculated tax rates
4. **Zestimate** - Current Zillow market estimate

## Quick Start

### 1. Set Up Environment

```bash
# Navigate to calculator service
cd apps/property-tax-reduction/services/calculator

# Copy environment template
cp env.template .env

# Edit .env and add your Apify API key
# APIFY_API_KEY=your_apify_api_key_here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

```bash
# Start the scrapeProperty function
npm run dev:scrape

# In another terminal, test it
./test-scrape.sh "123 Main St, San Francisco, CA 94102"
```

## API Usage

### Request

```bash
POST http://localhost:8080
Content-Type: application/json

{
  "address": "123 Main St, San Francisco, CA 94102"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "address": "123 Main St, San Francisco, CA 94102",
    "purchaseHistory": [
      { "date": "2021-03-15", "price": 1200000 },
      { "date": "2015-08-20", "price": 950000 }
    ],
    "taxHistory": [
      {
        "year": 2024,
        "taxPaid": 15000,
        "assessedValue": 1300000,
        "taxRate": 0.0115
      }
    ],
    "zestimate": 1350000
  },
  "metadata": {
    "requestId": "req_1234567890_abc123",
    "scrapedAt": "2025-11-29T10:30:00Z",
    "latencyMs": 12500
  }
}
```

## Key Features

### Data Transformation
- **Purchase History**: Extracted from Zillow's `priceHistory[]` array, filtered for "Sold" events, sorted by date (newest first)
- **Tax History**: Calculated tax rate = taxPaid / assessedValue for each year, rounded to 4 decimal places
- **Zestimate**: Current market estimate from Zillow

### Error Handling
- Missing data returns `null` (for single values) or `[]` (for arrays)
- Partial data is acceptable - the function returns what's available
- Clear error messages for common issues (timeout, service unavailable, property not found)

### Logging
- Full raw JSON logged for debugging (at DEBUG level)
- Structured logs for Cloud Logging integration
- Request/response tracking with unique request IDs

## Files Created/Modified

### New Files
- `src/services/zillowScraper.js` - Apify integration and data transformation
- `src/handlers/scrapeProperty.js` - HTTP request handler
- `test-scrape.sh` - Test script for local development

### Modified Files
- `package.json` - Added `apify-client` dependency and `dev:scrape` script
- `src/config/index.js` - Added Apify configuration
- `index.js` - Wired up new scrapeProperty endpoint
- `env.template` - Added APIFY_API_KEY
- `README.md` - Complete documentation for new endpoint

## Next Steps

1. **Test with Real Addresses**: Try various property addresses to see what data is available
2. **Handle Edge Cases**: Test with addresses that have missing data (no zestimate, no comps, etc.)
3. **Integrate with Calculator**: Use the scraped data to feed the property tax calculator logic
4. **Add Caching**: Cache results in Firestore to avoid re-scraping the same property
5. **Deploy to GCP**: Deploy as a Cloud Function when ready

## Deployment

### Prerequisites

Ensure the following service account permissions are granted (already configured for `deductlyapp`):

```bash
# Grant permissions to compute service account
PROJECT_NUMBER=$(gcloud projects describe deductlyapp --format="value(projectNumber)")

gcloud projects add-iam-policy-binding deductlyapp \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/logging.logWriter"

gcloud projects add-iam-policy-binding deductlyapp \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/artifactregistry.reader"

gcloud projects add-iam-policy-binding deductlyapp \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"
```

### Deploy to GCP

```bash
# Optional: Create the secret in Secret Manager (or use env var directly)
echo -n "your_apify_api_key" | \
  gcloud secrets create apify-api-key \
    --data-file=- \
    --replication-policy=automatic \
    --labels=app=deductly,service=property-tax-calculator,environment=prod,managed-by=gcloud

# Deploy the function
gcloud functions deploy scrapeProperty \
  --gen2 \
  --runtime nodejs20 \
  --trigger-http \
  --region us-central1 \
  --memory 512MB \
  --timeout 120s \
  --entry-point scrapeProperty \
  --set-env-vars GCP_PROJECT_ID=deductlyapp,APIFY_API_KEY=your_apify_api_key_here \
  --update-labels app=deductly,service=property-tax-calculator,environment=prod,managed-by=gcloud

# Note: Function requires authentication (--allow-unauthenticated removed due to org policy)
# Test the deployed function with authentication:
curl -X POST https://us-central1-deductlyapp.cloudfunctions.net/scrapeProperty \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -d '{"address": "123 Main St, San Francisco, CA 94102"}'
```

## Authentication & Access

### Function is Authenticated (Not Public)

Due to organization policy `iam.allowedPolicyMemberDomains`, this function requires authentication:

**Testing Locally:**
```bash
# No authentication needed on localhost
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main St, City, State ZIP"}'
```

**Testing Deployed Function:**
```bash
# Requires Bearer token
curl -X POST https://us-central1-deductlyapp.cloudfunctions.net/scrapeProperty \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -d '{"address": "123 Main St, City, State ZIP"}'
```

**Service-to-Service Calls:**
```javascript
const { GoogleAuth } = require('google-auth-library');

const auth = new GoogleAuth();
const client = await auth.getIdTokenClient('https://us-central1-deductlyapp.cloudfunctions.net/scrapeProperty');

const response = await client.request({
  url: 'https://us-central1-deductlyapp.cloudfunctions.net/scrapeProperty',
  method: 'POST',
  data: { address: '123 Main St, City, State ZIP' }
});
```

## Troubleshooting

### Function times out
- Increase timeout in deployment command (current: 120s)
- Check Apify scraper status in Apify console

### No data returned
- Verify the address is for a RECENTLY_SOLD property (has purchase history)
- Check Apify console for scraper run logs
- Try a known good address like "17 Zelma Dr, Greenville, SC 29617"

### Missing fields
- This is expected and handled - empty arrays `[]` or `null` will be returned
- Check raw logs (DEBUG level) to see what Zillow actually returned

## Cost Estimation

- **Apify**: $3 per 1,000 properties scraped (Zillow Detail Scraper pricing)
- **GCP Cloud Functions**: ~$0.40 per million invocations + compute time
- **Total per property**: ~$0.003 + minimal GCP costs

Free tier: $5/month Apify credit = ~1,600 properties/month free

