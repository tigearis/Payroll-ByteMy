# Dashboard + GraphQL Alignment Audit Prompt

## Context

I need to audit my dashboard system to ensure all dashboard pages, widgets, and data visualizations are properly aligned with GraphQL operations. The goal is to minimise custom data fetching, optimise performance for large datasets, and leverage GraphQL for efficient dashboard functionality.

## Project Structure to Analyse

```
app/dashboard/               # Dashboard pages/routes
├── overview/
├── payrolls/
├── clients/
├── users/
├── reports/
├── analytics/
└── settings/

components/dashboard/        # Dashboard-specific components
├── widgets/
├── charts/
├── tables/
├── filters/
├── layouts/
└── metrics/

hooks/                      # Dashboard-related hooks
├── use-dashboard-data.ts
├── use-filters.ts
├── use-charts.ts
├── use-metrics.ts
└── use-real-time.ts

lib/dashboard/              # Dashboard utilities
├── chart-config.ts
├── data-transformers.ts
├── export-utils.ts
└── dashboard-store.ts

graphql/                    # GraphQL operations
├── queries/
├── mutations/
├── subscriptions/
└── generated/
```

## Task: Comprehensive Dashboard-GraphQL Audit

### 1. **Dashboard Page Analysis**

For each dashboard page/route, analyse:

#### **Data Requirements Check:**

- What metrics and KPIs are displayed?
- What time ranges and filters are applied?
- What aggregations and calculations are shown?
- What real-time updates are needed?
- What export/download functionality exists?

#### **GraphQL Operation Alignment:**

- Are all metrics fetched via GraphQL queries?
- Are filters and pagination using GraphQL variables?
- Are aggregations done server-side in GraphQL?
- Is real-time data using GraphQL subscriptions?
- Are there any direct database queries bypassing GraphQL?

#### **Performance Patterns:**

- Are large datasets properly paginated?
- Is data being over-fetched (unnecessary fields)?
- Are multiple small queries that could be combined?
- Is caching strategy optimal for dashboard data?

### 2. **Widget/Component Analysis**

For each dashboard widget/component, check:

#### **Data Fetching Strategy:**

- Does it use Apollo hooks efficiently?
- Is it fetching its own data or relying on props?
- Are loading states handled properly for slow queries?
- Is error handling comprehensive?

#### **Real-time Updates:**

- Could static data benefit from subscriptions?
- Are updates triggered efficiently?
- Is data staleness handled properly?
- Are unnecessary re-renders occurring?

#### **Data Transformation:**

- Is data manipulation done client-side unnecessarily?
- Could calculations be moved to GraphQL resolvers?
- Are there expensive operations that could be server-side?
- Is data formatting optimised?

### 3. **Filtering & Search Analysis**

Check filtering and search functionality:

#### **Query Efficiency:**

- Are filters using GraphQL where clauses?
- Is search using proper GraphQL text search?
- Are filter combinations optimised?
- Is debouncing implemented for search inputs?

#### **State Management:**

- Is filter state managed efficiently?
- Are URL parameters synced with GraphQL variables?
- Is filter history/bookmarking supported?
- Are default filters loaded properly?

### 4. **Charts & Visualizations Analysis**

For data visualization components:

#### **Data Pipeline:**

- Is chart data fetched via optimised GraphQL queries?
- Are aggregations done server-side?
- Is data transformed efficiently for charts?
- Are large datasets handled with pagination/windowing?

#### **Performance:**

- Are charts re-rendering unnecessarily?
- Is data memoised properly?
- Are expensive calculations optimised?
- Is lazy loading implemented for complex charts?

### 5. **Reports & Analytics Analysis**

Check reporting functionality:

#### **Data Aggregation:**

- Are reports using GraphQL aggregate queries?
- Is historical data fetched efficiently?
- Are complex calculations done server-side?
- Is report generation optimised?

#### **Export Functionality:**

- Is export data fetched via GraphQL?
- Are large exports handled properly?
- Is pagination used for big datasets?
- Are export formats optimised?

## Analysis Format

### **Page: `[dashboard-page]`**

#### Current Implementation:

- **Data Sources**: All data fetching methods used
- **GraphQL Operations**: Existing queries/mutations/subscriptions
- **Custom Logic**: Non-GraphQL data processing
- **Performance Issues**: Slow queries, over-fetching, etc.

#### Data Requirements:

- **Metrics**: KPIs and calculated values needed
- **Filters**: Available filter options and combinations
- **Time Ranges**: Date/time filtering requirements
- **Aggregations**: Summary and grouping needs
- **Real-time**: Data that should update automatically

#### GraphQL Gaps:

- **Missing Aggregates**: Server-side calculations needed
- **Missing Subscriptions**: Real-time updates required
- **Missing Filters**: GraphQL where clauses needed
- **Schema Enhancements**: New fields/types for efficiency

#### Optimisation Opportunities:

- **Query Combining**: Multiple queries → single efficient query
- **Server-side Calculations**: Move logic from client to GraphQL
- **Subscription Integration**: Add real-time updates
- **Caching Improvements**: Better Apollo cache strategy

### **Widget: `[widget-name]`**

#### Current GraphQL Usage:

- **Query Pattern**: How data is fetched
- **Update Strategy**: How data refreshes
- **Error Handling**: How failures are managed
- **Loading States**: How pending states are shown

#### Performance Analysis:

- **Query Efficiency**: Over-fetching or under-fetching
- **Re-render Frequency**: Unnecessary updates
- **Memory Usage**: Data retention issues
- **Network Requests**: Request frequency and size

#### Recommended Changes:

- **New Operations**: GraphQL operations to create
- **Query Optimisation**: Improvements to existing queries
- **Subscription Addition**: Real-time data integration
- **Code Simplification**: Custom logic to remove

## Expected Deliverables

### 1. **GraphQL Operation Plan**

```
NEW AGGREGATE QUERIES:
- GetPayrollMetrics: KPIs with date range filtering
- GetClientAnalytics: client performance metrics
- GetUserActivityStats: user engagement data

NEW REAL-TIME SUBSCRIPTIONS:
- PayrollStatusUpdates: live status changes
- NotificationUpdates: real-time alerts
- MetricsUpdates: live dashboard metrics

ENHANCED FILTERS:
- PayrollFilters: complex where clauses for payroll data
- DateRangeFilters: optimised time-based filtering
- SearchFilters: full-text search integration

SCHEMA OPTIMISATIONS:
- Add computed fields for common calculations
- Add aggregation fields for dashboard metrics
- Add search indexes for better performance
```

### 2. **Performance Improvements**

```
QUERY OPTIMISATION:
- Combine 5 separate metric queries → 1 dashboard query
- Add pagination to large table views
- Implement query result caching

CLIENT-SIDE REDUCTION:
- Move calculation logic to GraphQL resolvers
- Replace data transformation with server-side formatting
- Eliminate duplicate data fetching

REAL-TIME INTEGRATION:
- Add subscriptions for live metrics
- Implement optimistic updates for user actions
- Add real-time notification system
```

### 3. **Component Refactoring**

```
WIDGET IMPROVEMENTS:
- MetricsWidget: use aggregate queries instead of calculations
- PayrollTable: implement GraphQL pagination
- ClientChart: use subscription for real-time updates

FILTER ENHANCEMENTS:
- FilterBar: integrate with GraphQL variables
- SearchInput: use GraphQL search instead of client filtering
- DatePicker: optimise query patterns

LAYOUT OPTIMISATIONS:
- DashboardGrid: implement lazy loading for widgets
- SidebarMenu: use GraphQL for dynamic menu items
- HeaderStats: combine multiple queries
```

### 4. **Dashboard-Specific Features**

```
CUSTOMISATION:
- User dashboard preferences via GraphQL
- Widget configuration storage
- Layout persistence

EXPORT/REPORTING:
- GraphQL-based report generation
- Streaming exports for large datasets
- Scheduled report subscriptions

ANALYTICS:
- User interaction tracking via GraphQL
- Performance metrics collection
- Usage analytics dashboard
```

## Quality Checks

Ensure recommendations follow:

- **Data Efficiency**: Minimal over-fetching and optimal queries
- **Real-time UX**: Appropriate use of subscriptions
- **Performance First**: Fast loading and smooth interactions
- **Error Resilience**: Graceful degradation and error handling
- **Type Safety**: Generated types throughout dashboard
- **Australian English**: Maintain spelling consistency

## Dashboard-Specific Patterns to Check

- **Metric Calculations**: Server-side vs client-side aggregations
- **Time-series Data**: Efficient handling of historical data
- **Large Datasets**: Pagination and virtualisation strategies
- **Filter Combinations**: Complex where clause optimisation
- **Chart Data**: Optimal data structure for visualizations
- **Export Performance**: Handling large data exports
- **Cache Invalidation**: When to refresh dashboard data
- **Progressive Loading**: Prioritising critical dashboard data

## Performance Benchmarks

Look for opportunities to improve:

- **Query Response Time**: < 500ms for dashboard queries
- **Time to Interactive**: < 2s for dashboard load
- **Memory Usage**: Efficient data retention
- **Bundle Size**: Minimal dashboard-specific code
- **Real-time Latency**: < 100ms for subscription updates

---

**Input Required**:

- All files in `app/dashboard/` directory
- Dashboard components and widgets
- Current GraphQL queries and mutations
- Dashboard-related hooks and utilities
- Any custom data transformation logic
- Performance issues or slow queries identified
