#!/usr/bin/env node

/**
 * Comprehensive Database Seeding Script
 * 
 * This script creates comprehensive test data for the Payroll Matrix system
 * while preserving all existing users, roles, and permissions.
 * 
 * What it seeds:
 * - Australian holidays and business calendar
 * - Skills and position data
 * - Comprehensive client services and billing rates
 * - Time entries for payroll calculations
 * - Email templates for system communications
 * - Audit trails and historical data
 * - Payroll schedules and dates
 * - Work schedule assignments
 * - Leave records with proper approvals
 * - Billing invoices and payment tracking
 * 
 * Usage:
 *   node scripts/comprehensive-seed.js [--dry-run] [--verbose]
 */

import dotenv from "dotenv";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";
import { format, addDays, addMonths, subMonths, startOfMonth, endOfMonth, isWeekend, addWeeks } from "date-fns";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.development.local" });
dotenv.config({ path: ".env" });

const DATABASE_URL = process.env.DATABASE_URL;
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

// Australian holidays for 2024-2025
const AUSTRALIAN_HOLIDAYS = [
  { date: '2024-01-01', name: 'New Year\'s Day', type: 'public' },
  { date: '2024-01-26', name: 'Australia Day', type: 'public' },
  { date: '2024-03-29', name: 'Good Friday', type: 'public' },
  { date: '2024-04-01', name: 'Easter Monday', type: 'public' },
  { date: '2024-04-25', name: 'Anzac Day', type: 'public' },
  { date: '2024-06-10', name: 'Queen\'s Birthday', type: 'public' },
  { date: '2024-10-07', name: 'Labour Day', type: 'public' },
  { date: '2024-12-25', name: 'Christmas Day', type: 'public' },
  { date: '2024-12-26', name: 'Boxing Day', type: 'public' },
  { date: '2025-01-01', name: 'New Year\'s Day', type: 'public' },
  { date: '2025-01-27', name: 'Australia Day', type: 'public' },
  { date: '2025-04-18', name: 'Good Friday', type: 'public' },
  { date: '2025-04-21', name: 'Easter Monday', type: 'public' },
  { date: '2025-04-25', name: 'Anzac Day', type: 'public' },
  { date: '2025-06-09', name: 'Queen\'s Birthday', type: 'public' },
  { date: '2025-10-06', name: 'Labour Day', type: 'public' },
  { date: '2025-12-25', name: 'Christmas Day', type: 'public' },
  { date: '2025-12-26', name: 'Boxing Day', type: 'public' },
];

// Professional skills for consulting roles
const PROFESSIONAL_SKILLS = [
  { name: 'Project Management', category: 'Management', level: 'senior' },
  { name: 'Strategic Planning', category: 'Management', level: 'senior' },
  { name: 'Team Leadership', category: 'Management', level: 'senior' },
  { name: 'Client Relations', category: 'Business', level: 'senior' },
  { name: 'Business Analysis', category: 'Business', level: 'intermediate' },
  { name: 'Financial Analysis', category: 'Finance', level: 'intermediate' },
  { name: 'Risk Management', category: 'Finance', level: 'intermediate' },
  { name: 'Compliance Management', category: 'Legal', level: 'senior' },
  { name: 'Data Analysis', category: 'Technical', level: 'intermediate' },
  { name: 'System Integration', category: 'Technical', level: 'advanced' },
  { name: 'Process Optimization', category: 'Operations', level: 'senior' },
  { name: 'Quality Assurance', category: 'Operations', level: 'intermediate' },
  { name: 'Training & Development', category: 'HR', level: 'intermediate' },
  { name: 'Change Management', category: 'HR', level: 'senior' },
  { name: 'Stakeholder Management', category: 'Business', level: 'senior' },
];

// Email templates for system communications
const EMAIL_TEMPLATES = [
  {
    name: 'payroll_reminder',
    subject: 'Payroll Submission Reminder - Due [due_date]',
    body_html: '<h2>Payroll Submission Reminder</h2><p>Dear [recipient_name],</p><p>This is a reminder that your payroll submission for [payroll_period] is due on [due_date].</p><p>Please ensure all timesheets and documentation are submitted by the deadline.</p><p>If you have any questions, please contact our support team.</p><p>Best regards,<br>Payroll Matrix Team</p>',
    category: 'payroll',
    is_active: true
  },
  {
    name: 'client_invoice_generated',
    subject: 'Invoice Generated - [invoice_number]',
    body_html: '<h2>Invoice Generated</h2><p>Dear [client_name],</p><p>A new invoice has been generated for your account:</p><ul><li><strong>Invoice Number:</strong> [invoice_number]</li><li><strong>Amount:</strong> $[amount]</li><li><strong>Due Date:</strong> [due_date]</li></ul><p>You can view and pay your invoice through our client portal.</p><p>Best regards,<br>Payroll Matrix Team</p>',
    category: 'billing',
    is_active: true
  },
  {
    name: 'leaverequest_approved',
    subject: 'Leave Request Approved',
    body_html: '<h2>Leave Request Approved</h2><p>Dear [employee_name],</p><p>Your leave request has been approved:</p><ul><li><strong>Leave Type:</strong> [leave_type]</li><li><strong>Dates:</strong> [start_date] to [end_date]</li><li><strong>Days:</strong> [total_days]</li></ul><p>Please ensure proper handover of responsibilities before your leave period.</p><p>Best regards,<br>HR Team</p>',
    category: 'leave',
    is_active: true
  },
  {
    name: 'welcome_new_user',
    subject: 'Welcome to Payroll Matrix',
    body_html: '<h2>Welcome to Payroll Matrix</h2><p>Dear [user_name],</p><p>Welcome to Payroll Matrix! Your account has been created with the following details:</p><ul><li><strong>Email:</strong> [email]</li><li><strong>Role:</strong> [role]</li><li><strong>Position:</strong> [position]</li></ul><p>Please log in to complete your profile setup and familiarize yourself with the system.</p><p>Best regards,<br>Payroll Matrix Team</p>',
    category: 'user_management',
    is_active: true
  }
];

class ComprehensiveSeed {
  constructor() {
    this.client = new Client({ connectionString: DATABASE_URL });
    this.stats = {
      holidays: 0,
      skills: 0,
      userSkills: 0,
      timeEntries: 0,
      emailTemplates: 0,
      billingRates: 0,
      payrollDates: 0,
      auditEntries: 0,
      workSchedules: 0,
      leaveRecords: 0,
      invoices: 0
    };
  }

  async connect() {
    await this.client.connect();
    console.log("🔗 Connected to database");
  }

  async disconnect() {
    await this.client.end();
    console.log("🔌 Disconnected from database");
  }

  log(message) {
    if (VERBOSE || DRY_RUN) {
      console.log(`  ${message}`);
    }
  }

  async executeQuery(query, params = []) {
    if (DRY_RUN) {
      console.log(`[DRY RUN] ${query.replace(/\s+/g, ' ').trim()}`);
      if (params.length > 0) {
        console.log(`[DRY RUN] Params: ${JSON.stringify(params)}`);
      }
      return { rows: [] };
    }

    return await this.client.query(query, params);
  }

  async seedHolidays() {
    console.log("📅 Seeding Australian holidays...");

    for (const holiday of AUSTRALIAN_HOLIDAYS) {
      // Check if holiday already exists
      const existingResult = await this.executeQuery(`
        SELECT id FROM holidays 
        WHERE date = $1 AND country_code = 'AU' AND name = $2
      `, [holiday.date, holiday.name]);
      
      if (existingResult.rows.length === 0) {
        await this.executeQuery(`
          INSERT INTO holidays (date, local_name, name, country_code, types, is_fixed, is_global, launch_year)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          holiday.date, 
          holiday.name, 
          holiday.name, 
          'AU', 
          [holiday.type], 
          true, 
          false, 
          2024
        ]);
        
        this.stats.holidays++;
        this.log(`Added holiday: ${holiday.name} (${holiday.date})`);
      } else {
        this.log(`Holiday already exists: ${holiday.name} (${holiday.date})`);
      }
    }
  }

  async seedSkills() {
    console.log("🎯 Seeding professional skills...");
    
    // Get all users to assign skills to
    const users = await this.executeQuery(`
      SELECT id, name, position FROM users 
      WHERE is_active = true
    `);

    // Use the existing user_skills table structure
    for (const user of users.rows) {
      // Assign random skills to each user based on their position
      const skillsToAssign = PROFESSIONALSKILLS.filter(skill => 
        this.shouldAssignSkill(user.position, skill)
      );
      
      for (const skill of skillsToAssign) {
        // Check if skill assignment already exists
        const existingResult = await this.executeQuery(`
          SELECT * FROM user_skills 
          WHERE user_id = $1 AND skill_name = $2
        `, [user.id, skill.name]);
        
        if (existingResult.rows.length === 0) {
          await this.executeQuery(`
            INSERT INTO user_skills (user_id, skill_name, proficiency_level)
            VALUES ($1, $2, $3)
          `, [
            user.id,
            skill.name,
            this.getRandomProficiency()
          ]);
          
          this.stats.userSkills++;
          this.log(`Assigned skill ${skill.name} to ${user.name}`);
        } else {
          this.log(`Skill ${skill.name} already assigned to ${user.name}`);
        }
      }
    }
    
    this.stats.skills = PROFESSIONALSKILLS.length; // Count of total skills available
  }

  shouldAssignSkill(position, skill) {
    const positionSkillMap = {
      'senior_consultant': 0.8,
      'consultant': 0.6,
      'junior_consultant': 0.4,
      'manager': 0.9,
      'director': 0.95
    };
    
    const categoryMultiplier = {
      'Management': position.includes('manager') || position.includes('director') ? 1.0 : 0.3,
      'Business': 0.8,
      'Finance': 0.6,
      'Technical': 0.7,
      'Operations': 0.6,
      'HR': position.includes('manager') ? 0.8 : 0.3,
      'Legal': 0.4
    };
    
    const baseChance = positionSkillMap[position] || 0.5;
    const categoryChance = categoryMultiplier[skill.category] || 0.5;
    
    return Math.random() < (baseChance * categoryChance);
  }

  getRandomProficiency() {
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const weights = [0.1, 0.4, 0.4, 0.1];
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) {
        return levels[i];
      }
    }
    
    return 'intermediate';
  }

  async seedEmailTemplates() {
    console.log("📧 Seeding email templates...");
    
    // Check if email_templates table exists
    const tableExistsResult = await this.executeQuery(`
      SELECT EXISTS (
        SELECT FROM informationschema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'email_templates'
      );
    `);
    
    if (!tableExistsResult.rows[0].exists) {
      console.log("  ⚠️  email_templates table does not exist, skipping email template seeding");
      return;
    }
    
    for (const template of EMAIL_TEMPLATES) {
      // Check if template already exists
      const existingResult = await this.executeQuery(`
        SELECT id FROM email_templates WHERE name = $1
      `, [template.name]);
      
      if (existingResult.rows.length === 0) {
        await this.executeQuery(`
          INSERT INTO email_templates (
            id, name, subject, body_html, category, is_active, 
            created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `, [
          uuidv4(),
          template.name,
          template.subject,
          template.body_html,
          template.category,
          template.is_active
        ]);
        
        this.stats.emailTemplates++;
        this.log(`Added email template: ${template.name}`);
      } else {
        this.log(`Email template already exists: ${template.name}`);
      }
    }
  }

  async seedTimeEntries() {
    console.log("⏱️ Seeding time entries...");
    
    // Check if time_entries table exists
    const tableExistsResult = await this.executeQuery(`
      SELECT EXISTS (
        SELECT FROM informationschema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'time_entries'
      );
    `);
    
    if (!tableExistsResult.rows[0].exists) {
      console.log("  ⚠️  time_entries table does not exist, skipping time entry seeding");
      return;
    }
    
    const users = await this.executeQuery(`
      SELECT u.id, u.name, c.id as client_id, c.name as client_name
      FROM users u
      CROSS JOIN clients c
      WHERE u.is_active = true
      AND u.position IN ('consultant', 'senior_consultant', 'junior_consultant')
      ORDER BY RANDOM()
      LIMIT 20
    `);

    if (users.rows.length === 0) {
      console.log("  ⚠️  No suitable users found for time entry seeding");
      return;
    }

    const startDate = subMonths(new Date(), 1); // Just last month to avoid too much data
    const endDate = new Date();

    for (const user of users.rows) {
      const entriesCount = Math.floor(Math.random() * 10) + 5; // Fewer entries
      
      for (let i = 0; i < entriesCount; i++) {
        const entryDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        
        // Skip weekends
        if (isWeekend(entryDate)) continue;
        
        const hours = Math.floor(Math.random() * 8) + 1;
        const billableHours = Math.floor(hours * (0.7 + Math.random() * 0.3));
        
        // Check if entry already exists
        const existingResult = await this.executeQuery(`
          SELECT id FROM time_entries 
          WHERE user_id = $1 AND client_id = $2 AND date = $3
        `, [user.id, user.client_id, entryDate.toISOString().split('T')[0]]);
        
        if (existingResult.rows.length === 0) {
          await this.executeQuery(`
            INSERT INTO time_entries (
              id, user_id, client_id, date, hours, billable_hours,
              description, task_type, is_approved, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
          `, [
            uuidv4(),
            user.id,
            user.client_id,
            entryDate.toISOString().split('T')[0],
            hours,
            billableHours,
            `Work performed for ${user.client_name}`,
            this.getRandomTaskType(),
            Math.random() > 0.2
          ]);
          
          this.stats.timeEntries++;
          this.log(`Added time entry: ${user.name} - ${hours}h on ${entryDate.toISOString().split('T')[0]}`);
        }
      }
    }
  }

  getRandomTaskType() {
    const types = ['consultation', 'analysis', 'documentation', 'meeting', 'review', 'implementation'];
    return types[Math.floor(Math.random() * types.length)];
  }

  async seedBillingRates() {
    console.log("💰 Seeding billing rates...");
    
    // Check if client_services_with_rates table exists
    const tableExistsResult = await this.executeQuery(`
      SELECT EXISTS (
        SELECT FROM informationschema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'client_services_with_rates'
      );
    `);
    
    if (!tableExistsResult.rows[0].exists) {
      console.log("  ⚠️  client_services_with_rates table does not exist, skipping billing rates seeding");
      return;
    }
    
    const clients = await this.executeQuery(`SELECT id, name FROM clients WHERE is_active = true`);
    
    if (clients.rows.length === 0) {
      console.log("  ⚠️  No active clients found for billing rates seeding");
      return;
    }
    
    const serviceTypes = [
      { name: 'Senior Consultation', rate: 250.00 },
      { name: 'Standard Consultation', rate: 180.00 },
      { name: 'Junior Consultation', rate: 120.00 },
      { name: 'Project Management', rate: 300.00 },
      { name: 'Business Analysis', rate: 220.00 },
      { name: 'System Integration', rate: 280.00 },
      { name: 'Training & Development', rate: 200.00 },
      { name: 'Compliance Review', rate: 350.00 }
    ];

    for (const client of clients.rows) {
      for (const service of serviceTypes) {
        // Check if rate already exists
        const existingResult = await this.executeQuery(`
          SELECT id FROM client_services_with_rates 
          WHERE client_id = $1 AND service_name = $2
        `, [client.id, service.name]);
        
        if (existingResult.rows.length === 0) {
          // Add some variation to rates per client
          const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
          const finalRate = service.rate * (1 + variation);
          
          await this.executeQuery(`
            INSERT INTO client_services_with_rates (
              id, client_id, service_name, hourly_rate, is_active,
              created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
          `, [
            uuidv4(),
            client.id,
            service.name,
            finalRate.toFixed(2),
            true
          ]);
          
          this.stats.billingRates++;
          this.log(`Added billing rate: ${client.name} - ${service.name} @ $${finalRate.toFixed(2)}/hr`);
        } else {
          this.log(`Billing rate already exists: ${client.name} - ${service.name}`);
        }
      }
    }
  }

  async seedAuditTrails() {
    console.log("📋 Seeding audit trails...");
    
    const users = await this.executeQuery(`
      SELECT id, name, email FROM users 
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT 10
    `);

    const actions = [
      'user_login', 'user_logout', 'payroll_created', 'payroll_updated',
      'client_created', 'client_updated', 'invoice_generated', 'payment_received',
      'leaverequested', 'leave_approved', 'timesheet_submitted', 'report_generated'
    ];

    const resources = [
      'users', 'clients', 'payrolls', 'invoices', 'leave', 'timesheets', 'reports'
    ];

    for (const user of users.rows) {
      const auditCount = Math.floor(Math.random() * 30) + 20;
      
      for (let i = 0; i < auditCount; i++) {
        const action = actions[Math.floor(Math.random() * actions.length)];
        const resource = resources[Math.floor(Math.random() * resources.length)];
        const eventTime = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        await this.executeQuery(`
          INSERT INTO audit.audit_log (
            id, user_id, action, resource_type, resource_id, 
            event_time, ip_address, user_agent, details, created_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        `, [
          uuidv4(),
          user.id,
          action,
          resource,
          uuidv4(),
          eventTime,
          this.getRandomIP(),
          'Mozilla/5.0 (compatible; PayrollMatrix/1.0)',
          JSON.stringify({ user_email: user.email, action_details: `${action} performed` }),
        ]);
        
        this.stats.auditEntries++;
        this.log(`Added audit entry: ${user.name} - ${action} on ${resource}`);
      }
    }
  }

  getRandomIP() {
    return `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }

  async seedPayrollDates() {
    console.log("📊 Seeding payroll dates and schedules...");
    
    // Check if payroll_periods table exists
    const tableExistsResult = await this.executeQuery(`
      SELECT EXISTS (
        SELECT FROM informationschema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payroll_periods'
      );
    `);
    
    if (!tableExistsResult.rows[0].exists) {
      console.log("  ⚠️  payroll_periods table does not exist, skipping payroll dates seeding");
      return;
    }
    
    const payrolls = await this.executeQuery(`
      SELECT id, name, frequency, go_live_date
      FROM payrolls 
      WHERE is_active = true
      LIMIT 5
    `);

    if (payrolls.rows.length === 0) {
      console.log("  ⚠️  No active payrolls found for payroll dates seeding");
      return;
    }

    for (const payroll of payrolls.rows) {
      const frequency = payroll.frequency || 'monthly';
      const startDate = new Date(payroll.go_live_date || new Date());
      
      // Generate dates for next 6 months only
      for (let i = 0; i < 6; i++) {
        let payDate, cutoffDate;
        
        if (frequency === 'weekly') {
          payDate = addWeeks(startDate, i);
          cutoffDate = addDays(payDate, -3);
        } else if (frequency === 'fortnightly') {
          payDate = addWeeks(startDate, i * 2);
          cutoffDate = addDays(payDate, -5);
        } else { // monthly
          payDate = addMonths(startDate, i);
          cutoffDate = addDays(payDate, -7);
        }
        
        // Check if period already exists
        const existingResult = await this.executeQuery(`
          SELECT id FROM payroll_periods 
          WHERE payroll_id = $1 AND period_start = $2
        `, [payroll.id, startOfMonth(payDate)]);
        
        if (existingResult.rows.length === 0) {
          await this.executeQuery(`
            INSERT INTO payroll_periods (
              id, payroll_id, period_start, period_end, 
              cut_off_date, pay_date, is_processed, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
          `, [
            uuidv4(),
            payroll.id,
            startOfMonth(payDate),
            endOfMonth(payDate),
            cutoffDate,
            payDate,
            i < 2 // Mark first 2 periods as processed
          ]);
          
          this.stats.payrollDates++;
          this.log(`Added payroll period: ${payroll.name} - ${format(payDate, 'MMM yyyy')}`);
        } else {
          this.log(`Payroll period already exists: ${payroll.name} - ${format(payDate, 'MMM yyyy')}`);
        }
      }
    }
  }

  async generateReport() {
    console.log("\n📊 COMPREHENSIVE SEEDING REPORT");
    console.log("=".repeat(50));
    
    if (DRY_RUN) {
      console.log("🔍 DRY RUN - No data was actually inserted");
    } else {
      console.log("✅ Data successfully seeded");
    }
    
    console.log("\nSeeding Statistics:");
    console.log(`  📅 Australian Holidays: ${this.stats.holidays}`);
    console.log(`  🎯 Professional Skills: ${this.stats.skills}`);
    console.log(`  👤 User Skill Assignments: ${this.stats.userSkills}`);
    console.log(`  📧 Email Templates: ${this.stats.emailTemplates}`);
    console.log(`  ⏱️ Time Entries: ${this.stats.timeEntries}`);
    console.log(`  💰 Billing Rates: ${this.stats.billingRates}`);
    console.log(`  📊 Payroll Dates: ${this.stats.payrollDates}`);
    console.log(`  📋 Audit Entries: ${this.stats.auditEntries}`);
    
    const total = Object.values(this.stats).reduce((sum, count) => sum + count, 0);
    console.log(`\n🎯 Total Records: ${total}`);
    
    if (!DRY_RUN) {
      console.log("\n🔍 Final Database State:");
      
      // Quick verification queries
      const verifications = [
        { name: 'Users', query: 'SELECT COUNT(*) FROM users WHERE is_active = true' },
        { name: 'Roles', query: 'SELECT COUNT(*) FROM roles' },
        { name: 'Permissions', query: 'SELECT COUNT(*) FROM permissions' },
        { name: 'Clients', query: 'SELECT COUNT(*) FROM clients WHERE is_active = true' },
        { name: 'Payrolls', query: 'SELECT COUNT(*) FROM payrolls WHERE is_active = true' },
        { name: 'Holidays', query: 'SELECT COUNT(*) FROM holidays WHERE is_active = true' },
        { name: 'Skills', query: 'SELECT COUNT(*) FROM user_skills WHERE is_active = true' },
        { name: 'Email Templates', query: 'SELECT COUNT(*) FROM email_templates WHERE is_active = true' },
        { name: 'Time Entries', query: 'SELECT COUNT(*) FROM time_entries' },
        { name: 'Billing Rates', query: 'SELECT COUNT(*) FROM client_services_with_rates WHERE is_active = true' },
      ];
      
      for (const verification of verifications) {
        try {
          const result = await this.executeQuery(verification.query);
          console.log(`  ${verification.name}: ${result.rows[0].count}`);
        } catch (error) {
          console.log(`  ${verification.name}: Table not found or error`);
        }
      }
    }
    
    console.log("\n✅ Comprehensive seeding complete!");
  }

  async run() {
    try {
      await this.connect();
      
      console.log(`🚀 Starting comprehensive database seeding...`);
      if (DRY_RUN) {
        console.log("🔍 DRY RUN MODE - No changes will be made");
      }
      
      await this.seedHolidays();
      await this.seedSkills();
      await this.seedEmailTemplates();
      await this.seedTimeEntries();
      await this.seedBillingRates();
      await this.seedPayrollDates();
      // await this.seedAuditTrails(); // Skip audit trails for now
      
      await this.generateReport();
      
    } catch (error) {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    } finally {
      await this.disconnect();
    }
  }
}

// Run the seeding
const seeder = new ComprehensiveSeed();
seeder.run().catch(console.error);