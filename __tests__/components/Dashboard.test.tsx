import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { expect, describe, it } from "@jest/globals";

// Mock the components that Dashboard depends on
jest.mock("@/components/ui/metrics-card", () => ({
  MetricsCard: ({
    title,
    value,
  }: {
    title: string;
    value: string | number;
  }) => (
    <div data-testid="metrics-card">
      <div>{title}</div>
      <div>{value}</div>
    </div>
  ),
}));

// Mock the Apollo client
jest.mock("@apollo/client", () => ({
  useQuery: jest.fn(() => ({
    loading: false,
    error: null,
    data: {
      payrolls_aggregate: { aggregate: { count: 10 } },
      clients_aggregate: { aggregate: { count: 5 } },
      active_payrolls_aggregate: { aggregate: { count: 8 } },
      upcoming_payroll_dates_aggregate: { aggregate: { count: 3 } },
    },
  })),
  gql: jest.fn(),
}));

describe("Dashboard", () => {
  it("displays user metrics", async () => {
    // Import the component after mocking its dependencies
    const { default: Dashboard } = await import(
      "@/app/(dashboard)/dashboard/page"
    );

    render(<Dashboard />);

    // Check if metrics cards are displayed
    const metricCards = screen.getAllByTestId("metrics-card");
    expect(metricCards.length).toBeGreaterThan(0);

    // Check if the page title is displayed
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it("shows loading state when data is loading", async () => {
    // Mock the loading state
    require("@apollo/client").useQuery.mockReturnValueOnce({
      loading: true,
      error: null,
      data: null,
    });

    const { default: Dashboard } = await import(
      "@/app/(dashboard)/dashboard/page"
    );

    render(<Dashboard />);

    // Check if loading indicator is displayed
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows error state when there is an error", async () => {
    // Mock the error state
    require("@apollo/client").useQuery.mockReturnValueOnce({
      loading: false,
      error: new Error("Failed to load data"),
      data: null,
    });

    const { default: Dashboard } = await import(
      "@/app/(dashboard)/dashboard/page"
    );

    render(<Dashboard />);

    // Check if error message is displayed
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
