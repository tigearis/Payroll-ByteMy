describe("Payroll Management", () => {
  beforeEach(() => {
    // Assuming you have a way to seed a test user
    cy.visit("/payrolls/new")
    cy.login("admin@example.com", "password123")
  })

  it("creates a new payroll", () => {
    cy.visit("/payrolls/new")
    cy.get('input[name="name"]').type("New Test Payroll")
    cy.get('select[name="client_id"]').select("1")
    cy.get('select[name="cycle_id"]').select("1")
    cy.get('select[name="date_type_id"]').select("1")
    cy.get('input[name="processing_days_before_eft"]').type("2")
    cy.get('button[type="submit"]').click()

    cy.url().should("include", "/payrolls")
    cy.contains("New Test Payroll").should("be.visible")
  })

  it("views payroll details", () => {
    cy.visit("/payrolls")
    cy.contains("New Test Payroll").click()
    cy.url().should("include", "/payrolls/")
    cy.contains("Payroll Details").should("be.visible")
    cy.contains("New Test Payroll").should("be.visible")
  })
})

