# Property Tax Service

## Purpose

Calculate potential property tax savings by comparing a property's current assessed value against its estimated market value. Returns detailed tax analysis including current tax burden, potential reduced tax, and annual savings opportunity.

## Business Rules

- **Tax Rate Derivation**: Use most recent complete year from `taxHistory` (requires both `taxPaid` AND `assessedValue`)
- **Current Assessment**: Use most recent year from `taxHistory` that has `assessedValue` (even if `taxPaid` is null for new assessments)
- **Tax Calculation**: `currentAssessedValue × taxRatePercent / 100 = currentTaxBill`
- **Savings Calculation**: `currentTaxBill - reducedTaxBill = potentialSavings` (can be positive or negative)
- **Data Freshness**: Cache property data for 30 days maximum
- **Tax Rate Precision**: Use 4 decimal places for tax rate calculations
- **Currency Rounding**: Round all dollar amounts to nearest whole dollar

## How It Works

1. **Receive Address**: Accept property address from user input
2. **Check Cache**: Look for existing data in Firestore (30-day TTL)
3. **Scrape if Needed**: If cache miss, fetch from Zillow via Apify
4. **Derive Tax Rate**: Calculate rate from most recent complete tax history entry
5. **Get Current Assessment**: Use most recent assessed value (may be 2025 even if tax not yet paid)
6. **Calculate Taxes**: Compute current and reduced tax bills using derived rate
7. **Store Results**: Save scraped data + calculations to Firestore
8. **Return Analysis**: Send complete tax savings analysis to client

**Key Logic:**
- **Incomplete Tax History**: Handles 2025 assessments where `taxPaid` is null
- **Tax Rate Source**: Uses most recent year with complete data (e.g., 2024)
- **Current Assessment Source**: Uses most recent assessment (e.g., 2025)
- **Savings Delta**: Shows actual difference (positive = potential savings, negative = no benefit)

### Calculation Example

```javascript
// Input: Property with incomplete 2025 tax history
taxHistory: [
  { year: 2025, taxPaid: null, assessedValue: 1400000 },  // incomplete
  { year: 2024, taxPaid: 15000, assessedValue: 1300000 }  // complete
]
marketEstimate: 1150000

// Step 1: Derive tax rate from 2024 (most recent complete)
taxRatePercent = (15000 / 1300000) × 100 = 1.154%

// Step 2: Get current assessment from 2025 (most recent)
currentAssessedValue = 1400000

// Step 3: Calculate current tax bill (2025 estimate)
currentTaxBill = 1400000 × 1.154 / 100 = $16,156

// Step 4: Calculate reduced tax bill
reducedTaxBill = 1150000 × 1.154 / 100 = $13,271

// Step 5: Calculate savings delta
potentialSavings = 16156 - 13271 = $2,885
potentialSavingsPercent = (2885 / 16156) × 100 = 17.86%
```

## API

**Single function with path-based routing:**

- `POST /` or `POST /calculate` - Calculate property tax savings (default)
- `POST /scrape` or `POST /scrape-property` - Scrape property data only

### POST /calculate (default)

Calculate potential property tax savings with full analysis.

```http
POST /calculate
Content-Type: application/json

Input:
{
  "address": "401 Harrison St, Unit 11G, San Francisco, CA 94105"
}

Output (Success - 200):
{
  "success": true,
  "data": {
    "property": {
      "address": "401 Harrison St, Unit 11G, San Francisco, CA 94105",
      "purchaseHistory": [
        { "date": "2021-03-15", "price": 1200000 }
      ],
      "taxHistory": [
        { "year": 2025, "taxPaid": null, "assessedValue": 1400000 },
        { "year": 2024, "taxPaid": 15000, "assessedValue": 1300000 }
      ],
      "marketEstimate": 1150000
    },
    "calculations": {
      "taxRatePercent": 1.154,
      "derivedFromYear": 2024,
      "currentAssessedValue": 1400000,
      "currentAssessedYear": 2025,
      "marketEstimate": 1150000,
      "currentTaxBill": 16156,
      "reducedTaxBill": 13271,
      "potentialSavings": 2885,
      "potentialSavingsPercent": 17.86
    }
  },
  "metadata": {
    "requestId": "req_1234567890_abc123",
    "cacheHit": false,
    "calculatedAt": "2025-11-30T10:30:00Z",
    "calculationVersion": "1.0",
    "latencyMs": 12500
  }
}

Errors:
- 400 "Address is required" - Missing or empty address field
- 400 "No complete tax history available" - Cannot derive tax rate
- 400 "Market estimate unavailable" - Cannot calculate savings
- 404 "Property not found" - No data available for address
- 503 "Service unavailable" - Apify API failure
- 504 "Gateway timeout" - Scraper took too long
```

### POST /scrape

Scrape property data from Zillow only (no calculations).

```http
POST /scrape
Content-Type: application/json

Input:
{
  "address": "401 Harrison St, Unit 11G, San Francisco, CA 94105"
}

Output (Success - 200):
{
  "success": true,
  "data": {
    "address": "401 Harrison St, Unit 11G, San Francisco, CA 94105",
    "purchaseHistory": [
      { "date": "2021-03-15", "price": 1200000 }
    ],
    "taxHistory": [
      { "year": 2025, "taxPaid": null, "assessedValue": 1400000 },
      { "year": 2024, "taxPaid": 15000, "assessedValue": 1300000 }
    ],
    "marketEstimate": 1150000
  },
  "metadata": {
    "requestId": "req_1234567890_abc123",
    "cacheHit": false,
    "scrapedAt": "2025-11-30T10:30:00Z",
    "latencyMs": 12500
  }
}
```

## GCP Resources

- **Cloud Function**: `property-tax-service`
  - Runtime: Node.js 20
  - Memory: 512MB
  - Timeout: 120 seconds
  - Trigger: HTTP (authenticated)
  - Region: us-central1
  - Entry Point: `handleRequest`

- **Firestore Collection**: `property_tax_properties`
  - Document ID: Normalized address hash
  - Fields: address, purchaseHistory, taxHistory, marketEstimate, calculations, scrapedAt, expiresAt
  - Index: address (ascending), expiresAt (ascending)
  - TTL: 30 days

- **Secret Manager**:
  - `apify-api-key` - Apify API for Zillow scraping

- **Service Account**: `property-tax-calculator@deductlyapp.iam.gserviceaccount.com`
  - Roles:
    - `roles/datastore.user` - Firestore read/write
    - `roles/secretmanager.secretAccessor` - Access API keys
    - `roles/logging.logWriter` - Cloud Logging

## Dependencies

**Upstream:** None (entry point service)

**Downstream:** None (standalone service for MVP)

**External APIs:**
| API | Purpose | Required |
|-----|---------|----------|
| Apify (maxcopell/zillow-detail-scraper) | Property data scraping (purchase history, tax history, market estimate) | Yes |

## Environment Variables

```bash
# Required
APIFY_API_KEY=xxx                # Apify API for Zillow scraper (https://console.apify.com)

# Optional
CACHE_TTL_DAYS=30                # Property data cache duration
REQUEST_TIMEOUT_MS=10000         # External API timeout
MAX_RETRIES=3                    # Retry attempts for failed requests
LOG_LEVEL=info                   # Logging verbosity
ENABLE_CACHE=true                # Enable/disable Firestore cache

# GCP Configuration
GCP_PROJECT_ID=deductlyapp
FIRESTORE_COLLECTION=property_tax_properties
```

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.template .env
# Edit .env with your API keys (especially APIFY_API_KEY)

# Run the service locally
npm run dev

# Service runs on http://localhost:8080

# Test calculate endpoint (default)
curl -X POST http://localhost:8080/calculate \
  -H "Content-Type: application/json" \
  -d '{"address": "401 Harrison St, Unit 11G, San Francisco, CA"}'

# Test scrape endpoint
curl -X POST http://localhost:8080/scrape \
  -H "Content-Type: application/json" \
  -d '{"address": "401 Harrison St, Unit 11G, San Francisco, CA"}'
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- --grep "calculation"
```

## Deployment

### Authentication & Organization Policies

This project is subject to organization-level IAM policies that:
- **Restrict public access**: Functions cannot use `--allow-unauthenticated` 
- **Require authentication**: All function invocations need a valid Bearer token
- **Allow internal access**: Users from approved domains can access with proper credentials

### Deployment Commands

```bash
# Deploy property-tax-service to GCP
gcloud functions deploy property-tax-service \
  --gen2 \
  --runtime nodejs20 \
  --trigger-http \
  --region us-central1 \
  --memory 512MB \
  --timeout 120s \
  --entry-point handleRequest \
  --set-env-vars GCP_PROJECT_ID=deductlyapp,CACHE_TTL_DAYS=30 \
  --set-secrets APIFY_API_KEY=apify-api-key:latest \
  --update-labels app=deductly,service=property-tax-calculator,environment=prod,managed-by=gcloud

# Verify deployment
gcloud functions describe property-tax-service --region us-central1 --gen2

# Test calculate endpoint (default)
curl -X POST https://us-central1-deductlyapp.cloudfunctions.net/property-tax-service \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -d '{"address": "401 Harrison St, Unit 11G, San Francisco, CA"}'

# Test scrape endpoint
curl -X POST https://us-central1-deductlyapp.cloudfunctions.net/property-tax-service/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -d '{"address": "401 Harrison St, Unit 11G, San Francisco, CA"}'
```

### Granting Access to Other Users/Services

```bash
# Grant specific user access
gcloud functions add-invoker-policy-binding property-tax-service \
  --region=us-central1 \
  --member="user:colleague@slateridgecapital.com"

# Grant service account access (for service-to-service calls)
gcloud functions add-invoker-policy-binding property-tax-service \
  --region=us-central1 \
  --member="serviceAccount:other-service@deductlyapp.iam.gserviceaccount.com"
```

## Monitoring

- **Logs**: Cloud Logging
  ```
  resource.type="cloud_function"
  resource.labels.function_name="property-tax-service"
  ```

- **Metrics**: Cloud Monitoring
  - `cloudfunctions.googleapis.com/function/execution_count`
  - `cloudfunctions.googleapis.com/function/execution_times`
  - `cloudfunctions.googleapis.com/function/user_memory_bytes`

- **Alerts**:
  - Error rate > 5% over 5 minutes
  - Latency p95 > 5 seconds
  - External API failure rate > 10%

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Address not found | Return 404 with helpful message |
| Incomplete tax history (2025 assessment, no tax paid) | Use 2025 assessment + 2024 tax rate |
| No complete tax history (all entries missing taxPaid) | Return 400 "Cannot calculate tax rate" |
| Missing assessedValue in all entries | Return 400 "No assessed value found" |
| Missing marketEstimate | Return 400 "Market estimate unavailable" |
| Market value > assessed value | Return negative potentialSavings (no appeal benefit) |
| Apify scraper timeout | Return 504, suggest retry |
| Apify API unavailable | Return 503 with service unavailable error |
| Very old cache data (> 30 days) | Refresh from API, save old to version history |
| Invalid address format | Return 400 with format guidance |

## Firestore Document Schema

```javascript
{
  "address": "401 Harrison St, Unit 11G, San Francisco, CA 94105",
  
  "purchaseHistory": [...],
  "taxHistory": [
    { "year": 2025, "taxPaid": null, "assessedValue": 1400000 },
    { "year": 2024, "taxPaid": 15000, "assessedValue": 1300000 }
  ],
  "marketEstimate": 1150000,
  
  "calculations": {
    "taxRatePercent": 1.154,
    "derivedFromYear": 2024,
    "currentAssessedValue": 1400000,
    "currentAssessedYear": 2025,
    "marketEstimate": 1150000,
    "currentTaxBill": 16156,
    "reducedTaxBill": 13271,
    "potentialSavings": 2885,
    "potentialSavingsPercent": 17.86,
    "calculatedAt": "2025-11-30T10:00:05Z",
    "calculationVersion": "1.0"
  },
  
  "scrapedAt": Timestamp,
  "scrapeCount": 1,
  "expiresAt": Timestamp,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

## Service Isolation

**Graceful Degradation:**
- If Apify/Zillow scraper unavailable → Return 503 with retry guidance
- If Firestore unavailable → Bypass cache, call Apify directly
- If scraper returns partial data → Return what's available with appropriate warnings

## Data Ownership

- **Owns**: Cached property data, calculation results
- **Reads From**: External property APIs (Zillow via Apify)
- **Does Not Own**: Source property records, official tax assessments

## Versioning

- **Current Version**: v1
- **Calculation Version**: 1.0
- **Breaking Changes**: Major version bump, maintain previous version for 6 months
- **Deprecation Notice**: 3 months before sunsetting old versions
