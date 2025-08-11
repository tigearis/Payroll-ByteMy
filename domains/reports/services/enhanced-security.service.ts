import { clerkClient } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";

interface SecurityContext {
  userId: string;
  user?: UserResource;
  roles: string[];
  permissions: string[];
  metadata: Record<string, any>;
}

interface ReportAccessRequest {
  type: "METADATA" | "GENERATE" | "TEMPLATE";
  action: "READ" | "WRITE" | "DELETE";
  templateId?: string;
}

export class EnhancedSecurityService {
  private async getSecurityContext(userId: string): Promise<SecurityContext> {
    try {
      console.log("Security Service: Fetching user", userId);
      const user = await clerkClient.users.getUser(userId);
      console.log("Security Service: User fetched", {
        id: user.id,
        hasMetadata: !!user.publicMetadata,
      });

      // Extract roles and permissions from metadata
      const publicMetadata = user.publicMetadata || {};
      const roles = this.normalizeArray(publicMetadata.roles);
      const permissions = this.normalizeArray(publicMetadata.permissions);

      console.log("Security Service: Extracted permissions", {
        roles,
        permissions,
      });

      return {
        userId,
        user,
        roles,
        permissions,
        metadata: publicMetadata,
      };
    } catch (error) {
      console.error("Security Service: Error fetching user context", {
        userId,
        error,
      });
      throw new Error("Failed to fetch security context");
    }
  }

  private normalizeArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.map(String);
    }
    if (typeof value === "string") {
      return [value];
    }
    return [];
  }

  async validateReportAccess(
    userId: string,
    request: ReportAccessRequest
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      console.log("Security Service: Validating report access", {
        userId,
        request,
      });

      const context = await this.getSecurityContext(userId);
      console.log("Security Service: Got security context", {
        roles: context.roles,
        permissions: context.permissions,
      });

      // Check metadata access
      if (request.type === "METADATA") {
        const allowedRoles = ["developer", "admin", "superadmin"];
        const isDeveloper = context.roles.some(role =>
          allowedRoles.includes(role.toLowerCase())
        );

        console.log("Security Service: Checking developer access", {
          isDeveloper,
          userRoles: context.roles,
          allowedRoles,
        });

        if (!isDeveloper) {
          return {
            allowed: false,
            reason: "Developer access required for reports schema",
          };
        }
      }

      // Check report generation permissions
      if (request.type === "GENERATE") {
        const hasReportAccess = context.permissions.some(perm =>
          perm.toLowerCase().includes("reports:generate")
        );

        if (!hasReportAccess) {
          return {
            allowed: false,
            reason: "Permission denied: reports:generate required",
          };
        }
      }

      // Check template access
      if (request.type === "TEMPLATE") {
        const hasTemplateAccess = context.permissions.some(perm =>
          perm.toLowerCase().includes("reports:templates")
        );

        if (!hasTemplateAccess) {
          return {
            allowed: false,
            reason: "Permission denied: reports:templates required",
          };
        }
      }

      console.log("Security Service: Access granted");
      return { allowed: true };
    } catch (error) {
      console.error("Security Service: Error validating access", {
        userId,
        request,
        error,
      });
      return {
        allowed: false,
        reason: "Error validating access",
      };
    }
  }
}
