# GCP Setup & Deployment Guide
## Property Tax Calculator - Scrape Property Function

This guide walks you through setting up Google Cloud Platform resources and deploying your scrape property function.

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Google Cloud SDK installed**
   ```bash
   # Check if installed
   gcloud --version
   
   # If not installed, visit: https://cloud.google.com/sdk/docs/install
   ```

2. **Authenticated with GCP**
   ```bash
   gcloud auth login
   ```

3. **Project configured**
   ```bash
   gcloud config set project deductlyapp
   ```

4. **Apify API Key**
   - Sign up at https://apify.com
   - Get your API key from https://console.apify.com/account/integrations

---

## 🔧 One-Time GCP Setup

### Step 1: Enable Required APIs

```bash
# Enable Cloud Functions, Firestore, and Secret Manager
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Step 2: Create Firestore Database

```bash
# Create Firestore database in us-central1
gcloud firestore databases create --location=us-central1
```

### Step 3: Store Apify API Key in Secret Manager

```bash
# Replace YOUR_ACTUAL_APIFY_API_KEY with your real key
echo -n "YOUR_ACTUAL_APIFY_API_KEY" | gcloud secrets create property-tax-apify-api-key \
  --data-file=- \
  --replication-policy="automatic" \
  --labels=app=deductly,service=property-tax-calculator,environment=prod,managed-by=gcloud
```

### Step 4: Grant Cloud Functions Access to Secret

```bash
# Allow Cloud Functions to read the secret
gcloud secrets add-iam-policy-binding property-tax-apify-api-key \
  --member="serviceAccount:deductlyapp@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 🚀 Deploy the Function

Once setup is complete, deploy using the provided script:

```bash
# From the calculator directory
cd apps/property-tax-reduction/services/calculator

# Run deployment script
npm run deploy:scrape

# Or directly:
./scripts/deploy-scrape.sh
```

### Expected Output

```
🚀 Deploying property-tax-calculator-scrape-property to deductlyapp...

Deploying function (may take a while - up to 2 minutes)...
✓ Function deployed successfully

✅ Deployment complete!

🔗 Function URL:
   https://us-central1-deductlyapp.cloudfunctions.net/property-tax-calculator-scrape-property
```

---

## 🧪 Test the Deployment

### Using curl

```bash
curl -X POST https://us-central1-deductlyapp.cloudfunctions.net/property-tax-calculator-scrape-property \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main St, San Francisco, CA 94102"}'
```

### Expected Response (First Call - Cache Miss)

```json
{
  "success": true,
  "data": {
    "address": "123 Main St, San Francisco, CA 94102",
    "zestimate": 1500000,
    "purchaseHistory": [...],
    "taxHistory": [...]
  },
  "metadata": {
    "requestId": "req_1234567890_abc123",
    "cacheHit": false,
    "scrapedAt": "2025-01-15T10:30:00.000Z",
    "scrapeCount": 1,
    "cacheTtlDays": 30,
    "latencyMs": 15234
  }
}
```

### Expected Response (Second Call Within 30 Days - Cache Hit)

```json
{
  "success": true,
  "data": {
    "address": "123 Main St, San Francisco, CA 94102",
    "zestimate": 1500000,
    "purchaseHistory": [...],
    "taxHistory": [...]
  },
  "metadata": {
    "requestId": "req_1234567891_def456",
    "cacheHit": true,
    "scrapedAt": "2025-01-15T10:30:00.000Z",
    "scrapeCount": 1,
    "cacheTtlDays": 30,
    "latencyMs": 234
  }
}
```

---

## 📊 Monitoring & Logs

### View Function Logs

```bash
# Real-time logs
gcloud functions logs read property-tax-calculator-scrape-property \
  --region=us-central1 \
  --limit=50

# Follow logs (live tail)
gcloud functions logs read property-tax-calculator-scrape-property \
  --region=us-central1 \
  --limit=50 \
  --follow
```

### View in Cloud Console

1. Go to https://console.cloud.google.com/functions
2. Select `property-tax-calculator-scrape-property`
3. Click "LOGS" tab

### Check Firestore Data

1. Go to https://console.cloud.google.com/firestore
2. Navigate to `property_tax_properties` collection
3. Click on a document to see stored data and `scrapes/` subcollection

---

## 🔄 Version History

The system stores version history automatically:

### Firestore Structure

```
property_tax_properties/
  └─ 123-main-st-san-francisco-ca-94102/
      ├─ address: "123 Main St, San Francisco, CA 94102"
      ├─ zestimate: 1500000
      ├─ scrapedAt: Timestamp (latest scrape)
      ├─ scrapeCount: 3
      └─ scrapes/ (subcollection)
          ├─ 1704974400000/ (first scrape)
          ├─ 1707652800000/ (30+ days later)
          └─ 1710331200000/ (30+ days later)
```

### Query Version History

You can query the version history programmatically or through the console to see how property values changed over time.

---

## 🏷️ Resource Labels

All resources are labeled for easy filtering:

- `app=deductly` (Required - identifies all Deductly resources)
- `service=property-tax-calculator` (Required - specific microservice name)
- `environment=prod` (Required - deployment environment)
- `managed-by=gcloud` (Required - management method)
- `function=scrape-property` (Optional - specific function identifier)

Use these labels in GCP Console to filter resources or track costs per app.

**Find all Deductly resources:**
```bash
gcloud asset search-all-resources --query="labels.app=deductly" --format="table(name,labels)"
```

---

## 💰 Cost Estimates

### Expected Monthly Costs (Low Volume)

- **Cloud Functions**: ~$0-5/month (2M invocations free tier)
- **Firestore**: Free (1GB storage + 50K reads + 20K writes free tier)
- **Secret Manager**: $0.06/month per secret
- **Apify**: Varies by usage (check your plan)

### Cost Optimization

- Cache reduces Apify API calls (expensive)
- 30-day TTL balances freshness vs. cost
- Firestore stores only scraped properties (not all lookups)

---

## 🐛 Troubleshooting

### Deployment Fails with "Permission Denied"

```bash
# Ensure you're authenticated
gcloud auth login

# Check active account
gcloud auth list

# Set correct project
gcloud config set project deductlyapp
```

### Function Returns "APIFY_API_KEY is not configured"

```bash
# Verify secret exists
gcloud secrets describe property-tax-apify-api-key

# Check secret value (first 10 chars)
gcloud secrets versions access latest --secret=property-tax-apify-api-key | head -c 10

# Verify IAM permissions
gcloud secrets get-iam-policy property-tax-apify-api-key
```

### Cache Not Working

Check environment variables:
```bash
# View function config
gcloud functions describe property-tax-calculator-scrape-property \
  --region=us-central1 \
  --format="value(environmentVariables)"
```

Expected:
- `ENABLE_CACHE=true`
- `CACHE_TTL_DAYS=30`
- `FIRESTORE_COLLECTION=property_tax_properties`

---

## 🔒 Security Best Practices

1. **Never commit API keys** - Always use Secret Manager
2. **Review IAM permissions** - Grant least privilege access
3. **Enable audit logs** - Track who accesses what
4. **Use HTTPS only** - Function is HTTPS by default
5. **Consider authentication** - Add authentication for production

---

## 📚 Next Steps

1. ✅ Deploy the function
2. ✅ Test with a real address
3. ✅ Monitor logs and costs
4. 🔜 Add authentication (if needed)
5. 🔜 Set up monitoring alerts
6. 🔜 Create CI/CD pipeline
7. 🔜 Build frontend to call this API

---

## 📞 Support

- GCP Documentation: https://cloud.google.com/functions/docs
- Firestore Documentation: https://cloud.google.com/firestore/docs
- Apify Documentation: https://docs.apify.com

---

**Happy deploying! 🎉**


