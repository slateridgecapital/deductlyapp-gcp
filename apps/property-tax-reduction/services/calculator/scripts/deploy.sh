#!/bin/bash
# Deploy Property Tax Service
# Cloud Function Name: property-tax-service
# 
# Usage: ./scripts/deploy.sh
# 
# Prerequisites:
# 1. gcloud CLI authenticated: gcloud auth login
# 2. Project set: gcloud config set project deductlyapp
# 3. APIs enabled: cloudfunctions, firestore, secretmanager
# 4. Secret created: property-tax-apify-api-key
#
# Endpoints after deployment:
# - POST /calculate (default) - Calculate property tax savings
# - POST /scrape - Scrape property data only

set -e

# Configuration
FUNCTION_NAME="property-tax-service"
REGION="us-central1"
PROJECT_ID="deductlyapp"

echo "🚀 Deploying ${FUNCTION_NAME} to ${PROJECT_ID}..."
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "❌ Error: Not authenticated with gcloud"
    echo "Run: gcloud auth login"
    exit 1
fi

# Deploy the function
gcloud functions deploy $FUNCTION_NAME \
  --gen2 \
  --runtime=nodejs20 \
  --region=$REGION \
  --source=. \
  --entry-point=handleRequest \
  --trigger-http \
  --timeout=120s \
  --memory=512MB \
  --max-instances=10 \
  --set-env-vars "GCP_PROJECT_ID=${PROJECT_ID},NODE_ENV=production,CACHE_TTL_DAYS=30,ENABLE_CACHE=true" \
  --set-secrets="APIFY_API_KEY=property-tax-apify-api-key:latest" \
  --update-labels "app=deductly,service=property-tax-calculator,environment=prod,managed-by=gcloud" \
  --project=$PROJECT_ID

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔗 Function URL:"
echo "   https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}"
echo ""
echo "📊 View logs:"
echo "   gcloud functions logs read ${FUNCTION_NAME} --region=${REGION} --project=${PROJECT_ID}"
echo ""
echo "🧪 Test the calculate endpoint (default):"
echo "   curl -X POST https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME} \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -H \"Authorization: Bearer \$(gcloud auth print-identity-token)\" \\"
echo "     -d '{\"address\": \"401 Harrison St, Unit 11G, San Francisco, CA\"}'"
echo ""
echo "🧪 Test the scrape endpoint:"
echo "   curl -X POST https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${FUNCTION_NAME}/scrape \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -H \"Authorization: Bearer \$(gcloud auth print-identity-token)\" \\"
echo "     -d '{\"address\": \"401 Harrison St, Unit 11G, San Francisco, CA\"}'"
echo ""

