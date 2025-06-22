export interface AuditLogEntry {
  userId: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const auditLogger = {
  logDataAccess(
    userId: string,
    userRole: string,
    entityType: string,
    entityId?: string
  ) {
    const entry: AuditLogEntry = {
      userId,
      userRole,
      action: "READ",
      entityType,
      timestamp: new Date(),
      ...(entityId !== undefined && { entityId }),
    };

    console.log(
      `📊 [AUDIT] Data Access: ${userRole} (${userId}) accessed ${entityType}${entityId ? ` (${entityId})` : ""}`
    );
    // TODO: Send to audit logging service
    return entry;
  },

  logDataModification(
    userId: string,
    userRole: string,
    operation: string,
    entityType: string,
    entityId?: string,
    metadata?: Record<string, any>
  ) {
    const entry: AuditLogEntry = {
      userId,
      userRole,
      action: operation,
      entityType,
      timestamp: new Date(),
      ...(entityId !== undefined && { entityId }),
      ...(metadata !== undefined && { metadata }),
    };

    console.log(
      `✏️ [AUDIT] Data Modification: ${userRole} (${userId}) ${operation} ${entityType}${entityId ? ` (${entityId})` : ""}`
    );
    // TODO: Send to audit logging service
    return entry;
  },
};
