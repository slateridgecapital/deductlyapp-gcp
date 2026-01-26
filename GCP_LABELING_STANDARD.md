# GCP Resource Labeling Standard

## Overview

All Google Cloud Platform resources in the Deductly project MUST be labeled with a standard set of labels for proper organization, cost tracking, and resource management.

## Required Labels

Every GCP resource must include these four labels:

| Label | Description | Example Values | Required |
|-------|-------------|----------------|----------|
| `app` | Application identifier | `deductly` | ✅ Yes - Always "deductly" |
| `service` | Microservice name | `property-tax-calculator`, `user-service` | ✅ Yes |
| `environment` | Deployment environment | `dev`, `staging`, `prod` | ✅ Yes |
| `managed-by` | Management method | `gcloud`, `terraform`, `console` | ✅ Yes |

## Optional Labels

Add these labels for additional context as needed:

| Label | Description | Example Values |
|-------|-------------|----------------|
| `function` | Specific function name | `scrape-property`, `calculate-tax` |
| `team` | Owning team | `platform`, `product` |
| `cost-center` | Billing code | `engineering`, `marketing` |
| `version` | Service version | `v1`, `v2` |

## Examples by Resource Type

### Cloud Functions

```bash
gcloud functions deploy function-name \
  --gen2 \
  --runtime nodejs20 \
  --trigger-http \
  --region us-central1 \
  --update-labels app=deductly,service=property-tax-calculator,environment=prod,managed-by=gcloud
```

### Secret Manager

```bash
# Create secret with labels
echo -n "secret_value" | gcloud secrets create secret-name \
  --data-file=- \
  --replication-policy=automatic \
  --labels=app=deductly,service=property-tax-calculator,environment=prod,managed-by=gcloud

# Update existing secret labels
gcloud secrets update secret-name \
  --update-labels=app=deductly,service=property-tax-calculator,environment=prod,managed-by=gcloud
```

### Cloud Storage Buckets

```bash
# Create bucket
gcloud storage buckets create gs://bucket-name \
  --location=us-central1 \
  --labels=app=deductly,service=property-tax-calculator,environment=prod,managed-by=gcloud

# Update existing bucket
gcloud storage buckets update gs://bucket-name \
  --update-labels=app=deductly,service=property-tax-calculator,environment=prod,managed-by=gcloud
```

### Firestore Database

```bash
# Create database with labels
gcloud firestore databases create \
  --location=us-central1 \
  --labels=app=deductly,service=property-tax-calculator,environment=prod

# Update existing database
gcloud firestore databases update \
  --update-labels=app=deductly,service=property-tax-calculator,environment=prod
```

### Pub/Sub Topics

```bash
# Create topic with labels
gcloud pubsub topics create topic-name \
  --labels=app=deductly,service=notification-service,environment=prod,managed-by=gcloud

# Update existing topic
gcloud pubsub topics update topic-name \
  --update-labels=app=deductly,service=notification-service,environment=prod,managed-by=gcloud
```

### Service Accounts

```bash
# Create service account
gcloud iam service-accounts create account-name \
  --display-name="Service Account Display Name" \
  --labels=app=deductly,service=property-tax-calculator,environment=prod
```

## Benefits of Proper Labeling

### 1. Cost Tracking & Analysis

Find total costs for Deductly across all resources:

```bash
# View all Deductly resources
gcloud asset search-all-resources \
  --query="labels.app=deductly" \
  --format="table(name,assetType,labels)"

# In Cloud Console, filter billing by label:
# Billing → Reports → Group by: "Labels" → Filter: app=deductly
```

### 2. Resource Discovery

Find all resources for a specific service:

```bash
# Find all property-tax-calculator resources
gcloud asset search-all-resources \
  --query="labels.service=property-tax-calculator" \
  --format="table(name,assetType,labels)"
```

### 3. Environment Isolation

List all production vs development resources:

```bash
# Production resources
gcloud asset search-all-resources \
  --query="labels.environment=prod AND labels.app=deductly"

# Development resources
gcloud asset search-all-resources \
  --query="labels.environment=dev AND labels.app=deductly"
```

### 4. Cleanup & Auditing

Easily identify orphaned or test resources:

```bash
# Find all resources managed by console (manual, may need review)
gcloud asset search-all-resources \
  --query="labels.managed-by=console AND labels.app=deductly"
```

## Verification

### Verify Labels After Deployment

Always verify labels were applied correctly:

```bash
# Cloud Function
gcloud functions describe function-name \
  --region us-central1 \
  --gen2 \
  --format="value(labels)"

# Secret
gcloud secrets describe secret-name --format="value(labels)"

# Storage Bucket
gcloud storage buckets describe gs://bucket-name --format="value(labels)"
```

### Audit All Resources

Run the verification script to check all resources:

```bash
./scripts/verify-gcp-labels.sh
```

## Migration Guide

### Updating Existing Resources

If you have resources without proper labels, update them:

**Cloud Functions:**
```bash
# Redeploy with new labels (preferred)
gcloud functions deploy existing-function \
  --update-labels app=deductly,service=SERVICE_NAME,environment=prod,managed-by=gcloud

# Or update labels only (without redeploying)
gcloud functions update existing-function \
  --update-labels app=deductly,service=SERVICE_NAME,environment=prod,managed-by=gcloud
```

**Secrets:**
```bash
gcloud secrets update secret-name \
  --update-labels=app=deductly,service=SERVICE_NAME,environment=prod,managed-by=gcloud
```

**Storage Buckets:**
```bash
gcloud storage buckets update gs://bucket-name \
  --update-labels=app=deductly,service=SERVICE_NAME,environment=prod,managed-by=gcloud
```

## Enforcement

### Cursor AI Integration

The `.cursorrules` file enforces this labeling standard. When creating or modifying GCP resources, Cursor AI will automatically include the required labels in all `gcloud` commands.

### Manual Deployment Checklist

When deploying manually, verify:

- [ ] All four required labels are present
- [ ] `app=deductly` is set correctly
- [ ] `service` matches the microservice name
- [ ] `environment` is one of: `dev`, `staging`, `prod`
- [ ] `managed-by` reflects the deployment method
- [ ] Labels are verified after deployment

### CI/CD Integration

For automated deployments:

1. Set environment variables in your CI/CD pipeline:
   ```bash
   export GCP_LABELS="app=deductly,service=${SERVICE_NAME},environment=${ENV},managed-by=terraform"
   ```

2. Use variables in deployment commands:
   ```bash
   gcloud functions deploy $FUNCTION_NAME \
     --update-labels $GCP_LABELS
   ```

## Common Mistakes to Avoid

❌ **Inconsistent app name**
```bash
# Wrong
--update-labels app=property-tax,service=calculator

# Right  
--update-labels app=deductly,service=property-tax-calculator
```

❌ **Missing required labels**
```bash
# Wrong
--update-labels app=deductly

# Right
--update-labels app=deductly,service=property-tax-calculator,environment=prod,managed-by=gcloud
```

❌ **Invalid environment values**
```bash
# Wrong
--update-labels environment=production,environment=test

# Right
--update-labels environment=prod  # or dev, staging
```

## Label Naming Conventions

### Service Names

Use the full microservice name with hyphens:

✅ Good:
- `property-tax-calculator`
- `user-authentication-service`
- `notification-service`

❌ Bad:
- `calculator` (too generic)
- `property_tax_calculator` (underscores)
- `propertyTaxCalc` (camelCase)

### Environment Values

Use standardized short names:

| Environment | Label Value |
|-------------|-------------|
| Development | `dev` |
| Staging/QA | `staging` |
| Production | `prod` |

### Managed-By Values

| Method | Label Value | When to Use |
|--------|-------------|-------------|
| gcloud CLI | `gcloud` | Manual deployment via CLI |
| Terraform | `terraform` | Infrastructure as Code |
| Cloud Console | `console` | Manual via web UI |
| CI/CD | `cicd` | Automated pipeline |

## Updates Made

The following files have been updated to include the new labeling standard:

### Cursor Rules
- `.cursorrules` - Added comprehensive GCP labeling section with examples

### Deployment Scripts
- `apps/property-tax-reduction/services/calculator/scripts/deploy-scrape.sh` - Updated labels

### Documentation
- `apps/property-tax-reduction/services/calculator/README.md` - Updated all gcloud commands
- `apps/property-tax-reduction/services/calculator/GCP_SETUP_GUIDE.md` - Updated labels and documentation
- `apps/property-tax-reduction/services/calculator/ZILLOW_SCRAPER_SETUP.md` - Updated deployment commands

### Verification Tools
- `scripts/verify-gcp-labels.sh` - New script to audit all GCP resources

## Next Steps

1. **Run Verification**: Execute `./scripts/verify-gcp-labels.sh` to check existing resources
2. **Update Non-Compliant Resources**: Use the migration guide above to fix any resources missing labels
3. **Update Future Services**: When creating new services, always include all required labels
4. **Document Service Names**: Maintain a list of service names for consistency

## Support

For questions or issues with labeling:
1. Check this document first
2. Run the verification script to see examples
3. Review the `.cursorrules` file for AI-assisted compliance

---

**Last Updated**: 2025-11-30  
**Version**: 1.0

