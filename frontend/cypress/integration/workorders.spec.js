/// <reference types="cypress" />

context("Actions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3137/workorders");
  });

  it("View & Create Work Orders", () => {
    cy.get('[data-test-id="create-work-order-link"]').click();
    cy.get('[data-test-id="work-order-name"]').type("New Work Order");
    cy.get('[data-test-id="create-work-order-button"]').click();
    cy.wait(1000);
    cy.get('[data-test-id="work-orders-link"]').click();

    cy.get("tr").contains("New Work Order");
  });

  it("Toggle work order status", () => {
    cy.get("tr").contains("New Work Order").click();
    cy.get('[data-test-id="toggle-work-order-status"]').contains(
      "CLOSE WORK ORDER"
    );
    cy.get('[data-test-id="toggle-work-order-status"]').click();
    cy.wait(1000);
    cy.get('[data-test-id="toggle-work-order-status"]').contains(
      "OPEN WORK ORDER"
    );
  });

  it("View Unassigned Users for Work Orders", () => {
    cy.get('[data-test-id="productivity-link"]').click();
    cy.get('[data-test-id="unassigned-users"]').contains("Evil Morty");
    cy.get('[data-test-id="create-work-order-link"]').click();
    cy.get('[data-test-id="work-order-name"]').type("New Work Order");
    cy.get("span").contains("Evil Morty").click();
    cy.get("span").contains(">").click();
    cy.get('[data-test-id="create-work-order-button"]').click();
    cy.wait(1000);
    cy.get('[data-test-id="productivity-link"]').click();
    cy.get('[data-test-id="unassigned-users"]')
      .contains("Evil Morty")
      .should("not.exist");
  });
});
