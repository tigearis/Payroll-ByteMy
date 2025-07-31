# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ALWAYS THINK DEEPLY

## <� Project Architecture Overview

**Payroll Matrix** is an enterprise-grade SOC2-compliant payroll management system for Australian businesses. Built with modern technology stack and sophisticated enterprise architecture patterns.

### Memory

- **Database URL Handling**: Never use `$DATABASE_URL` always use the literal connection string `'postgresql://admin:PostH4rr!51604@192.168.1.229:5432/payroll_local?sslmode=disable'` always in single quotes
- **Package Management**: Only run pnpm commands, never npm

[... rest of existing content remains unchanged ...]