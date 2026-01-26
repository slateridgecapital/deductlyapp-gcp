# Deployment Summary - Property Tax Calculator Service

## ✅ Successfully Deployed Resources

### 1. Cloud Function: `scrapeProperty`
- **URL**: `https://us-central1-deductlyapp.cloudfunctions.net/scrapeProperty`
- **Runtime**: Node.js 20
- **Memory**: 512MB
- **Timeout**: 120s
- **Region**: us-central1
- **Labels**: `app=deductly`
- **Authentication**: Required (Bearer token)
- **Status**: ✅ Active

### 2. Firestore Database
- **Type**: Firestore Native
- **Location**: us-central1
- **Collection**: `property_tax_properties`
- **TTL**: 30 days
- **Status**: ✅ Active and caching data

### 3. Service Account Permissions
**Compute Service Account**: `965120872458-compute@developer.gserviceaccount.com`
- ✅ `roles/datastore.user` - Firestore read/write
- ✅ `roles/logging.logWriter` - Write logs
- ✅ `roles/artifactregistry.reader` - Read container images
- ✅ `roles/artifactregistry.writer` - Write build artifacts
- ✅ `roles/secretmanager.secretAccessor` - Access secrets

**Cloud Build Service Account**: `965120872458@cloudbuild.gserviceaccount.com`
- ✅ `roles/cloudbuild.builds.builder`
- ✅ `roles/cloudfunctions.developer`
- ✅ `roles/iam.serviceAccountUser`
- ✅ `roles/logging.logWriter`
- ✅ `roles/artifactregistry.writer`
- ✅ `roles/storage.objectViewer`

## 📊 Performance Metrics

### Caching Performance
- **First Call** (scrape): ~11-12 seconds
- **Cached Call**: ~50-100ms
- **Speed Improvement**: **217x faster** with cache

### API Response Structure
```json
{
  "success": true,
  "data": {
    "address": "string",
    "purchaseHistory": [{"date": "YYYY-MM-DD", "price": number}],
    "taxHistory": [{"year": number, "taxPaid": number, "assessedValue": number}],
    "zestimate": number
  },
  "metadata": {
    "requestId": "string",
    "cacheHit": boolean,
    "scrapedAt": "ISO timestamp",
    "scrapeCount": number,
    "cacheTtlDays": 30,
    "latencyMs": number
  }
}
```

## 🔒 Organization Policies Applied

### Constraint: `iam.allowedPolicyMemberDomains`
- **Folder**: 846133094016
- **Effect**: Blocks public access (`allUsers`, `allAuthenticatedUsers`)
- **Allowed Domains**: `slateridgecapital.com`, project service accounts
- **Impact**: Functions require authentication (no `--allow-unauthenticated`)

## 🧪 Testing

### Test Deployed Function
```bash
curl -s -X POST https://us-central1-deductlyapp.cloudfunctions.net/scrapeProperty \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -d '{"address": "123 Main St, San Francisco, CA 94102"}' | python3 -m json.tool
```

### Test Results from Live Addresses

**401 Harrison St APT 11G, San Francisco, CA**
- Purchase History: 2 sales (2020, 2017)
- Tax History: 8 years
- Zestimate: $888,600
- Cache: ✅ Working

**104 Silver Fox, Irvine, CA**
- Purchase History: 1 sale (1998 - $295K)
- Tax History: 13 years
- Zestimate: $2,179,900 (638% appreciation!)
- Assessed Value: $499,795 (only 23% of Zestimate - great tax reduction opportunity!)

**355 1st St UNIT S308, San Francisco, CA**
- Purchase History: 3 sales
- Tax History: 11 years
- Zestimate: $564,500
- Cache: ✅ Working

## 📝 Files Created/Modified

### New Files
- `src/services/zillowScraper.js` - Apify integration (228 lines)
- `src/services/firestoreService.js` - Caching with version history (240 lines)
- `src/handlers/scrapeProperty.js` - HTTP handler (215 lines)
- `test-scrape.sh` - Local testing script
- `ZILLOW_SCRAPER_SETUP.md` - Setup guide
- `DEPLOYMENT_SUMMARY.md` - This file

### Modified Files
- `package.json` - Added apify-client, dev:scrape script
- `index.js` - Wired scrapeProperty endpoint
- `src/config/index.js` - Added Apify config
- `env.template` - Added APIFY_API_KEY
- `README.md` - Complete API documentation

## 🎯 What's Working

✅ Zillow property scraping via Apify  
✅ Address-based property lookup  
✅ Purchase history extraction (all sales)  
✅ Tax history extraction (with raw values)  
✅ Zestimate retrieval  
✅ Firestore caching (30-day TTL)  
✅ Version history tracking  
✅ Authenticated access  
✅ All resources labeled with `app=deductly`  
✅ Deployed to GCP Cloud Functions Gen2  

## 🚀 Next Steps

1. **Integrate with Calculator**: Use scraped data to calculate tax savings
2. **Add More Data Sources**: Implement county assessor APIs for verified data
3. **Add Address Validation**: Integrate Google Places API
4. **Create Front-End**: Build UI to accept address input
5. **Add Monitoring**: Set up alerts and dashboards

## 💰 Cost Tracking

- **Apify**: $0.003 per property scraped ($3 per 1,000)
- **GCP Cloud Functions**: ~$0.40 per million invocations + compute
- **Firestore**: Free tier (50K reads, 20K writes/day)
- **Estimated Cost per Property**: $0.003-0.005 with caching

## 📞 Support

Deployed by: frank.li@slateridgecapital.com  
Project: deductlyapp  
Deployment Date: 2025-11-30  
Version: 1.0.0

