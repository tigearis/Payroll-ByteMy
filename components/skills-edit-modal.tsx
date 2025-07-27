"use client";

import { useMutation, useQuery } from "@apollo/client";
import { X, Plus, Trash2, Save, User, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GetUserSkillsDocument,
  GetPayrollRequiredSkillsDocument,
  CreateUserSkillDocument,
  UpdateUserSkillDocument,
  DeleteUserSkillDocument,
  CreatePayrollRequiredSkillDocument,
  DeletePayrollRequiredSkillDocument,
} from "@/domains/work-schedule/graphql/generated/graphql";

// Predefined skill options from the seeding script
const AVAILABLE_SKILLS = [
  "Australian Payroll Processing",
  "PAYG Tax Calculations",
  "Superannuation Administration",
  "Award Interpretation",
  "Modern Awards Compliance",
  "Enterprise Agreements",
  "Single Touch Payroll (STP)",
  "Payroll Tax Calculations",
  "Fringe Benefits Tax (FBT)",
  "Leave Management",
  "Termination Processing",
  "Payroll Auditing",
  "Employee Self-Service",
  "Payroll Reporting",
  "Time and Attendance",
  "Salary Packaging",
  "Workers Compensation",
  "Payroll Systems Integration",
  "Data Migration",
  "Process Automation",
  "Compliance Reporting",
  "Multi-state Payroll",
  "International Payroll",
  "Executive Payroll",
  "Union Compliance",
  "Payroll Project Management",
  "System Implementation",
  "Training and Development",
  "Client Relationship Management",
  "Payroll Consulting",
  "Risk Management",
  "Quality Assurance",
  "Documentation Management",
  "Stakeholder Communication",
];

const PROFICIENCY_LEVELS = [
  { value: "Beginner", label: "Beginner", color: "bg-gray-100 text-gray-700" },
  {
    value: "Intermediate",
    label: "Intermediate",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "Advanced",
    label: "Advanced",
    color: "bg-green-100 text-green-700",
  },
  { value: "Expert", label: "Expert", color: "bg-purple-100 text-purple-700" },
];

interface SkillsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "user" | "payroll";
  entityId: string;
  entityName: string;
}

interface Skill {
  skillName: string;
  proficiencyLevel?: string;
  requiredLevel?: string;
}

export function SkillsEditModal({
  isOpen,
  onClose,
  type,
  entityId,
  entityName,
}: SkillsEditModalProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [newLevel, setNewLevel] = useState<string>("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Queries
  const {
    data: userSkillsData,
    loading: userSkillsLoading,
    refetch: refetchUserSkills,
  } = useQuery(GetUserSkillsDocument, {
    variables: { userId: entityId },
    skip: type !== "user",
  });

  const {
    data: payrollSkillsData,
    loading: payrollSkillsLoading,
    refetch: refetchPayrollSkills,
  } = useQuery(GetPayrollRequiredSkillsDocument, {
    variables: { payrollId: entityId },
    skip: type !== "payroll",
  });

  // Mutations
  const [createUserSkill] = useMutation(CreateUserSkillDocument);
  const [updateUserSkill] = useMutation(UpdateUserSkillDocument);
  const [deleteUserSkill] = useMutation(DeleteUserSkillDocument);
  const [createPayrollRequiredSkill] = useMutation(
    CreatePayrollRequiredSkillDocument
  );
  const [deletePayrollRequiredSkill] = useMutation(
    DeletePayrollRequiredSkillDocument
  );

  // Update local state when data changes
  useEffect(() => {
    if (type === "user" && userSkillsData) {
      setSkills(
        userSkillsData.userSkill?.map(skill => ({
          skillName: skill.skillName || "",
          proficiencyLevel: skill.proficiencyLevel || "",
        })) || []
      );
    } else if (type === "payroll" && payrollSkillsData) {
      setSkills(
        payrollSkillsData.payrollRequiredSkill?.map(skill => ({
          skillName: skill.skillName || "",
          requiredLevel: skill.requiredLevel || "",
        })) || []
      );
    }
  }, [type, userSkillsData, payrollSkillsData]);

  const handleAddSkill = async () => {
    if (!newSkill || !newLevel) {
      toast.error("Please select both a skill and proficiency level");
      return;
    }

    // Check if skill already exists
    const existingSkill = skills.find(skill => skill.skillName === newSkill);
    if (existingSkill) {
      toast.error("This skill is already added");
      return;
    }

    try {
      if (type === "user") {
        await createUserSkill({
          variables: {
            userId: entityId,
            skillName: newSkill,
            proficiencyLevel: newLevel,
          },
        });
        toast.success("Skill added successfully");
        refetchUserSkills();
      } else {
        await createPayrollRequiredSkill({
          variables: {
            payrollId: entityId,
            skillName: newSkill,
            requiredLevel: newLevel,
          },
        });
        toast.success("Required skill added successfully");
        refetchPayrollSkills();
      }

      setNewSkill("");
      setNewLevel("");
      setIsAddingSkill(false);
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    }
  };

  const handleUpdateSkill = async (skillName: string, newLevel: string) => {
    if (type !== "user") return; // Only user skills can be updated

    try {
      await updateUserSkill({
        variables: {
          userId: entityId,
          skillName,
          proficiencyLevel: newLevel,
        },
      });
      toast.success("Skill updated successfully");
      refetchUserSkills();
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error("Failed to update skill");
    }
  };

  const handleDeleteSkill = async (skillName: string) => {
    try {
      if (type === "user") {
        await deleteUserSkill({
          variables: {
            userId: entityId,
            skillName,
          },
        });
        toast.success("Skill removed successfully");
        refetchUserSkills();
      } else {
        await deletePayrollRequiredSkill({
          variables: {
            payrollId: entityId,
            skillName,
          },
        });
        toast.success("Required skill removed successfully");
        refetchPayrollSkills();
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to remove skill");
    }
  };

  const getProficiencyColor = (level: string) => {
    const proficiency = PROFICIENCYLEVELS.find(p => p.value === level);
    return proficiency?.color || "bg-gray-100 text-gray-700";
  };

  const getTitle = () => {
    if (type === "user") {
      return `Edit Skills - ${entityName}`;
    }
    return `Edit Required Skills - ${entityName}`;
  };

  const getDescription = () => {
    if (type === "user") {
      return "Manage the skills and proficiency levels for this user";
    }
    return "Manage the skills required for this payroll";
  };

  const availableSkillsToAdd = AVAILABLESKILLS.filter(
    skill => !skills.some(existing => existing.skillName === skill)
  );

  const loading = userSkillsLoading || payrollSkillsLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "user" ? (
              <User className="w-5 h-5" />
            ) : (
              <FileText className="w-5 h-5" />
            )}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Skills */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Current Skills ({skills.length})
            </Label>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : skills.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center text-gray-500">
                    <p>No skills assigned yet</p>
                    <p className="text-sm">Add your first skill below</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <Card key={`${skill.skillName}-${index}`}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{skill.skillName}</span>
                        <Badge
                          className={getProficiencyColor(
                            skill.proficiencyLevel || skill.requiredLevel || ""
                          )}
                        >
                          {skill.proficiencyLevel || skill.requiredLevel}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        {type === "user" && (
                          <Select
                            value={skill.proficiencyLevel || ""}
                            onValueChange={value =>
                              handleUpdateSkill(skill.skillName, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PROFICIENCYLEVELS.map(level => (
                                <SelectItem
                                  key={level.value}
                                  value={level.value}
                                >
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSkill(skill.skillName)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Add New Skill */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Add New Skill
            </Label>

            {!isAddingSkill ? (
              <Button
                onClick={() => setIsAddingSkill(true)}
                className="w-full"
                variant="outline"
                disabled={availableSkillsToAdd.length === 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            ) : (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="skill-select">Skill</Label>
                      <Select value={newSkill} onValueChange={setNewSkill}>
                        <SelectTrigger id="skill-select">
                          <SelectValue placeholder="Select a skill..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSkillsToAdd.map(skill => (
                            <SelectItem key={skill} value={skill}>
                              {skill}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="level-select">
                        {type === "user"
                          ? "Proficiency Level"
                          : "Required Level"}
                      </Label>
                      <Select value={newLevel} onValueChange={setNewLevel}>
                        <SelectTrigger id="level-select">
                          <SelectValue placeholder="Select level..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PROFICIENCYLEVELS.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddSkill} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingSkill(false);
                        setNewSkill("");
                        setNewLevel("");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {availableSkillsToAdd.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                All available skills have been added.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
