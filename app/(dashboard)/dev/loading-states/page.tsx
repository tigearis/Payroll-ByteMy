"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ByteMyLoadingIcon } from "@/components/ui/bytemy-loading-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PageLoading,
  UsersLoading,
  StaffLoading,
  PayrollsLoading,
  ClientsLoading,
  TableLoading,
  CardLoading,
  CardsLoading,
  InlineLoading,
  LoadingWithRetry,
  LoadingOverlay,
  StatsLoading,
  ListLoading,
  FormLoading,
  PermissionCheckLoading,
  ErrorDisplay,
  PermissionDenied,
  StatsCardLoading,
  LazyComponentFallback,
  ModernLoading,
  SkeletonCard,
  SkeletonTable,
  PayrollsTabLoading,
  PayrollDetailsLoading,
  QuickLoading,
  ButtonLoading,
} from "@/components/ui/loading-states";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import all loading components

// Component demo configuration
const loadingComponents = [
  {
    category: "Page Loading States",
    components: [
      {
        name: "PageLoading",
        component: () => (
          <PageLoading
            title="Loading..."
            description="Please wait while we fetch your data"
          />
        ),
        props: {},
        code: `<PageLoading title="Loading..." description="Please wait while we fetch your data" />`,
      },
      {
        name: "UsersLoading",
        component: UsersLoading,
        props: {},
        code: `<UsersLoading />`,
      },
      {
        name: "StaffLoading",
        component: StaffLoading,
        props: {},
        code: `<StaffLoading />`,
      },
      {
        name: "PayrollsLoading",
        component: PayrollsLoading,
        props: {},
        code: `<PayrollsLoading />`,
      },
      {
        name: "ClientsLoading",
        component: ClientsLoading,
        props: {},
        code: `<ClientsLoading />`,
      },
      {
        name: "ByteMyLoadingIcon",
        component: ByteMyLoadingIcon,
        props: {},
        code: `<ByteMyLoadingIcon />`,
      },
    ],
  },
  {
    category: "Content Loading States",
    components: [
      {
        name: "TableLoading",
        component: () => (
          <TableLoading
            columns={5}
            rows={5}
            showSearch={true}
            showActions={true}
          />
        ),
        props: {},
        code: `<TableLoading columns={5} rows={5} showSearch={true} showActions={true} />`,
      },
      {
        name: "CardLoading",
        component: CardLoading,
        props: {},
        code: `<CardLoading />`,
      },
      {
        name: "CardsLoading",
        component: () => <CardsLoading count={3} />,
        props: {},
        code: `<CardsLoading count={3} />`,
      },
      {
        name: "StatsLoading",
        component: () => <StatsLoading count={4} />,
        props: {},
        code: `<StatsLoading count={4} />`,
      },
      {
        name: "StatsCardLoading",
        component: StatsCardLoading,
        props: {},
        code: `<StatsCardLoading />`,
      },
      {
        name: "ListLoading",
        component: () => <ListLoading items={5} showIcon={true} />,
        props: {},
        code: `<ListLoading items={5} showIcon={true} />`,
      },
      {
        name: "FormLoading",
        component: () => <FormLoading fields={6} />,
        props: {},
        code: `<FormLoading fields={6} />`,
      },
    ],
  },
  {
    category: "Modern Loading Variants",
    components: [
      {
        name: "ModernLoading (Default)",
        component: () => (
          <ModernLoading
            variant="default"
            size="md"
            title="Loading..."
            description="Processing your request"
          />
        ),
        props: {},
        code: `<ModernLoading variant="default" size="md" title="Loading..." description="Processing your request" />`,
      },
      {
        name: "ModernLoading (Dots)",
        component: () => (
          <ModernLoading variant="dots" size="md" title="Loading..." />
        ),
        props: {},
        code: `<ModernLoading variant="dots" size="md" title="Loading..." />`,
      },
      {
        name: "ModernLoading (Pulse)",
        component: () => (
          <ModernLoading variant="pulse" size="md" title="Loading..." />
        ),
        props: {},
        code: `<ModernLoading variant="pulse" size="md" title="Loading..." />`,
      },
      {
        name: "ModernLoading (Gradient)",
        component: () => (
          <ModernLoading variant="gradient" size="md" title="Loading..." />
        ),
        props: {},
        code: `<ModernLoading variant="gradient" size="md" title="Loading..." />`,
      },
      {
        name: "ModernLoading (Minimal)",
        component: () => <ModernLoading variant="minimal" size="md" />,
        props: {},
        code: `<ModernLoading variant="minimal" size="md" />`,
      },
      {
        name: "ModernLoading (Inline)",
        component: () => (
          <ModernLoading variant="inline" size="sm" title="Loading..." />
        ),
        props: {},
        code: `<ModernLoading variant="inline" size="sm" title="Loading..." />`,
      },
      {
        name: "ModernLoading (With Progress)",
        component: () => (
          <ModernLoading
            variant="default"
            size="md"
            title="Uploading..."
            showProgress={true}
            progress={65}
          />
        ),
        props: {},
        code: `<ModernLoading variant="default" size="md" title="Uploading..." showProgress={true} progress={65} />`,
      },
    ],
  },
  {
    category: "Inline & Overlay States",
    components: [
      {
        name: "InlineLoading",
        component: () => <InlineLoading text="Loading..." size="sm" />,
        props: {},
        code: `<InlineLoading text="Loading..." size="sm" />`,
      },
      {
        name: "QuickLoading",
        component: () => <QuickLoading text="Fetching data..." />,
        props: {},
        code: `<QuickLoading text="Fetching data..." />`,
      },
      {
        name: "LoadingOverlay",
        component: () => (
          <div className="relative h-32 border rounded">
            <LoadingOverlay message="Processing..." />
          </div>
        ),
        props: {},
        code: `<LoadingOverlay message="Processing..." />`,
      },
      {
        name: "ButtonLoading",
        component: () => (
          <div className="flex flex-wrap gap-2">
            <ButtonLoading variant="default">Normal Button</ButtonLoading>
            <ButtonLoading
              variant="default"
              isLoading={true}
              loadingText="Saving..."
            >
              Save Changes
            </ButtonLoading>
            <ButtonLoading variant="outline" isLoading={true}>
              Submit
            </ButtonLoading>
            <ButtonLoading
              variant="destructive"
              isLoading={true}
              loadingText="Deleting..."
            >
              Delete
            </ButtonLoading>
          </div>
        ),
        props: {
          variant: "default",
          isLoading: true,
          loadingText: "Saving...",
          children: "Save Changes",
        },
        code: `<ButtonLoading 
  variant="default" 
  isLoading={true} 
  loadingText="Saving..."
>
  Save Changes
</ButtonLoading>`,
      },
    ],
  },
  {
    category: "Error & Permission States",
    components: [
      {
        name: "LoadingWithRetry",
        component: () => (
          <LoadingWithRetry
            title="Loading failed"
            description="Something went wrong while loading data"
            onRetry={() => console.log("Retry clicked")}
            loading={false}
          />
        ),
        props: {},
        code: `<LoadingWithRetry 
  title="Loading failed" 
  description="Something went wrong while loading data"
  onRetry={() => console.log("Retry clicked")}
  loading={false} 
/>`,
      },
      {
        name: "ErrorDisplay",
        component: () => (
          <ErrorDisplay
            title="Error Loading Data"
            error="Failed to fetch user information"
            onRetry={() => console.log("Retry clicked")}
          />
        ),
        props: {},
        code: `<ErrorDisplay 
  title="Error Loading Data" 
  error="Failed to fetch user information"
  onRetry={() => console.log("Retry clicked")} 
/>`,
      },
      {
        name: "PermissionCheckLoading",
        component: PermissionCheckLoading,
        props: {},
        code: `<PermissionCheckLoading />`,
      },
      {
        name: "PermissionDenied",
        component: () => (
          <PermissionDenied
            title="Access Denied"
            message="You don't have permission to access this resource"
            requiredRole="Manager"
            currentRole="Consultant"
            showReturnHome={true}
          />
        ),
        props: {},
        code: `<PermissionDenied 
  title="Access Denied"
  message="You don't have permission to access this resource"
  requiredRole="Manager"
  currentRole="Consultant"
  showReturnHome={true}
/>`,
      },
    ],
  },
  {
    category: "Skeleton Components",
    components: [
      {
        name: "SkeletonCard",
        component: SkeletonCard,
        props: {},
        code: `<SkeletonCard />`,
      },
      {
        name: "SkeletonTable",
        component: () => <SkeletonTable rows={5} columns={4} />,
        props: {},
        code: `<SkeletonTable rows={5} columns={4} />`,
      },
      {
        name: "LazyComponentFallback",
        component: LazyComponentFallback,
        props: {},
        code: `<LazyComponentFallback />`,
      },
    ],
  },
  {
    category: "Specialized Loading States",
    components: [
      {
        name: "PayrollsTabLoading",
        component: PayrollsTabLoading,
        props: {},
        code: `<PayrollsTabLoading />`,
      },
      {
        name: "PayrollDetailsLoading",
        component: PayrollDetailsLoading,
        props: {},
        code: `<PayrollDetailsLoading />`,
      },
    ],
  },
];

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!");
}

export default function LoadingStatesPage() {
  const [selectedCategory, setSelectedCategory] = useState(
    loadingComponents[0].category
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Loading States Gallery
        </h1>
        <p className="text-gray-500 mt-2">
          A comprehensive showcase of all loading components available in the
          application
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full">
          {loadingComponents.map(category => (
            <TabsTrigger
              key={category.category}
              value={category.category}
              className="text-xs"
            >
              {category.category}
            </TabsTrigger>
          ))}
        </TabsList>

        {loadingComponents.map(category => (
          <TabsContent
            key={category.category}
            value={category.category}
            className="space-y-6 mt-6"
          >
            <div className="grid grid-cols-1 gap-6">
              {category.components.map(item => (
                <Card key={item.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(item.code)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Component Preview */}
                    <div className="border rounded-lg p-6 bg-gray-50 min-h-[200px] flex items-center justify-center">
                      <item.component />
                    </div>

                    {/* Code Example */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Usage
                        </Badge>
                      </div>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm">{item.code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ul>
            <li>
              Use <code>PageLoading</code> for full-page loading states
            </li>
            <li>
              Use <code>TableLoading</code> when loading table data
            </li>
            <li>
              Use <code>InlineLoading</code> for small inline loading indicators
            </li>
            <li>
              Use <code>ModernLoading</code> with different variants for modern
              loading animations
            </li>
            <li>
              Use <code>LoadingWithRetry</code> when you want to provide a retry
              option
            </li>
            <li>
              Use <code>PermissionCheckLoading</code> when checking user
              permissions
            </li>
            <li>
              Use skeleton components (<code>SkeletonCard</code>,{" "}
              <code>SkeletonTable</code>) for content placeholders
            </li>
            <li>
              Use specialized loading states for specific features (e.g.,{" "}
              <code>PayrollsTabLoading</code>)
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
