import { Shield, Lock, Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRole } from "@/hooks/use-permissions";
import {
  DataClassificationLevel,
  FieldSecurityRule,
  DomainSecurityRule,
  SecurityPolicy,
} from "../../types/security.types";

interface SecurityRulesManagerProps {
  policy: SecurityPolicy;
  onUpdatePolicy: (policy: SecurityPolicy) => void;
  availableRoles: string[];
  availablePermissions: string[];
  className?: string;
}

export function SecurityRulesManager({
  policy,
  onUpdatePolicy,
  availableRoles,
  availablePermissions,
  className,
}: SecurityRulesManagerProps) {
  const { isDeveloper, isAdminOrAbove } = useRole();
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [showFieldRuleDialog, setShowFieldRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<FieldSecurityRule | null>(
    null
  );

  // Check if user can manage security rules
  if (!isDeveloper) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-foreground opacity-60">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Developer access required to manage security rules.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleUpdateDomainRule = (
    domain: string,
    updates: Partial<DomainSecurityRule>
  ) => {
    const newPolicy = { ...policy };
    newPolicy.domainRules[domain] = {
      ...newPolicy.domainRules[domain],
      ...updates,
    };
    onUpdatePolicy(newPolicy);
  };

  const handleUpdateFieldRule = (
    domain: string,
    field: string,
    rule: FieldSecurityRule
  ) => {
    const newPolicy = { ...policy };
    newPolicy.domainRules[domain].fieldRules[field] = rule;
    onUpdatePolicy(newPolicy);
    setShowFieldRuleDialog(false);
    setEditingRule(null);
  };

  const handleDeleteFieldRule = (domain: string, field: string) => {
    const newPolicy = { ...policy };
    delete newPolicy.domainRules[domain].fieldRules[field];
    onUpdatePolicy(newPolicy);
  };

  const getClassificationBadge = (level: DataClassificationLevel) => {
    const colors: Record<DataClassificationLevel, string> = {
      CRITICAL: "bg-red-100 text-red-800",
      HIGH: "bg-orange-100 text-orange-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      LOW: "bg-green-100 text-green-800",
    };

    return (
      <Badge className={colors[level]} variant="secondary">
        {level}
      </Badge>
    );
  };

  return (
    <div className={className}>
      {/* Domain Selection */}
      <div className="mb-4">
        <Select value={selectedDomain} onValueChange={setSelectedDomain}>
          <SelectTrigger>
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(policy.domainRules).map(domain => (
              <SelectItem key={domain} value={domain}>
                {domain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDomain && (
        <div className="space-y-6">
          {/* Domain Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Domain Security Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Baseline Classification</Label>
                  <Select
                    value={
                      policy.domainRules[selectedDomain].baselineClassification
                    }
                    onValueChange={value =>
                      handleUpdateDomainRule(selectedDomain, {
                        baselineClassification:
                          value as DataClassificationLevel,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Required Roles</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableRoles.map(role => (
                      <div key={role} className="flex items-center gap-2">
                        <Switch
                          checked={policy.domainRules[
                            selectedDomain
                          ].requiredRoles.includes(role)}
                          onCheckedChange={checked => {
                            const currentRoles =
                              policy.domainRules[selectedDomain].requiredRoles;
                            handleUpdateDomainRule(selectedDomain, {
                              requiredRoles: checked
                                ? [...currentRoles, role]
                                : currentRoles.filter(r => r !== role),
                            });
                          }}
                        />
                        <span>{role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Required Permissions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availablePermissions.map(permission => (
                      <div key={permission} className="flex items-center gap-2">
                        <Switch
                          checked={policy.domainRules[
                            selectedDomain
                          ].requiredPermissions.includes(permission)}
                          onCheckedChange={checked => {
                            const currentPermissions =
                              policy.domainRules[selectedDomain]
                                .requiredPermissions;
                            handleUpdateDomainRule(selectedDomain, {
                              requiredPermissions: checked
                                ? [...currentPermissions, permission]
                                : currentPermissions.filter(
                                    p => p !== permission
                                  ),
                            });
                          }}
                        />
                        <span>{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Rules */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Field Security Rules
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFieldRuleDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(
                  policy.domainRules[selectedDomain].fieldRules
                ).map(([field, rule]) => (
                  <div
                    key={field}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <div className="font-medium">{field}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {getClassificationBadge(rule.classification)}
                        {rule.maskingRule && (
                          <Badge variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            {rule.maskingRule}
                          </Badge>
                        )}
                        {rule.auditLevel !== "NONE" && (
                          <Badge variant="outline">
                            AUDIT: {rule.auditLevel}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingRule(rule);
                          setShowFieldRuleDialog(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteFieldRule(selectedDomain, field)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Field Rule Dialog */}
      <Dialog open={showFieldRuleDialog} onOpenChange={setShowFieldRuleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Edit Field Rule" : "Add Field Rule"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Field Rule Form */}
            {/* TODO: Implement field rule form */}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowFieldRuleDialog(false);
                setEditingRule(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // If parent provided onUpdatePolicy, call with current policy state
                onUpdatePolicy?.(policy);
                setShowFieldRuleDialog(false);
              }}
            >
              Save Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
