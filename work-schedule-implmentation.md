⎿ Work Schedule Implementation Plan: Consultant Capacity Management with Position-Based Admin Time

    Document Overview

    This detailed implementation plan outlines the development of a comprehensive consultant capacity management system that integrates work schedules with payroll
    processing, accounting for organizational positions and admin time allocation to optimize remote consultant workload allocation.

    Business Requirements Summary

    Core Problem Statement

    - Remote consultants have flexible schedules (set days/hours, no fixed start/end times)
    - Different organizational positions require different admin time allocations
    - Payrolls have processing time requirements and deadline constraints
    - Managers need visibility into realistic consultant capacity vs. workload for optimal assignment
    - System must prevent overallocation and identify scheduling conflicts before they impact EFT dates

    Organizational Structure

    Business Positions (New):
    - Consultant (10-15% admin time)
    - Senior Consultant (15-20% admin time)
    - Manager (40-50% admin time)
    - Senior Manager (50-60% admin time)
    - Partner (60-70% admin time)
    - Senior Partner (70-80% admin time)

    System Access Roles (Existing):
    - viewer, consultant, manager, org_admin, developer (for permissions only)

    Success Metrics

    - 100% visibility into realistic consultant capacity utilization accounting for admin time
    - Position-appropriate admin time allocation and tracking
    - Automated detection of workload conflicts
    - Optimized payroll assignments based on actual consultant availability
    - Zero missed EFT dates due to scheduling conflicts

    Database Schema Enhancements Required

    1. Add Position Field to Users Table

    -- Add organizational position to users table
    ALTER TABLE users ADD COLUMN position VARCHAR(20)
      CHECK (position IN ('consultant', 'senior_consultant', 'manager', 'senior_manager', 'partner', 'senior_partner'));

    -- Set default admin time percentages by position
    ALTER TABLE users ADD COLUMN default_admin_time_percentage DECIMAL(5,2) DEFAULT 15.0;

    -- Migration to set existing users' positions based on current roles (temporary)
    UPDATE users SET
      position = CASE
        WHEN role = 'consultant' THEN 'consultant'
        WHEN role = 'manager' THEN 'manager'
        WHEN role = 'org_admin' THEN 'senior_manager'
        WHEN role = 'developer' THEN 'senior_consultant'
        ELSE 'consultant'
      END,
      default_admin_time_percentage = CASE
        WHEN role = 'consultant' THEN 15.0
        WHEN role = 'manager' THEN 45.0
        WHEN role = 'org_admin' THEN 55.0
        WHEN role = 'developer' THEN 20.0
        ELSE 15.0
      END;

    2. Enhance Work Schedules with Admin Time

    -- Add admin time tracking to work schedules
    ALTER TABLE work_schedules ADD COLUMN admin_time_hours DECIMAL(4,2) DEFAULT 0;
    ALTER TABLE work_schedules ADD COLUMN payroll_capacity_hours DECIMAL(4,2);
    ALTER TABLE work_schedules ADD COLUMN uses_default_admin_time BOOLEAN DEFAULT true;

    -- Create calculated field for payroll capacity
    -- payroll_capacity_hours = work_hours - admin_time_hours

    3. Position-Based Admin Time Configuration

    -- Table for default admin time by position (for easy management)
    CREATE TABLE position_admin_defaults (
      position VARCHAR(20) PRIMARY KEY,
      default_admin_percentage DECIMAL(5,2) NOT NULL,
      description TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Insert default values
    INSERT INTO position_admin_defaults VALUES
      ('consultant', 12.5, 'Basic admin tasks, team meetings', NOW()),
      ('senior_consultant', 17.5, 'Admin tasks plus mentoring junior staff', NOW()),
      ('manager', 45.0, 'Team management, client meetings, planning', NOW()),
      ('senior_manager', 55.0, 'Strategic management, multiple teams', NOW()),
      ('partner', 65.0, 'Business development, client relations, strategy', NOW()),
      ('senior_partner', 75.0, 'Executive duties, firm management, partnerships', NOW());

    Technical Architecture Assessment

    Enhanced Capacity Calculation Logic

    // New capacity calculation with admin time
    interface CapacityCalculation {
      totalWorkHours: number;
      adminTimeHours: number;
      payrollCapacityHours: number;
      currentlyAssignedHours: number;
      availableCapacityHours: number;
      utilizationPercentage: number;
      adminTimeSource: 'default' | 'custom';
    }

    // Calculation formula
    const calculateCapacity = (workHours: number, position: string, customAdminHours?: number) => {
      const adminHours = customAdminHours ?? (workHours * getDefaultAdminPercentage(position) / 100);
      const payrollCapacity = workHours - adminHours;
      return {
        totalWorkHours: workHours,
        adminTimeHours: adminHours,
        payrollCapacityHours: payrollCapacity,
        adminTimeSource: customAdminHours ? 'custom' : 'default'
      };
    };

    Development Phases

    Phase 1: Database & Core Infrastructure (Days 1-2)

    1.1 Database Schema Migration

    Location: database/migrations/add_position_and_admin_time.sql
    Deliverables:
    - Add position field to users table with enum constraint
    - Add default_admin_time_percentage to users
    - Create position_admin_defaults configuration table
    - Add admin time fields to work_schedules table
    - Migration script to set existing user positions

    1.2 GraphQL Schema Updates

    Location: shared/schema/schema.graphql (auto-generated after DB changes)
    New Types:
    enum UserPosition {
      consultant
      senior_consultant
      manager
      senior_manager
      partner
      senior_partner
    }

    type PositionAdminDefault {
      position: UserPosition!
      defaultAdminPercentage: Float!
      description: String
    }

    extend type users {
      position: UserPosition
      defaultAdminTimePercentage: Float
    }

    extend type workSchedules {
      adminTimeHours: Float
      payrollCapacityHours: Float
      usesDefaultAdminTime: Boolean
    }

    1.3 Enhanced Capacity Calculation Service

    Location: domains/work-schedule/services/enhanced-capacity-calculator.ts
    Deliverables:
    - calculateConsultantCapacityWithAdmin(userId, startDate, endDate) - Returns realistic capacity
    - getPositionAdminDefaults() - Get admin time by position
    - updateAdminTimeAllocation(userId, workDay, adminHours) - Custom admin time override
    - getEffectiveAdminTime(userId, workDay) - Get actual admin time (default or custom)

    Phase 2: Position Management & Admin Time UI (Days 3-5)

    2.1 Position Management Components

    Location: domains/users/components/position-management.tsx
    Features:
    - Position selection dropdown for user profiles
    - Admin time percentage display and override options
    - Position-based capacity visualization
    - Bulk position assignment tools for admin users

    2.2 Enhanced Work Schedule Management

    Location: domains/work-schedule/components/enhanced-schedule-manager.tsx
    Features:
    - Visual breakdown: Total Hours | Admin Time | Payroll Capacity
    - Position-based admin time defaults with override capability
    - Weekly/monthly admin time planning
    - Admin time pattern templates (e.g., "Training Week", "Budget Planning")

    2.3 Admin Time Configuration Dashboard

    Location: domains/work-schedule/components/admin-time-config.tsx
    Features:
    - System-wide admin time percentage management by position
    - Seasonal admin time adjustments (Q1 training, year-end planning)
    - Individual override tracking and reporting
    - Admin time utilization analytics

    Phase 3: Enhanced Capacity Management (Days 6-8)

    3.1 Position-Aware Capacity Dashboard

    Location: domains/work-schedule/components/position-aware-capacity-dashboard.tsx
    Features:
    - Capacity grid showing: Total | Admin | Payroll | Assigned | Available
    - Position-based filtering and grouping
    - Admin time vs. payroll time utilization tracking
    - Realistic workload recommendations

    3.2 Smart Assignment with Position Intelligence

    Location: domains/work-schedule/components/intelligent-assignment-wizard.tsx
    Features:
    - Position-appropriate workload suggestions
    - Admin time conflict detection
    - Senior staff mentoring time allocation
    - Partner/manager strategic time protection

    3.3 Advanced Analytics & Reporting

    Location: domains/work-schedule/components/position-analytics.tsx
    Reports:
    - Admin time utilization by position
    - Payroll capacity optimization opportunities
    - Position-based productivity metrics
    - Admin time trend analysis and forecasting

    Phase 4: Integration & Optimization (Days 9-10)

    4.1 Payroll Assignment Integration

    Location: domains/payrolls/components/position-aware-assignment.tsx
    Features:
    - Automatic consultant suggestion based on realistic capacity
    - Position-appropriate complexity matching
    - Senior staff review requirements for complex payrolls
    - Workload balancing across position hierarchy

    4.2 Manager Dashboard Enhancement

    Location: domains/work-schedule/components/manager-position-dashboard.tsx
    Features:
    - Team capacity overview with position breakdown
    - Admin time planning and allocation tools
    - Position-based performance tracking
    - Resource planning for different position mixes

    New API Endpoints Required

    Position Management

    // Position management APIs
    GET /api/users/positions - Get all position types and defaults
    PUT /api/users/:id/position - Update user position
    GET /api/admin-time/defaults - Get position-based admin time defaults
    PUT /api/admin-time/defaults/:position - Update default admin time for position

    // Enhanced capacity APIs
    GET /api/work-schedule/capacity-with-admin/:userId - Get realistic capacity
    POST /api/work-schedule/admin-time/override - Set custom admin time
    GET /api/work-schedule/team-capacity-by-position/:managerId - Position-aware team view

    Enhanced GraphQL Queries

    # Position-aware capacity queries
    query GetTeamCapacityByPosition($managerId: uuid!, $startDate: String!, $endDate: String!) {
      teamMembers: users(where: {managerId: {_eq: $managerId}}) {
        id
        name
        position
        defaultAdminTimePercentage
        workSchedules(where: {workDay: {_gte: $startDate, _lte: $endDate}}) {
          workDay
          workHours
          adminTimeHours
          payrollCapacityHours
          usesDefaultAdminTime
        }
        assignedPayrolls: payrolls(where: {primaryConsultantUserId: {_eq: $id}}) {
          processingTime
          # ... other payroll fields
        }
      }
    }

    query GetPositionAdminDefaults {
      positionAdminDefaults {
        position
        defaultAdminPercentage
        description
      }
    }

    query GetConsultantRealisticCapacity($userId: uuid!, $startDate: String!, $endDate: String!) {
      user: userById(id: $userId) {
        position
        defaultAdminTimePercentage
        workSchedules(where: {workDay: {_gte: $startDate, _lte: $endDate}}) {
          workDay
          workHours
          adminTimeHours
          payrollCapacityHours
          usesDefaultAdminTime
        }
      }
    }

    User Experience Design

    Position-Based Workflows

    1. Consultant/Senior Consultant Experience

    - Simple schedule management with minimal admin time
    - Focus on payroll capacity and assignment visibility
    - Clear indication of admin time requirements
    - Mobile-optimized for remote work

    2. Manager/Senior Manager Experience

    - Admin time planning tools for team management
    - Capacity oversight with position-aware insights
    - Workload distribution optimization
    - Strategic time protection features

    3. Partner/Senior Partner Experience

    - High-level capacity analytics and forecasting
    - Strategic time allocation and protection
    - Business development time tracking
    - Executive dashboard with position metrics

    Enhanced Manager Dashboard Features

    - Position Mix Analysis: Optimal team composition recommendations
    - Admin Time Utilization: Track non-payroll time effectiveness
    - Capacity Planning: Position-based resource allocation
    - Development Tracking: Career progression impact on capacity

    Implementation Considerations

    Data Migration Strategy

    1. Phase 1: Add position fields with default values based on current roles
    2. Phase 2: Allow manual position corrections by managers
    3. Phase 3: Implement admin time calculations with position defaults
    4. Phase 4: Enable custom admin time overrides

    Position Default Configuration

    const POSITION_ADMIN_DEFAULTS = {
      consultant: { percentage: 12.5, description: "Basic admin tasks, team meetings" },
      senior_consultant: { percentage: 17.5, description: "Admin tasks plus mentoring" },
      manager: { percentage: 45.0, description: "Team management, client meetings" },
      senior_manager: { percentage: 55.0, description: "Strategic management, multiple teams" },
      partner: { percentage: 65.0, description: "Business development, client relations" },
      senior_partner: { percentage: 75.0, description: "Executive duties, firm management" }
    };

    Performance Optimization

    - Cache position admin defaults to reduce database queries
    - Pre-calculate payroll capacity for common date ranges
    - Optimize position-based queries with proper indexing
    - Implement efficient capacity aggregation algorithms

    Testing Strategy

    Unit Tests

    - Position-based admin time calculations
    - Capacity calculation accuracy with admin time
    - Position validation and defaults
    - Admin time override functionality

    Integration Tests

    - Position change impact on existing schedules
    - Admin time default updates across team
    - Capacity dashboard accuracy with positions
    - Assignment wizard position intelligence

    User Acceptance Tests

    - Position-appropriate capacity recommendations
    - Admin time planning workflows
    - Manager dashboard position features
    - Consultant experience with admin time visibility

    Success Metrics & KPIs

    Capacity Management Accuracy

    - Realistic Capacity: 95%+ accurate capacity calculations including admin time
    - Position Alignment: 90%+ appropriate admin time allocation by position
    - Overallocation Prevention: 100% reduction in impossible assignments
    - Admin Time Utilization: Optimal admin vs. payroll time balance

    Position-Based Insights

    - Workload Distribution: Fair allocation across position hierarchy
    - Admin Time Effectiveness: Measurable admin time ROI by position
    - Career Progression Planning: Position-based capacity evolution tracking
    - Resource Optimization: Position mix recommendations for team efficiency

    Risk Mitigation

    Implementation Risks

    - Data Migration Complexity: Careful validation of position assignments
    - User Adoption: Clear communication of admin time benefits
    - Calculation Accuracy: Extensive testing of capacity algorithms
    - Performance Impact: Optimization of position-based queries

    Business Risks

    - Position Resistance: Change management for new position tracking
    - Admin Time Conflicts: Clear guidelines for admin time allocation
    - Capacity Disputes: Transparent calculation methodology
    - Workload Imbalance: Monitoring tools for fair distribution

    Future Enhancements

    Advanced Position Features

    - Career progression planning with capacity evolution
    - Position-based skill matching for payroll complexity
    - Automated position recommendations based on workload patterns
    - Integration with performance management systems

    Machine Learning Opportunities

    - Predictive admin time requirements by position
    - Optimal position mix recommendations for teams
    - Capacity forecasting with position trend analysis
    - Automated workload optimization across position hierarchy

    This comprehensive plan transforms the work schedule system into a sophisticated position-aware capacity management platform that accurately reflects the reality of
    different organizational roles and their varying admin time requirements.
