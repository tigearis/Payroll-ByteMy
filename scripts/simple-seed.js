#!/usr/bin/env node

/**
 * Simple Database Seeding Script
 * 
 * Focuses only on seeding what we know exists and can verify
 */

import dotenv from "dotenv";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

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

class SimpleSeed {
  constructor() {
    this.client = new Client({ connectionString: DATABASE_URL });
    this.stats = {
      holidays: 0,
      skills: 0,
      userSkills: 0,
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

  async seedAdditionalHolidays() {
    console.log("📅 Adding missing Australian holidays...");

    const missingHolidays = [
      { date: '2024-04-25', name: 'Anzac Day' },
      { date: '2024-10-07', name: 'Labour Day' },
      { date: '2025-06-09', name: 'Queen\'s Birthday' },
      { date: '2025-12-26', name: 'Boxing Day' },
    ];

    for (const holiday of missingHolidays) {
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
          ['public'], 
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

  async seedUserSkills() {
    console.log("🎯 Seeding user skills...");
    
    // Get all users to assign skills to
    const users = await this.executeQuery(`
      SELECT id, name, position FROM users 
      WHERE is_active = true
    `);

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
    
    this.stats.skills = PROFESSIONALSKILLS.length;
  }

  shouldAssignSkill(position, skill) {
    const positionSkillMap = {
      'senior_consultant': 0.8,
      'consultant': 0.6,
      'junior_consultant': 0.4,
      'manager': 0.9,
      'director': 0.95,
      'developer': 0.7
    };
    
    const categoryMultiplier = {
      'Management': position && (position.includes('manager') || position.includes('director')) ? 1.0 : 0.3,
      'Business': 0.8,
      'Finance': 0.6,
      'Technical': 0.7,
      'Operations': 0.6,
      'HR': position && position.includes('manager') ? 0.8 : 0.3,
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

  async generateReport() {
    console.log("\n📊 SIMPLE SEEDING REPORT");
    console.log("=".repeat(40));
    
    if (DRY_RUN) {
      console.log("🔍 DRY RUN - No data was actually inserted");
    } else {
      console.log("✅ Data successfully seeded");
    }
    
    console.log("\nSeeding Statistics:");
    console.log(`  📅 Additional Holidays: ${this.stats.holidays}`);
    console.log(`  🎯 Skills Available: ${this.stats.skills}`);
    console.log(`  👤 User Skill Assignments: ${this.stats.userSkills}`);
    
    const total = Object.values(this.stats).reduce((sum, count) => sum + count, 0);
    console.log(`\n🎯 Total New Records: ${total}`);
    
    console.log("\n✅ Simple seeding complete!");
  }

  async run() {
    try {
      await this.connect();
      
      console.log(`🚀 Starting simple database seeding...`);
      if (DRY_RUN) {
        console.log("🔍 DRY RUN MODE - No changes will be made");
      }
      
      await this.seedAdditionalHolidays();
      await this.seedUserSkills();
      
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
const seeder = new SimpleSeed();
seeder.run().catch(console.error);