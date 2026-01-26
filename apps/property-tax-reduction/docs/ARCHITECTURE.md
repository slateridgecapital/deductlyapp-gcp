# Property Tax Reduction - Architecture

## Overview

The Property Tax Reduction application is built on Google Cloud Platform using a serverless microservices architecture. The system retrieves property data from multiple external APIs, caches results for performance, and calculates potential tax savings for users.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              User Request                                    │
│                         (Address: "123 Main St...")                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Cloud Function: Calculator                            │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐     │
│  │   Validate  │──▶│    Check    │──▶│    Fetch    │──▶│  Calculate  │     │
│  │   Address   │   │    Cache    │   │    Data     │   │   Savings   │     │
│  └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
         │                   │                 │
         ▼                   ▼                 ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────────────────────┐
│   Google    │    │  Firestore  │    │      External APIs          │
│   Places    │    │   (Cache)   │    │  ┌─────────┐ ┌───────────┐  │
│    API      │    │             │    │  │ Zillow  │ │  County   │  │
└─────────────┘    └─────────────┘    │  │   API   │ │ Assessor  │  │
                                      │  └─────────┘ └───────────┘  │
                                      │  ┌─────────┐                │
                                      │  │  Attom  │ (fallback)     │
                                      │  │   API   │                │
                                      │  └─────────┘                │
                                      └─────────────────────────────┘
```

## Microservices

### Calculator Service

**Purpose**: Core service that handles all property tax calculations.

**Responsibilities**:
- Address validation and normalization
- Property data retrieval (purchase price, assessed value, market estimate)
- Tax rate lookup
- Tax savings calculation
- Response formatting

**Technology**:
- Runtime: Node.js 20
- Framework: Google Cloud Functions Framework
- HTTP Trigger with JSON request/response

**Scaling**:
- Auto-scales based on request volume (GCP managed)
- Cold start optimization through minimal dependencies
- Max instances configurable to control costs

## Data Flow

### Request Flow

```
1. User submits address
   │
2. Address Validation (Google Places API)
   ├── Success → Continue
   └── Failure → Return 400 error
   │
3. Cache Check (Firestore)
   ├── Cache Hit + Fresh → Return cached data
   └── Cache Miss or Stale → Continue
   │
4. Parallel Data Fetch
   ├── Property Data (Zillow API)
   │   └── Fallback: Attom API
   └── Tax Rate (County Assessor API)
   │
5. Calculate Savings
   ├── Current Tax = Assessed Value × Tax Rate
   ├── Reduced Tax = Market Estimate × Tax Rate
   └── Savings = Current Tax - Reduced Tax
   │
6. Cache Results (Firestore)
   │
7. Return Response
```

### Data Transformation

```
Input:
{
  "address": "123 Main St, San Francisco, CA"
}

↓ Google Places API
{
  "normalizedAddress": "123 Main Street, San Francisco, CA 94102-1234",
  "coordinates": { "lat": 37.7749, "lng": -122.4194 }
}

↓ Zillow API
{
  "purchasePrice": 1200000,
  "purchaseDate": "2021-03-15",
  "marketEstimate": 1150000
}

↓ County Assessor API
{
  "assessedValue": 1350000,
  "taxRate": 0.012,
  "jurisdiction": "San Francisco County"
}

↓ Calculator
{
  "currentTaxBill": 16200,
  "reducedTaxBill": 13800,
  "potentialSavings": 2400
}
```

## GCP Infrastructure

### Cloud Function Configuration

| Property | Value |
|----------|-------|
| Name | `property-tax-calculator` |
| Runtime | Node.js 20 |
| Region | us-central1 |
| Memory | 512 MB |
| Timeout | 60 seconds |
| Min Instances | 0 |
| Max Instances | 100 |
| Concurrency | 1 |

### Firestore Schema

**Collection**: `property-data-cache`

```javascript
{
  // Document ID: SHA256 hash of normalized address
  "normalizedAddress": "123 Main Street, San Francisco, CA 94102-1234",
  "addressHash": "abc123...",
  
  "propertyData": {
    "purchasePrice": 1200000,
    "purchaseDate": "2021-03-15",
    "assessedValue": 1350000,
    "assessedYear": 2025,
    "marketEstimate": 1150000,
    "marketEstimateDate": "2025-11-01"
  },
  
  "taxRate": {
    "rate": 0.012,
    "jurisdiction": "San Francisco County, CA",
    "effectiveYear": 2025
  },
  
  "metadata": {
    "dataSource": "zillow",
    "fetchedAt": "2025-11-29T10:00:00Z",
    "expiresAt": "2025-12-29T10:00:00Z"
  }
}
```

**Indexes**:
- `addressHash` (ascending) - Primary lookup
- `expiresAt` (ascending) - TTL cleanup

### Secret Manager

| Secret Name | Description |
|-------------|-------------|
| `google-places-api-key` | Google Places API key |
| `zillow-api-key` | Zillow API key |
| `attom-api-key` | Attom Data API key (fallback) |

### Service Account

**Name**: `property-tax-calculator@deductlyapp.iam.gserviceaccount.com`

**Roles**:
- `roles/datastore.user` - Read/write Firestore
- `roles/secretmanager.secretAccessor` - Access secrets
- `roles/logging.logWriter` - Write logs

## Caching Strategy

### Cache Policy

- **TTL**: 30 days for property data
- **Invalidation**: Manual only (no real-time updates from sources)
- **Stale-While-Revalidate**: Not implemented (simple cache miss triggers fetch)

### Cache Keys

Document ID is SHA256 hash of normalized address to ensure:
- Consistent lookup regardless of address formatting
- Collision resistance
- Privacy (addresses not stored in plain text as IDs)

### Cache Bypass

Cache is bypassed when:
- Request includes `?refresh=true` query parameter
- Cached data is older than TTL
- Data validation fails

## Error Handling

### Error Categories

| Category | HTTP Code | Retry | Example |
|----------|-----------|-------|---------|
| Client Error | 400 | No | Invalid address format |
| Not Found | 404 | No | Property doesn't exist |
| Server Error | 500 | Yes | Unexpected exception |
| External Dependency | 503 | Yes | API unavailable |

### Retry Strategy

**For External APIs**:
- Max retries: 3
- Backoff: Exponential (1s, 2s, 4s)
- Timeout per request: 10 seconds

**Circuit Breaker**:
- Opens after 5 consecutive failures
- Half-open after 30 seconds
- Closes after 3 successful requests

### Fallback Behavior

```
Zillow API
    │
    ├── Success → Use data
    │
    └── Failure → Attom API
                      │
                      ├── Success → Use data
                      │
                      └── Failure → Return 503
```

## Security

### Authentication

- **Current**: Public endpoint (MVP phase)
- **Future**: API key authentication, rate limiting

### Data Privacy

- Property addresses cached as hashes
- No PII stored beyond address
- Logs redact sensitive information

### API Key Security

- All API keys stored in Secret Manager
- Keys accessed at runtime, not in environment
- Service account has minimal required permissions

## Monitoring & Observability

### Logging

**Log Levels**:
- `ERROR`: Failures requiring attention
- `WARN`: Degraded service (fallback used)
- `INFO`: Request/response summaries
- `DEBUG`: Detailed processing steps

**Structured Logging Format**:
```json
{
  "severity": "INFO",
  "message": "Property tax calculated",
  "addressHash": "abc123...",
  "cacheHit": false,
  "dataSource": "zillow",
  "latencyMs": 1234,
  "savings": 2400
}
```

### Metrics

| Metric | Type | Alert Threshold |
|--------|------|-----------------|
| Request count | Counter | - |
| Error rate | Gauge | > 5% |
| Latency p50 | Histogram | - |
| Latency p95 | Histogram | > 5s |
| Cache hit rate | Gauge | < 50% |
| External API errors | Counter | > 10/min |

### Alerts

1. **High Error Rate**: > 5% errors over 5 minutes
2. **High Latency**: p95 > 5 seconds over 5 minutes
3. **External API Down**: > 10 errors/minute to any external API
4. **Function Crashes**: Any unhandled exception

## Future Considerations

### Scalability

- **Multi-region**: Deploy to additional regions for lower latency
- **CDN**: Cache responses at edge for repeated lookups
- **Queue Processing**: Background jobs for batch updates

### Feature Expansion

- **Batch Processing**: Calculate savings for multiple properties
- **Historical Data**: Track assessed value trends over time
- **Appeal Integration**: Connect to county appeal systems

### Cost Optimization

- **Reserved Instances**: Pre-warm functions during business hours
- **Cache Compression**: Reduce Firestore storage costs
- **API Batching**: Reduce external API call counts




