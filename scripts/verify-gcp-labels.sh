#!/bin/bash
# Verify GCP Resource Labeling
# 
# This script checks that all GCP resources in the deductlyapp project
# are properly labeled according to the cursor rules.
#
# Required labels: app=deductly, service=<service-name>, environment=<env>, managed-by=<method>

set -e

PROJECT_ID="deductlyapp"
REGION="us-central1"

echo "🔍 Verifying GCP Resource Labels for project: ${PROJECT_ID}"
echo ""
echo "Required labels:"
echo "  - app=deductly"
echo "  - service=<service-name>"
echo "  - environment=<env>"
echo "  - managed-by=<method>"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    exit 1
fi

# Set project
gcloud config set project $PROJECT_ID > /dev/null 2>&1

# Function to check labels
check_labels() {
    local resource_type=$1
    local resource_name=$2
    local labels=$3
    
    # Check if app=deductly exists
    if [[ $labels == *"app=deductly"* ]]; then
        echo "✅ ${resource_type}: ${resource_name}"
        echo "   Labels: ${labels}"
    else
        echo "❌ ${resource_type}: ${resource_name}"
        echo "   Labels: ${labels}"
        echo "   Missing required label: app=deductly"
    fi
    echo ""
}

# Check Cloud Functions
echo "📦 Cloud Functions (Gen 2):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
functions=$(gcloud functions list --gen2 --region=$REGION --format="value(name)" 2>/dev/null || true)

if [ -z "$functions" ]; then
    echo "ℹ️  No Cloud Functions found"
else
    for func in $functions; do
        labels=$(gcloud functions describe $func --region=$REGION --gen2 --format="value(labels)" 2>/dev/null || echo "none")
        check_labels "Cloud Function" "$func" "$labels"
    done
fi
echo ""

# Check Secrets
echo "🔐 Secret Manager Secrets:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
secrets=$(gcloud secrets list --format="value(name)" 2>/dev/null || true)

if [ -z "$secrets" ]; then
    echo "ℹ️  No secrets found"
else
    for secret in $secrets; do
        labels=$(gcloud secrets describe $secret --format="value(labels)" 2>/dev/null || echo "none")
        check_labels "Secret" "$secret" "$labels"
    done
fi
echo ""

# Check Storage Buckets
echo "🪣 Cloud Storage Buckets:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
buckets=$(gcloud storage buckets list --format="value(name)" 2>/dev/null || true)

if [ -z "$buckets" ]; then
    echo "ℹ️  No storage buckets found"
else
    for bucket in $buckets; do
        labels=$(gcloud storage buckets describe $bucket --format="value(labels)" 2>/dev/null || echo "none")
        check_labels "Storage Bucket" "$bucket" "$labels"
    done
fi
echo ""

# Check Firestore (database level)
echo "🗄️  Firestore:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
firestore_db=$(gcloud firestore databases list --format="value(name)" 2>/dev/null || true)

if [ -z "$firestore_db" ]; then
    echo "ℹ️  No Firestore database found"
else
    labels=$(gcloud firestore databases describe $firestore_db --format="value(labels)" 2>/dev/null || echo "none")
    check_labels "Firestore Database" "$firestore_db" "$labels"
fi
echo ""

# Search all resources with app=deductly label
echo "🌐 All Resources with app=deductly:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Searching for all resources labeled with app=deductly..."
echo ""

gcloud asset search-all-resources \
    --query="labels.app=deductly" \
    --format="table(name,assetType,labels)" \
    2>/dev/null || echo "⚠️  Asset search not available or no resources found"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ Verification complete!"
echo ""
echo "To update labels on a resource:"
echo "  Cloud Function:   gcloud functions deploy <name> --update-labels app=deductly,service=<name>,environment=prod,managed-by=gcloud"
echo "  Secret:           gcloud secrets update <name> --update-labels app=deductly,service=<name>,environment=prod,managed-by=gcloud"
echo "  Storage Bucket:   gcloud storage buckets update gs://<name> --update-labels=app=deductly,service=<name>,environment=prod,managed-by=gcloud"
echo ""

