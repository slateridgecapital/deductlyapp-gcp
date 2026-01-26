#!/bin/bash
# Test script for property-tax-service (local)
# Usage: ./test-local.sh [endpoint] [address]
#
# Examples:
#   ./test-local.sh calculate "401 Harrison St #11G, San Francisco, CA 94105"
#   ./test-local.sh scrape "401 Harrison St #11G, San Francisco, CA 94105"

ENDPOINT="${1:-calculate}"
ADDRESS="${2:-401 Harrison St #11G, San Francisco, CA 94105}"
BASE_URL="http://localhost:8080"

# Determine URL based on endpoint
if [ "$ENDPOINT" = "scrape" ]; then
  URL="${BASE_URL}/scrape"
else
  URL="${BASE_URL}/calculate"
fi

echo "🧪 Testing ${ENDPOINT} endpoint..."
echo "📍 Address: ${ADDRESS}"
echo "🔗 URL: ${URL}"
echo ""

curl -s -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d "{\"address\": \"$ADDRESS\"}" \
  | jq '.'

echo ""
echo "✅ Test complete!"

