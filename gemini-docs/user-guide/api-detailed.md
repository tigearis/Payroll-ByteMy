
# API (User Guide)

This document provides a high-level overview of the application's internal API. While you will not interact with the API directly, it is helpful to understand its purpose and functionality.

## What is an API?

An API (Application Programming Interface) is a set of rules and tools that allows different software applications to communicate with each other. In this case, the API is used to:

*   **Connect the application to external services,** such as the Clerk authentication service.
*   **Perform background tasks,** such as sending email notifications and generating reports.
*   **Keep the application's data in sync** with external services.

## Key API Functions

### User and Staff Management

The API is used to create, update, and delete users and staff members. When you add a new staff member to the application, the API sends an invitation to the new user via email and creates a new user account for them in the system.

### Webhooks

The application uses webhooks to receive real-time updates from external services. For example, when you update your profile information in Clerk, Clerk sends a webhook to the application to notify it of the change. The application then updates your profile information in its own database.

### Cron Jobs

The application uses cron jobs to perform scheduled tasks, such as activating payrolls on their go-live date and generating reports.
