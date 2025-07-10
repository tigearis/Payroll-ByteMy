/**
 * Bulk Upload Interface Component
 *
 * Provides a comprehensive interface for bulk uploading clients and payrolls
 * Supports drag-and-drop, progress tracking, validation, and error reporting
 */

"use client";

import { useUser } from "@clerk/nextjs";
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface UploadResult {
  success: boolean;
  message: string;
  data?: {
    created?: number;
    failed?: number;
    clientsCreated?: number;
    clientsFailed?: number;
    payrollsCreated?: number;
    payrollsFailed?: number;
    errors: Array<{
      row: number;
      field: string;
      message: string;
      data: any;
    }>;
  };
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  result?: UploadResult;
  selectedFile?: File;
}

export function BulkUploadInterface() {
  const { user } = useUser();
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
  });
  const [activeTab, setActiveTab] = useState<
    "clients" | "payrolls" | "combined"
  >("clients");

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }

    setUploadState(prev => ({
      ...prev,
      selectedFile: file,
      result: undefined,
    }));
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  // Download template
  const downloadTemplate = useCallback(async () => {
    try {
      let endpoint: string;
      let filename: string;

      if (activeTab === "clients") {
        endpoint = "/api/bulk-upload/clients";
        filename = "clients-upload-template.csv";
      } else if (activeTab === "payrolls") {
        endpoint = "/api/bulk-upload/payrolls";
        filename = "payrolls-upload-template.csv";
      } else {
        // For combined, we'll create a template manually
        const combinedTemplate = `clientName,contactPerson,contactEmail,contactPhone,clientActive,payrollName,cycleName,dateTypeName,dateValue,primaryConsultantEmail,backupConsultantEmail,managerEmail,processingTime,processingDaysBeforeEft,employeeCount,payrollSystem,payrollStatus
"Acme Corp","John Doe","john@acme.com","555-0123","true","Acme Weekly Payroll","Weekly","DayOfWeek","1","consultant@company.com","backup@company.com","manager@company.com","1","2","50","QuickBooks","Active"`;

        const blob = new Blob([combinedTemplate], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "combined-upload-template.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Template downloaded successfully");
        return;
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error("Failed to download template");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Template download error:", error);
      toast.error("Failed to download template");
    }
  }, [activeTab]);

  // Upload file
  const uploadFile = useCallback(async () => {
    if (!uploadState.selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      result: undefined,
    }));

    try {
      const formData = new FormData();
      formData.append("file", uploadState.selectedFile);

      let endpoint: string;

      if (activeTab === "clients") {
        endpoint = "/api/bulk-upload/clients";
      } else if (activeTab === "payrolls") {
        endpoint = "/api/bulk-upload/payrolls";
      } else {
        endpoint = "/api/bulk-upload/combined";
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 200);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result: UploadResult = await response.json();

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        result,
      }));

      if (result.success) {
        const message =
          activeTab === "combined"
            ? `Upload completed: ${result.data?.clientsCreated || 0} clients and ${result.data?.payrollsCreated || 0} payrolls created`
            : result.message;
        toast.success(message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 0,
      }));
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
  }, [uploadState.selectedFile, activeTab]);

  // Reset upload state
  const resetUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bulk Upload</h2>
        <p className="text-muted-foreground">
          Upload CSV files to create multiple clients or payrolls at once
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={value =>
          setActiveTab(value as "clients" | "payrolls" | "combined")
        }
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="payrolls">Payrolls</TabsTrigger>
          <TabsTrigger value="combined">Combined</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Client Upload
              </CardTitle>
              <CardDescription>
                Upload a CSV file to create multiple clients. The file should
                include client names, contact information, and status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  uploadState.selectedFile
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-gray-300 hover:border-gray-400"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {uploadState.selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
                    <p className="font-medium">
                      {uploadState.selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {(uploadState.selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <Button onClick={resetUpload} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="font-medium">Drop your CSV file here</p>
                    <p className="text-sm text-gray-600">or click to browse</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="client-file-input"
                    />
                    <label htmlFor="client-file-input">
                      <Button variant="outline" size="sm" asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {uploadState.selectedFile && (
                <Button
                  onClick={uploadFile}
                  disabled={uploadState.isUploading}
                  className="w-full"
                >
                  {uploadState.isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Clients
                    </>
                  )}
                </Button>
              )}

              {uploadState.isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadState.progress}%</span>
                  </div>
                  <Progress value={uploadState.progress} />
                </div>
              )}

              {uploadState.result && (
                <Alert
                  className={
                    uploadState.result.success
                      ? "border-green-500"
                      : "border-red-500"
                  }
                >
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">
                        {uploadState.result.message}
                      </p>
                      {uploadState.result.data && (
                        <div className="flex gap-4 text-sm">
                          <Badge variant="outline" className="text-green-600">
                            Created: {uploadState.result.data.created}
                          </Badge>
                          {uploadState.result.data.failed > 0 && (
                            <Badge variant="outline" className="text-red-600">
                              Failed: {uploadState.result.data.failed}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {uploadState.result?.data?.errors &&
                uploadState.result.data.errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">
                        Upload Errors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {uploadState.result.data.errors.map((error, index) => (
                          <div
                            key={index}
                            className="p-2 border rounded text-sm"
                          >
                            <p className="font-medium">
                              Row {error.row || error.line}: {error.field}
                            </p>
                            <p className="text-red-600">{error.message}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payrolls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Payroll Upload
              </CardTitle>
              <CardDescription>
                Upload a CSV file to create multiple payrolls. The file should
                include payroll details, client references, and consultant
                assignments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  uploadState.selectedFile
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-gray-300 hover:border-gray-400"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {uploadState.selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
                    <p className="font-medium">
                      {uploadState.selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {(uploadState.selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <Button onClick={resetUpload} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="font-medium">Drop your CSV file here</p>
                    <p className="text-sm text-gray-600">or click to browse</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="payroll-file-input"
                    />
                    <label htmlFor="payroll-file-input">
                      <Button variant="outline" size="sm" asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {uploadState.selectedFile && (
                <Button
                  onClick={uploadFile}
                  disabled={uploadState.isUploading}
                  className="w-full"
                >
                  {uploadState.isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Payrolls
                    </>
                  )}
                </Button>
              )}

              {uploadState.isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadState.progress}%</span>
                  </div>
                  <Progress value={uploadState.progress} />
                </div>
              )}

              {uploadState.result && (
                <Alert
                  className={
                    uploadState.result.success
                      ? "border-green-500"
                      : "border-red-500"
                  }
                >
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">
                        {uploadState.result.message}
                      </p>
                      {uploadState.result.data && (
                        <div className="flex gap-4 text-sm">
                          <Badge variant="outline" className="text-green-600">
                            Created: {uploadState.result.data.created}
                          </Badge>
                          {uploadState.result.data.failed > 0 && (
                            <Badge variant="outline" className="text-red-600">
                              Failed: {uploadState.result.data.failed}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {uploadState.result?.data?.errors &&
                uploadState.result.data.errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">
                        Upload Errors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {uploadState.result.data.errors.map((error, index) => (
                          <div
                            key={index}
                            className="p-2 border rounded text-sm"
                          >
                            <p className="font-medium">
                              Row {error.row || error.line}: {error.field}
                            </p>
                            <p className="text-red-600">{error.message}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="combined" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Combined Client & Payroll Upload
              </CardTitle>
              <CardDescription>
                Upload a single CSV file to create both clients and their
                associated payrolls simultaneously. Each row should contain both
                client and payroll information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>

              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  uploadState.selectedFile
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-gray-300 hover:border-gray-400"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {uploadState.selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
                    <p className="font-medium">
                      {uploadState.selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {(uploadState.selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                    <Button onClick={resetUpload} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="font-medium">Drop your CSV file here</p>
                    <p className="text-sm text-gray-600">or click to browse</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="combined-file-input"
                    />
                    <label htmlFor="combined-file-input">
                      <Button variant="outline" size="sm" asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                  </div>
                )}
              </div>

              {uploadState.selectedFile && (
                <Button
                  onClick={uploadFile}
                  disabled={uploadState.isUploading}
                  className="w-full"
                >
                  {uploadState.isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Clients & Payrolls
                    </>
                  )}
                </Button>
              )}

              {uploadState.isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadState.progress}%</span>
                  </div>
                  <Progress value={uploadState.progress} />
                </div>
              )}

              {uploadState.result && (
                <Alert
                  className={
                    uploadState.result.success
                      ? "border-green-500"
                      : "border-red-500"
                  }
                >
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">
                        {uploadState.result.message}
                      </p>
                      {uploadState.result.data && (
                        <div className="flex gap-4 text-sm">
                          {uploadState.result.data.clientsCreated !==
                            undefined && (
                            <Badge variant="outline" className="text-green-600">
                              Clients: {uploadState.result.data.clientsCreated}
                            </Badge>
                          )}
                          {uploadState.result.data.payrollsCreated !==
                            undefined && (
                            <Badge variant="outline" className="text-green-600">
                              Payrolls:{" "}
                              {uploadState.result.data.payrollsCreated}
                            </Badge>
                          )}
                          {uploadState.result.data.created !== undefined && (
                            <Badge variant="outline" className="text-green-600">
                              Created: {uploadState.result.data.created}
                            </Badge>
                          )}
                          {(uploadState.result.data.clientsFailed ||
                            uploadState.result.data.payrollsFailed ||
                            uploadState.result.data.failed) > 0 && (
                            <Badge variant="outline" className="text-red-600">
                              Failed:{" "}
                              {uploadState.result.data.clientsFailed ||
                                uploadState.result.data.payrollsFailed ||
                                uploadState.result.data.failed}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {uploadState.result?.data?.errors &&
                uploadState.result.data.errors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">
                        Upload Errors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {uploadState.result.data.errors.map((error, index) => (
                          <div
                            key={index}
                            className="p-2 border rounded text-sm"
                          >
                            <p className="font-medium">
                              Row {error.row || error.line}: {error.field}
                            </p>
                            <p className="text-red-600">{error.message}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Client Upload</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Client name is required</li>
                <li>• Contact email must be valid format</li>
                <li>• Active status defaults to true</li>
                <li>• Contact person and phone are optional</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Payroll Upload</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Client must exist in the system</li>
                <li>• Consultant and manager emails must be valid</li>
                <li>• Cycle and date type must match system values</li>
                <li>• Processing time and days are required</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Combined Upload</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Single CSV with client and payroll data</li>
                <li>• Clients created first, then payrolls</li>
                <li>• Duplicate clients within upload are handled</li>
                <li>• All validation rules apply</li>
              </ul>
            </div>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Always download and use the provided
              templates to ensure correct formatting. The system will validate
              each row and report any errors before creating records.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
