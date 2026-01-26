# Deductly - Tax Strategy Platform

## Mission

Empower individuals to take control of their finances by democratizing access to personalized and actionable tax strategies, without the need for expensive advisors or gatekept secrets.

## Product Vision

### Assumptions / Hypothesis

- UHNW individuals use tax strategists to save millions; this is not available to everyone else.
- CPAs optimize for audit avoidance, not tax optimization.
- Self-serve tax strategy tools do not exist in a consumer-first way.
- Users are looking for tax planning or to understand their tax burden, not to be sold a product or upsell.

### Personas

- **High-earning W2 tech workers** at companies like Google, Meta, Amazon, etc.
- **International individuals** who originate from other countries who may not understand US tax laws
- **Specialized professionals** educated in specialized fields that were not given personal finance guidance
- **Startup founders or early employees** with complex compensation (ISOs, RSUs, K-1s)
- **High-income earners** expecting $200K+ annual income or a liquidity event (e.g., secondary sale)

### Principles

- **Trustworthy:** Data security, transparent logic, no surprise fees
- **User-first:** Personalized experience, simple UX
- **Self-serve:** Minimal friction, fast answers
- **Actionable AI:** Strategist-level recommendations, not generic education
- **Confidence-building:** Show your work, link to rules/sources
- **Easy start:** Value within 5 minutes

## Applications

This platform hosts multiple tax strategy applications, each designed to help users optimize a specific area of their tax burden.

| Application | Description | Status |
|-------------|-------------|--------|
| [Property Tax Reduction](./apps/property-tax-reduction/) | Calculate potential property tax savings by comparing assessed vs market values | In Development |

## Architecture

This repository contains microservices designed to run on Google Cloud Platform (GCP). Each application has its own microservices following a standardized documentation structure (see `.cursorrules`) to ensure consistency and maintainability.

```
deductlyapp-cgp/
├── .cursorrules                    # Documentation standards
├── GCP_LABELING_STANDARD.md        # GCP resource labeling requirements
├── README.md                       # Platform overview (this file)
├── scripts/
│   └── verify-gcp-labels.sh        # Audit GCP resource labels
├── apps/
│   └── property-tax-reduction/     # Property Tax Reduction app
│       ├── README.md               # App overview
│       ├── docs/                   # App documentation
│       │   ├── ARCHITECTURE.md
│       │   └── PRODUCT_VISION.md
│       └── services/               # Microservices
│           └── calculator/         # Tax calculation service
└── (future apps...)
```

### GCP Infrastructure

- **Cloud Functions**: Serverless compute for all microservices
- **Firestore**: NoSQL database for caching and state
- **Secret Manager**: Secure storage for API keys
- **Cloud Logging**: Centralized logging and monitoring
- **Cloud Build**: CI/CD pipelines (planned)

**Resource Labeling**: All GCP resources MUST be labeled with `app=deductly` plus additional metadata. See [GCP_LABELING_STANDARD.md](./GCP_LABELING_STANDARD.md) for complete labeling requirements and examples.

## Development

Each application is self-contained with its own README following the project's documentation standards. See individual app directories for:

- App-specific setup and dependencies
- Microservice documentation
- API contracts and business rules
- Local development instructions
- Deployment procedures

### Prerequisites

- Node.js 20+
- Google Cloud SDK (authenticated)
- GCP Project: `deductlyapp`

### Quick Start

```bash
# Navigate to an app
cd apps/property-tax-reduction

# Navigate to a service
cd services/calculator

# Install dependencies
npm install

# Run locally
npm run dev
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deductlyapp-cgp
   ```

2. **Set up GCP CLI**
   ```bash
   gcloud auth login
   gcloud config set project deductlyapp
   ```

3. **Choose an application** - See the [Applications](#applications) table above

4. **Follow the app's README** - Each app has detailed setup instructions

## Contributing

All applications and microservices must follow the documentation standards defined in `.cursorrules`. This ensures that any engineer or AI can understand and work with each service without external context.

### Quality Checklist

Before submitting changes, ensure:
- [ ] README is updated if behavior changed
- [ ] API contracts are documented
- [ ] Environment variables are listed
- [ ] Edge cases are documented
- [ ] New engineer can understand the service from docs alone
