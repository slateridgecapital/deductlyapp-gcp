# Property Tax Reduction

## Mission

Empower property owners to understand their property tax burden and identify potential savings opportunities by comparing assessed values against market estimates.

## Product Overview

### Core Value Proposition

Most homeowners don't realize they may be overpaying on property taxes when their assessed value exceeds current market value. This service provides instant visibility into potential tax savings by analyzing the gap between assessed and estimated market values.

### Target Personas

- **Homeowners in declining markets** - Properties in markets with declining or stagnant values
- **Peak-price buyers** - Recent home buyers who purchased at peak prices
- **Over-assessed properties** - Property owners in areas with aggressive tax assessments
- **Real estate investors** - Managing multiple properties across jurisdictions
- **Cost-conscious homeowners** - Facing financial pressure seeking to reduce expenses

## Technical Architecture

### Microservices

| Service | Description | Status |
|---------|-------------|--------|
| [Calculator](./services/calculator/) | Core tax savings calculation engine | Planning |

### Data Flow

```
User Input (Address)
        ↓
    Calculator Service
        ├── Address Validation (Google Places API)
        ├── Property Data Retrieval (Zillow/Attom API)
        ├── Tax Rate Lookup (County Assessor API)
        └── Savings Calculation
        ↓
    Response (Tax Savings Analysis)
```

### GCP Infrastructure

- **Cloud Functions**: Serverless compute for microservices
- **Firestore**: Property data caching
- **Secret Manager**: API key storage
- **Cloud Logging**: Centralized logging and monitoring

## User Flow

```
1. Landing Page
   ↓
2. Enter Address
   ↓
3. [Loading State: "Retrieving property data..."]
   ↓
4. Results Dashboard
   - Property details
   - Tax calculations
   - Savings visualization
   ↓
5. [Optional] Learn More / Next Steps
   - How to appeal assessment
   - When to file
   - Required documentation
```

## Output Example

```
Property Address: 123 Main St, San Francisco, CA 94102

Purchase Price (2021): $1,200,000
Current Assessed Value: $1,350,000
Estimated Market Value: $1,150,000
Property Tax Rate: 1.2%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2025 Tax Bill (Current): $16,200
2025 Tax Bill (If Reduced): $13,800
Potential Annual Savings: $2,400
```

## Design Principles

- **Trustworthy**: Professional, data-driven presentation
- **Clear**: No jargon, straightforward calculations
- **Actionable**: Emphasize the savings opportunity
- **Transparent**: Show the math, cite data sources

## Success Metrics

- User can input address and receive results in < 5 seconds
- 90%+ accuracy on property data retrieval
- Clear, understandable presentation of potential savings
- Mobile-friendly responsive design

## Development

### Prerequisites

- Node.js 20+
- Google Cloud SDK (authenticated)
- GCP Project: `deductlyapp`

### Local Development

```bash
cd services/calculator
npm install
npm run dev
```

### Deployment

See individual service READMEs for deployment instructions.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md) - Technical architecture and design decisions
- [Product Vision](./docs/PRODUCT_VISION.md) - Full product plan and roadmap
- [Calculator Service](./services/calculator/README.md) - Core calculation microservice

## Legal Disclaimers

- This tool provides estimates, not legal or tax advice
- All values are based on publicly available data
- Users should verify information with their local assessor's office
- Actual savings depend on successful appeal process




