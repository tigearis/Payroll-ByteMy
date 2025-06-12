"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ModernLoading,
  PayrollsTabLoading,
  PayrollDetailsLoading,
  QuickLoading,
  SkeletonCard,
  SkeletonTable,
  ButtonLoading,
} from "@/components/ui/loading-states";

export default function LoadingDemoPage() {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [progress, setProgress] = useState(45);

  const handleButtonClick = () => {
    setIsButtonLoading(true);
    setTimeout(() => setIsButtonLoading(false), 3000);
  };

  const increaseProgress = () => {
    setProgress((prev) => Math.min(100, prev + 10));
  };

  const decreaseProgress = () => {
    setProgress((prev) => Math.max(0, prev - 10));
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Modern Loading Components Demo</h1>
        <p className="text-muted-foreground">
          Explore different loading states and animations for our application.
        </p>
      </div>

      <Tabs defaultValue="variants" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="specialized">Specialized</TabsTrigger>
          <TabsTrigger value="skeletons">Skeletons</TabsTrigger>
          <TabsTrigger value="interactive">Interactive</TabsTrigger>
        </TabsList>

        <TabsContent value="variants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading Variants</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="h-80">
                <CardHeader>
                  <CardTitle className="text-lg">Default</CardTitle>
                </CardHeader>
                <CardContent>
                  <ModernLoading
                    variant="default"
                    size="sm"
                    title="Loading Data"
                    description="Please wait while we fetch your information"
                  />
                </CardContent>
              </Card>

              <Card className="h-80">
                <CardHeader>
                  <CardTitle className="text-lg">Dots</CardTitle>
                </CardHeader>
                <CardContent>
                  <ModernLoading
                    variant="dots"
                    size="sm"
                    title="Processing"
                    description="Working on your request"
                  />
                </CardContent>
              </Card>

              <Card className="h-80">
                <CardHeader>
                  <CardTitle className="text-lg">Pulse</CardTitle>
                </CardHeader>
                <CardContent>
                  <ModernLoading
                    variant="pulse"
                    size="sm"
                    title="Syncing"
                    description="Synchronizing data across systems"
                  />
                </CardContent>
              </Card>

              <Card className="h-80">
                <CardHeader>
                  <CardTitle className="text-lg">Gradient</CardTitle>
                </CardHeader>
                <CardContent>
                  <ModernLoading
                    variant="gradient"
                    size="sm"
                    title="Uploading"
                    description="Transferring files securely"
                  />
                </CardContent>
              </Card>

              <Card className="h-80">
                <CardHeader>
                  <CardTitle className="text-lg">Minimal</CardTitle>
                </CardHeader>
                <CardContent>
                  <ModernLoading variant="minimal" size="sm" />
                </CardContent>
              </Card>

              <Card className="h-80">
                <CardHeader>
                  <CardTitle className="text-lg">Inline</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                  <ModernLoading
                    variant="inline"
                    size="xs"
                    title="Loading..."
                  />
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specialized" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Specialized Loading Components</CardTitle>
              <p className="text-sm text-muted-foreground">
                Context-specific loading states used throughout the application
              </p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="h-80">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Payrolls Tab Loading
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PayrollsTabLoading />
                </CardContent>
              </Card>

              <Card className="h-80">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Payroll Details Loading
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PayrollDetailsLoading />
                </CardContent>
              </Card>

              <Card className="h-80">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Loading</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                  <QuickLoading text="Saving..." />
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skeletons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loading States</CardTitle>
              <p className="text-sm text-muted-foreground">
                Skeleton placeholders that match the content structure
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Skeleton Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Skeleton Table</h3>
                <SkeletonTable rows={4} columns={5} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Loading States</CardTitle>
              <p className="text-sm text-muted-foreground">
                Interactive examples with progress and button states
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Progress Loading</h3>
                <div className="flex gap-4 items-center">
                  <Button onClick={decreaseProgress} variant="outline">
                    -10%
                  </Button>
                  <Button onClick={increaseProgress} variant="outline">
                    +10%
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Current: {progress}%
                  </span>
                </div>
                <Card className="h-80">
                  <CardContent className="h-full">
                    <ModernLoading
                      variant="default"
                      size="sm"
                      title="File Upload"
                      description="Uploading your documents to the server"
                      showProgress={true}
                      progress={progress}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Button Loading State</h3>
                <div className="flex gap-4">
                  <ButtonLoading
                    isLoading={isButtonLoading}
                    onClick={handleButtonClick}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                  >
                    {isButtonLoading ? "Processing..." : "Click to Load"}
                  </ButtonLoading>

                  <QuickLoading text="Auto-saving..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
