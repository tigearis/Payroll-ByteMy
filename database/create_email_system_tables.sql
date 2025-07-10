-- Email System Tables for Resend Integration
-- Security Classification: HIGH - Email communication and audit data
-- SOC2 Compliance: Complete audit trail for all email communications

-- Email templates with proper naming conventions
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL CHECK (category IN ('payroll', 'billing', 'client', 'leave', 'work_schedule', 'system')),
    subject_template VARCHAR(500) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    available_variables JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    is_system_template BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT false,
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email sending logs for SOC2 compliance
CREATE TABLE email_send_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    resend_email_id VARCHAR(255),
    recipient_emails TEXT[] NOT NULL,
    sender_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    subject VARCHAR(500) NOT NULL,
    html_content TEXT,
    text_content TEXT,
    business_context JSONB, -- {payroll_id, client_id, billing_invoice_id, etc.}
    send_status VARCHAR(50) DEFAULT 'pending' CHECK (send_status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
    resend_response JSONB,
    error_message TEXT,
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template favorites for quick access
CREATE TABLE user_email_template_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, template_id)
);

-- Email drafts for work-in-progress
CREATE TABLE email_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    recipient_emails TEXT[] NOT NULL,
    subject VARCHAR(500),
    html_content TEXT,
    text_content TEXT,
    variable_values JSONB,
    business_context JSONB,
    scheduled_for TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_email_templates_category ON email_templates(category);
CREATE INDEX idx_email_templates_active ON email_templates(is_active);
CREATE INDEX idx_email_templates_created_by ON email_templates(created_by_user_id);
CREATE INDEX idx_email_send_logs_sender ON email_send_logs(sender_user_id);
CREATE INDEX idx_email_send_logs_status ON email_send_logs(send_status);
CREATE INDEX idx_email_send_logs_created_at ON email_send_logs(created_at);
CREATE INDEX idx_email_send_logs_template ON email_send_logs(template_id);
CREATE INDEX idx_email_drafts_user ON email_drafts(user_id);
CREATE INDEX idx_user_template_favorites_user ON user_email_template_favorites(user_id);

-- Comments for documentation
COMMENT ON TABLE email_templates IS 'Email templates for various business communications';
COMMENT ON TABLE email_send_logs IS 'Audit log of all emails sent through the system';
COMMENT ON TABLE user_email_template_favorites IS 'User favorite templates for quick access';
COMMENT ON TABLE email_drafts IS 'Draft emails saved for later sending';

-- Initial system templates
INSERT INTO email_templates (
    name, 
    description, 
    category, 
    subject_template, 
    html_content, 
    available_variables, 
    is_system_template, 
    created_by_user_id
) VALUES 
(
    'Payroll Processing Complete',
    'Notification sent when payroll processing is completed',
    'payroll',
    'Payroll {{payroll.name}} - Processing Complete',
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Payroll Processing Complete</h2>
        <p>Hello,</p>
        <p>The payroll <strong>{{payroll.name}}</strong> for <strong>{{client.name}}</strong> has been successfully processed.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Payroll Details:</h3>
            <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Payroll Name:</strong> {{payroll.name}}</li>
                <li><strong>Client:</strong> {{client.name}}</li>
                <li><strong>Employee Count:</strong> {{payroll.employee_count}}</li>
                <li><strong>Processing Date:</strong> {{payroll.processing_date}}</li>
                <li><strong>Go Live Date:</strong> {{payroll.go_live_date}}</li>
            </ul>
        </div>
        <p>The payroll data is now ready for final review and distribution.</p>
        <p>Best regards,<br>ByteMy Payroll Team</p>
    </div>',
    '["payroll.name", "payroll.employee_count", "payroll.processing_date", "payroll.go_live_date", "client.name"]'::jsonb,
    true,
    (SELECT id FROM users WHERE email = 'system@bytemy.com.au' LIMIT 1)
),
(
    'Invoice Generated',
    'Notification sent when an invoice is generated and ready to send',
    'billing',
    'Invoice {{invoice.number}} - {{client.name}}',
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Invoice Generated</h2>
        <p>Dear {{client.name}},</p>
        <p>A new invoice has been generated for your account.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Invoice Details:</h3>
            <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Invoice Number:</strong> {{invoice.number}}</li>
                <li><strong>Amount:</strong> ${{invoice.amount}}</li>
                <li><strong>Due Date:</strong> {{invoice.due_date}}</li>
                <li><strong>Billing Period:</strong> {{invoice.period}}</li>
            </ul>
        </div>
        <p>Please review the invoice and remit payment by the due date.</p>
        <p>Thank you for your business,<br>ByteMy Billing Team</p>
    </div>',
    '["invoice.number", "invoice.amount", "invoice.due_date", "invoice.period", "client.name"]'::jsonb,
    true,
    (SELECT id FROM users WHERE email = 'system@bytemy.com.au' LIMIT 1)
),
(
    'Leave Request Approved',
    'Notification sent when a leave request is approved',
    'leave',
    'Leave Request Approved - {{leave.type}}',
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Leave Request Approved</h2>
        <p>Hello {{employee.first_name}},</p>
        <p>Your leave request has been approved!</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Leave Details:</h3>
            <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Leave Type:</strong> {{leave.type}}</li>
                <li><strong>Start Date:</strong> {{leave.start_date}}</li>
                <li><strong>End Date:</strong> {{leave.end_date}}</li>
                <li><strong>Days:</strong> {{leave.days}}</li>
                <li><strong>Approved By:</strong> {{approver.name}}</li>
            </ul>
        </div>
        <p>Please ensure all handover arrangements are in place before your leave begins.</p>
        <p>Best regards,<br>HR Team</p>
    </div>',
    '["employee.first_name", "leave.type", "leave.start_date", "leave.end_date", "leave.days", "approver.name"]'::jsonb,
    true,
    (SELECT id FROM users WHERE email = 'system@bytemy.com.au' LIMIT 1)
),
(
    'Work Schedule Assignment',
    'Notification sent when a new work assignment is created',
    'work_schedule',
    'New Assignment - {{assignment.title}}',
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">New Work Assignment</h2>
        <p>Hello {{consultant.first_name}},</p>
        <p>You have been assigned to a new project.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">Assignment Details:</h3>
            <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Title:</strong> {{assignment.title}}</li>
                <li><strong>Client:</strong> {{client.name}}</li>
                <li><strong>Start Date:</strong> {{assignment.start_date}}</li>
                <li><strong>End Date:</strong> {{assignment.end_date}}</li>
                <li><strong>Hours per Week:</strong> {{assignment.hours_per_week}}</li>
            </ul>
        </div>
        <p>Please confirm your availability and reach out if you have any questions.</p>
        <p>Best regards,<br>Project Management Team</p>
    </div>',
    '["consultant.first_name", "assignment.title", "client.name", "assignment.start_date", "assignment.end_date", "assignment.hours_per_week"]'::jsonb,
    true,
    (SELECT id FROM users WHERE email = 'system@bytemy.com.au' LIMIT 1)
);