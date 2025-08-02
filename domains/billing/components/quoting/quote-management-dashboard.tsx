"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Filter,
  Download,
  Search,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// GraphQL operations (these would be imported from generated types)
const GET_QUOTES = gql`
  query GetQuotes($limit: Int, $offset: Int, $where: QuotesBoolExp, $orderBy: [QuotesOrderBy!]) {
    quotes(limit: $limit, offset: $offset, where: $where, orderBy: $orderBy) {
      id
      quoteNumber
      clientId
      prospectName
      prospectCompany
      status
      totalAmount
      validUntil
      createdAt
      updatedAt
      client {
        id
        name
      }
      createdByUser {
        firstName
        lastName
      }
      quoteLineItems {
        id
        totalAmount
      }
    }
    quotesAggregate(where: $where) {
      aggregate {
        count
        sum {
          totalAmount
        }
        avg {
          totalAmount
        }
      }
    }
  }
`;

const GET_QUOTE_ANALYTICS = gql`
  query GetQuoteAnalytics($where: QuoteAnalyticsBoolExp) {
    quoteAnalytics(where: $where, orderBy: {createdAt: DESC}) {
      id
      quoteNumber
      status
      totalAmount
      createdAt
      validUntil
      convertedAt
      conversionValue
      clientName
      createdByName
      lineItemsCount
      pipelineStatus
      daysInPipeline
    }
  }
`;

const UPDATE_QUOTE_STATUS = gql`
  mutation UpdateQuoteStatus($id: uuid!, $status: String!) {
    updateQuotesByPk(pkColumns: {id: $id}, _set: {status: $status}) {
      id
      status
      updatedAt
    }
  }
`;

interface Quote {
  id: string;
  quoteNumber: string;
  clientId?: string;
  prospectName?: string;
  prospectCompany?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  totalAmount: number;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
  };
  createdByUser: {
    firstName: string;
    lastName: string;
  };
  quoteLineItems: Array<{
    id: string;
    totalAmount: number;
  }>;
}

interface QuoteAnalytics {
  id: string;
  quoteNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  validUntil?: string;
  convertedAt?: string;
  conversionValue?: number;
  clientName?: string;
  createdByName: string;
  lineItemsCount: number;
  pipelineStatus: string;
  daysInPipeline: number;
}

export function QuoteManagementDashboard() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // GraphQL queries
  const { data: quotesData, loading: quotesLoading, refetch } = useQuery(GET_QUOTES, {
    variables: {
      limit: 100,
      offset: 0,
      orderBy: [{ createdAt: "DESC" }],
    },
    fetchPolicy: 'cache-and-network',
  });

  const { data: analyticsData, loading: analyticsLoading } = useQuery(GET_QUOTE_ANALYTICS, {
    fetchPolicy: 'cache-and-network',
  });

  const [updateQuoteStatus] = useMutation(UPDATE_QUOTE_STATUS, {
    onCompleted: () => {
      toast.success("Quote status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Error updating quote: ${error.message}`);
    },
  });

  const quotes: Quote[] = quotesData?.quotes || [];
  const quoteAnalytics: QuoteAnalytics[] = analyticsData?.quoteAnalytics || [];

  // Filter quotes based on search and status
  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesSearch = 
        quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.prospectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.prospectCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [quotes, searchTerm, statusFilter]);

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const totalQuotes = quotes.length;
    const totalValue = quotes.reduce((sum, quote) => sum + quote.totalAmount, 0);
    const avgValue = totalQuotes > 0 ? totalValue / totalQuotes : 0;
    const conversionRate = quotes.length > 0 
      ? (quotes.filter(q => q.status === 'converted').length / quotes.length) * 100 
      : 0;

    return {
      totalQuotes,
      totalValue,
      avgValue,
      conversionRate,
      pending: quotes.filter(q => ['draft', 'sent'].includes(q.status)).length,
      converted: quotes.filter(q => q.status === 'converted').length,
      lost: quotes.filter(q => ['rejected', 'expired'].includes(q.status)).length,
    };
  }, [quotes]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Draft", icon: Edit },
      sent: { variant: "default" as const, label: "Sent", icon: Send },
      accepted: { variant: "default" as const, label: "Accepted", icon: CheckCircle },
      converted: { variant: "default" as const, label: "Converted", icon: CheckCircle },
      rejected: { variant: "destructive" as const, label: "Rejected", icon: XCircle },
      expired: { variant: "secondary" as const, label: "Expired", icon: Clock },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      await updateQuoteStatus({
        variables: { id: quoteId, status: newStatus }
      });
    } catch (error) {
      console.error('Error updating quote status:', error);
    }
  };

  if (quotesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quote Management</h1>
          <p className="text-muted-foreground">
            Manage quotes, track conversions, and analyze sales performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Quote
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalQuotes}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.pending} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(metrics.avgValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.converted} converted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win/Loss</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.converted}/{metrics.lost}</div>
            <p className="text-xs text-muted-foreground">
              Won vs Lost
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Quotes</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search quotes, clients, prospects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quotes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Quotes ({filteredQuotes.length})</CardTitle>
              <CardDescription>
                Manage and track all your quotes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Client/Prospect</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">
                        {quote.quoteNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {quote.client?.name || quote.prospectName || quote.prospectCompany}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {quote.client ? 'Existing Client' : 'Prospect'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(quote.status)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(quote.totalAmount)}
                      </TableCell>
                      <TableCell>
                        {quote.validUntil ? 
                          new Date(quote.validUntil).toLocaleDateString() : 
                          'No expiry'
                        }
                      </TableCell>
                      <TableCell>
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Select onValueChange={(value) => handleStatusChange(quote.id, value)}>
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="sent">Send</SelectItem>
                              <SelectItem value="accepted">Accept</SelectItem>
                              <SelectItem value="rejected">Reject</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pipeline stages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Draft & Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotes.filter(q => q.status === 'draft').map((quote) => (
                    <div key={quote.id} className="p-3 border rounded-lg">
                      <div className="font-medium">{quote.quoteNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {quote.client?.name || quote.prospectName}
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(quote.totalAmount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sent & Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotes.filter(q => q.status === 'sent').map((quote) => (
                    <div key={quote.id} className="p-3 border rounded-lg">
                      <div className="font-medium">{quote.quoteNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {quote.client?.name || quote.prospectName}
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(quote.totalAmount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Won & Converted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quotes.filter(q => ['accepted', 'converted'].includes(q.status)).map((quote) => (
                    <div key={quote.id} className="p-3 border rounded-lg">
                      <div className="font-medium">{quote.quoteNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {quote.client?.name || quote.prospectName}
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(quote.totalAmount)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quote Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Pipeline Value</span>
                    <span className="font-bold">{formatCurrency(metrics.totalValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Quote Value</span>
                    <span className="font-bold">{formatCurrency(metrics.avgValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conversion Rate</span>
                    <span className="font-bold">{metrics.conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Win/Loss Ratio</span>
                    <span className="font-bold">
                      {metrics.lost > 0 ? (metrics.converted / metrics.lost).toFixed(1) : '∞'}:1
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quotes.slice(0, 5).map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{quote.quoteNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {quote.client?.name || quote.prospectName}
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(quote.status)}
                        <div className="text-sm text-muted-foreground mt-1">
                          {new Date(quote.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}