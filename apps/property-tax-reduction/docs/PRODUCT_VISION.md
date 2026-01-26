# Property Tax Reduction - Product Vision

## Mission

Empower property owners to understand their property tax burden and identify potential savings opportunities by comparing assessed values against market estimates.

## Product Overview

### Core Value Proposition

Most homeowners don't realize they may be overpaying on property taxes when their assessed value exceeds current market value. This service provides instant visibility into potential tax savings by analyzing the gap between assessed and estimated market values.

### Target Personas

- **Homeowners in declining markets** - Properties in markets with declining or stagnant property values
- **Peak-price buyers** - Recent home buyers who purchased at peak prices
- **Over-assessed properties** - Property owners in areas with aggressive tax assessments
- **Real estate investors** - Managing multiple properties across jurisdictions
- **Cost-conscious homeowners** - Facing financial pressure seeking to reduce expenses

## MVP Application Scope

### User Input

- **Address Entry**: Simple, clean interface for users to input their property address

### Data Retrieved & Displayed

1. **Last Purchase Price**: Historical sale price from public records
2. **Current Assessed Value**: Official value used for tax calculations by local government
3. **Estimated Market Value**: Current market estimate from Zillow or similar service
4. **Property Tax Rate**: Local tax rate (as percentage or per $1,000 of assessed value)

### Calculations Performed

1. **Current 2025 Tax Bill Estimate**
   - Formula: Assessed Value × Property Tax Rate
   - Shows what the user will pay based on current assessment

2. **Reduced 2025 Tax Bill Estimate**
   - Formula: Estimated Market Value × Property Tax Rate
   - Shows what the user would pay if assessment matched market value

3. **Potential Annual Savings**
   - Formula: Current Tax Bill - Reduced Tax Bill
   - Highlights the financial opportunity

### Output Summary

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

## Technical Architecture

### Frontend

- **Framework**: React.js with modern hooks
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks (useState, useEffect)
- **Validation**: Address validation and error handling

### Data Sources & APIs

1. **Property Data**: 
   - Zillow API / Attom Data API / CoreLogic
   - Public records databases
   
2. **Tax Rate Data**:
   - County assessor APIs
   - Tax-rates.org API
   - Manual database of tax rates by jurisdiction

3. **Address Validation**:
   - Google Places API / Smarty Streets
   - Geocoding for accurate address matching

### Key Features

- Single-page application design
- Real-time data fetching and calculation
- Clean, professional UI with clear data visualization
- Mobile-responsive design
- Error handling for invalid addresses or missing data

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

## Design Principles

### Visual Identity

- **Trustworthy**: Professional, data-driven presentation
- **Clear**: No jargon, straightforward calculations
- **Actionable**: Emphasize the savings opportunity
- **Transparent**: Show the math, cite data sources

### UI/UX Guidelines

- Minimal friction: Address entry should be primary CTA
- Progressive disclosure: Show results without overwhelming
- Visual hierarchy: Savings amount is hero metric
- Confidence-building: Display data sources and methodology

## Success Metrics

### MVP Goals

- User can input address and receive results in < 5 seconds
- 90%+ accuracy on property data retrieval
- Clear, understandable presentation of potential savings
- Mobile-friendly responsive design

## Data Requirements

### P0 - Essential MVP Data Points

| Data Field | Source | Required For |
|------------|--------|--------------|
| Property Address | User Input | Property lookup |
| Last Sale Price | Public Records API | Historical context |
| Assessed Value | County Assessor API | Current tax calculation |
| Market Estimate | Zillow/Redfin API | Reduced tax calculation |
| Tax Rate | County/Municipal API | Both calculations |

## Technical Considerations

### MVP API Strategy

- Start with mock data for initial development
- Integrate 1-2 reliable APIs for property data
- Use free tier or trial accounts during MVP phase

### Error Handling (P0)

- Address not found
- Missing data (assessed value, tax rate, etc.)
- API unavailable/timeout

### Legal Disclaimers (P0)

- Not legal or tax advice
- Estimates based on public data
- Users should verify with local assessor

## Competitive Analysis

### Existing Solutions

- **Ownwell**: Automated property tax appeals (Y Combinator backed)
- **Apex Property Tax**: Appeals service with contingency pricing
- **Local Property Tax Consultants**: Traditional appeal services (15-35% of savings)

### Differentiation

- **Self-serve**: Instant visibility without scheduling consultations
- **Free insights**: No upfront cost to see potential savings
- **Transparent**: Show calculations and methodology
- **Fast**: Results in seconds, not weeks
- **Educational**: Help users understand their tax burden

## Roadmap

### Phase 1: MVP (Current)
- [ ] Address input interface
- [ ] Property data retrieval (purchase price, assessed value, market estimate)
- [ ] Property tax rate lookup
- [ ] Tax calculation logic
- [ ] Results display interface
- [ ] Test with sample addresses

### Phase 2: Enhanced Data
- [ ] Multiple property data sources with fallbacks
- [ ] Historical assessed value trends
- [ ] Comparable property analysis
- [ ] Tax rate accuracy improvements

### Phase 3: User Features
- [ ] Save/track multiple properties
- [ ] Appeal deadline reminders
- [ ] Document checklist generator
- [ ] Success probability estimate

### Phase 4: Monetization
- [ ] Premium detailed reports
- [ ] Appeal service referrals
- [ ] Professional advisor connections
- [ ] Portfolio analysis for investors

## Example Calculations

### Scenario 1: Bay Area Homeowner

```
Purchase Price (2020): $1,800,000
Assessed Value (2025): $1,900,000
Market Estimate (2025): $1,650,000
Tax Rate: 1.15%

Current Tax Bill: $21,850
Reduced Tax Bill: $18,975
Annual Savings: $2,875
```

### Scenario 2: Austin Tech Worker

```
Purchase Price (2022): $650,000
Assessed Value (2025): $720,000
Market Estimate (2025): $610,000
Tax Rate: 2.1%

Current Tax Bill: $15,120
Reduced Tax Bill: $12,810
Annual Savings: $2,310
```

### Scenario 3: Florida Retiree

```
Purchase Price (2019): $425,000
Assessed Value (2025): $485,000
Market Estimate (2025): $465,000
Tax Rate: 1.8%

Current Tax Bill: $8,730
Reduced Tax Bill: $8,370
Annual Savings: $360
```

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Status**: Ready for Development




