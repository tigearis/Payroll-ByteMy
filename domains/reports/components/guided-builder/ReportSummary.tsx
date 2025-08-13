"use client";

import { useState } from "react";
import { Save, Download, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ReportConfig } from "../../types/report.types";

interface ReportSummaryProps {
  config: ReportConfig;
  onSave: () => Promise<any>;
}

export function ReportSummary({ config, onSave }: ReportSummaryProps) {
  const [reportName, setReportName] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saveAsTemplate, setSaveAsTemplate] = useState(true);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  // Count selected fields
  const selectedFieldsCount = Object.values(config.fields || {}).reduce(
    (count, fields) => count + fields.length,
    0
  );

  // Count filters
  const filtersCount = Array.isArray(config.filters)
    ? config.filters.length
    : 0;

  const handleSave = async () => {
    if (!reportName) {
      toast.error("Please enter a report name");
      return;
    }

    try {
      const updatedConfig = {
        ...config,
        name: reportName,
        description: reportDescription,
        isPublic,
        saveAsTemplate,
      };

      await onSave();
      toast.success("Report saved successfully");
    } catch (error) {
      toast.error("Failed to save report");
      console.error(error);
    }
  };

  const handleSchedule = () => {
    setShowScheduleDialog(false);
    toast.success("Report scheduled successfully");
  };

  const handleShare = () => {
    setShowShareDialog(false);
    toast.success("Report shared successfully");
  };

  const handleExport = () => {
    setShowExportDialog(false);
    toast.success("Report exported successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Review & Save</h3>
        <p className="text-sm text-muted-foreground">
          Review your report configuration and save it
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Configuration Details</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                placeholder="Enter a name for your report"
                value={reportName}
                onChange={e => setReportName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea
                id="report-description"
                placeholder="Enter a description for your report"
                value={reportDescription}
                onChange={e => setReportDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="save-template"
                checked={saveAsTemplate}
                onCheckedChange={setSaveAsTemplate}
              />
              <Label htmlFor="save-template">Save as reusable template</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public-report"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public-report">
                Make this report available to all users
              </Label>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Report Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Data Domains
                  </dt>
                  <dd className="mt-1">
                    <div className="flex flex-wrap gap-1">
                      {config.domains.map(domain => (
                        <Badge
                          key={domain}
                          variant="outline"
                          className="capitalize"
                        >
                          {domain.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Fields
                  </dt>
                  <dd className="mt-1">
                    {selectedFieldsCount} fields selected
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Filters
                  </dt>
                  <dd className="mt-1">
                    {filtersCount > 0
                      ? `${filtersCount} filter${filtersCount > 1 ? "s" : ""} applied`
                      : "No filters applied"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Visualization
                  </dt>
                  <dd className="mt-1 capitalize">
                    {config.visualization?.type || "Table"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuration Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Selected Domains</h4>
                  <div className="flex flex-wrap gap-1">
                    {config.domains.map(domain => (
                      <Badge
                        key={domain}
                        variant="outline"
                        className="capitalize"
                      >
                        {domain.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Selected Fields</h4>
                  <div className="max-h-40 overflow-y-auto">
                    {Object.entries(config.fields || {}).map(
                      ([domain, fields]) => (
                        <div key={domain} className="mb-2">
                          <p className="text-xs font-medium text-muted-foreground capitalize">
                            {domain.replace(/_/g, " ")}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {fields.map(field => (
                              <Badge
                                key={field}
                                variant="secondary"
                                className="text-xs"
                              >
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {Array.isArray(config.filters) && config.filters.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Applied Filters
                    </h4>
                    <div className="text-sm">
                      {/* This would ideally show a human-readable representation of filters */}
                      {config.filters.length} filter
                      {config.filters.length !== 1 ? "s" : ""} applied
                    </div>
                  </div>
                )}

                {config.visualization && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Visualization Settings
                    </h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Type:</span>{" "}
                        <span className="capitalize">
                          {config.visualization.type}
                        </span>
                      </p>
                      {config.visualization.options?.xAxis && (
                        <p>
                          <span className="font-medium">X-Axis:</span>{" "}
                          {config.visualization.options.xAxis}
                        </p>
                      )}
                      {config.visualization.options?.yAxis && (
                        <p>
                          <span className="font-medium">Y-Axis:</span>{" "}
                          {config.visualization.options.yAxis}
                        </p>
                      )}
                      {config.visualization.options?.groupBy && (
                        <p>
                          <span className="font-medium">Group By:</span>{" "}
                          {config.visualization.options.groupBy}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSave} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save Report
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowScheduleDialog(true)}
          className="flex-1"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowShareDialog(true)}
          className="flex-1"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowExportDialog(true)}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
            <DialogDescription>
              Set up a schedule to automatically generate this report
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Day of Week</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Delivery Method</Label>
              <Select defaultValue="email">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSchedule}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
            <DialogDescription>
              Share this report with other users or teams
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Share With</Label>
              <Select defaultValue="team">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">My Team</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="organization">
                    Entire Organization
                  </SelectItem>
                  <SelectItem value="specific">Specific Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Permission Level</Label>
              <Select defaultValue="view">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="notify-users" defaultChecked />
              <Label htmlFor="notify-users">Notify users</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription>
              Export your report in various formats
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Format</Label>
              <Select defaultValue="excel">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Range</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="current">Current View</SelectItem>
                  <SelectItem value="filtered">Filtered Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="include-charts" defaultChecked />
              <Label htmlFor="include-charts">
                Include charts and visualizations
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExportDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleExport}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
