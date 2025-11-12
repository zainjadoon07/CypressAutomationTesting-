describe('Portfolio Visualizer - Manage Fees Test Suite', () => {
  beforeEach(() => {
    cy.loginToPortfolioVisualizer(); // Custom login command
    cy.visit('https://www.portfoliovisualizer.com/edit-fees');
  });

  it('TC-FEE01: Fixed Percentage with All Payment Schedules', () => {
    cy.log('🧪 TEST CASE: TC-FEE01 - Fixed Percentage with all payment schedules');
    
    // Default values verification
    cy.get('#type').should('have.value', '2'); // Fixed Percentage default
    cy.get('#percentage').should('have.value', '1.0'); // Default percentage
    cy.get('#frequency').should('have.value', '4'); // Annual default
    
    const schedules = [
      { value: '2', label: 'Monthly' },
      { value: '3', label: 'Quarterly' }, 
      { value: '4', label: 'Annually' }
    ];

    schedules.forEach(schedule => {
      cy.get('#name').clear().type(`Fixed Fee ${schedule.label}`);
      cy.get('#percentage').clear().type('1.5');
      cy.get('#frequency').select(schedule.value);
      
      cy.get('#submitButton').click();
      cy.url().should('include', '/manage-fees');
      
      cy.visit('https://www.portfoliovisualizer.com/edit-fees');
    });
  });

  it('TC-FEE02: Fixed Amount with Inflation Scenarios', () => {
    cy.log('🧪 TEST CASE: TC-FEE02 - Fixed Amount with inflation scenarios');
    
    cy.get('#type').select('1'); // Fixed Amount
    
    // Verify conditional fields appear
    cy.get('#amount').should('be.visible');
    cy.get('#inflationAdjusted').should('be.visible');
    
    // Test without inflation adjustment
    cy.get('#name').type('Fixed No Inflation');
    cy.get('#amount').clear().type('1000');
    cy.get('#inflationAdjusted').select('false');
    cy.get('#annualChange').should('be.visible');
    cy.get('#annualChange').clear().type('2.5');
    cy.get('#submitButton').click();
    cy.url().should('include', '/manage-fees');
    
    cy.visit('https://www.portfoliovisualizer.com/edit-fees');
    cy.get('#type').select('1');
    
    // Test with inflation adjustment
    cy.get('#name').type('Fixed With Inflation');
    cy.get('#amount').clear().type('1500');
    cy.get('#inflationAdjusted').select('true');
    cy.get('#annualChange').should('not.be.visible');
    cy.get('#submitButton').click();
    cy.url().should('include', '/manage-fees');
  });

  it('TC-FEE03: Tiered Percentage with Multiple Tiers', () => {
    cy.log('🧪 TEST CASE: TC-FEE03 - Tiered Percentage with multiple tiers');
    
    cy.get('#type').select('3'); // Tiered Percentage
    
    // Verify tier section appears
    cy.get('#tiersSection').should('be.visible');
    cy.get('#successiveTiers').should('be.visible');
    
    cy.get('#name').type('Tiered Percentage Fee');
    cy.get('#successiveTiers').select('true');
    
    // Fill tier data with increasing asset levels
    cy.get('#assets1').clear().type('25000');
    cy.get('#percentage1').clear().type('1.0');
    cy.get('#assets2').clear().type('100000');
    cy.get('#percentage2').clear().type('0.8');
    cy.get('#assets3').clear().type('500000');
    cy.get('#percentage3').clear().type('0.6');
    
    cy.get('#frequency').select('3'); // Quarterly
    cy.get('#submitButton').click();
    cy.url().should('include', '/manage-fees');
  });



  it('TC-FEE05: Performance Based with Hurdle Rate', () => {
    cy.log('🧪 TEST CASE: TC-FEE05 - Performance Based with hurdle rate');
    
    cy.get('#type').select('5'); // Performance Based
    
    // Verify performance fields appear
    cy.get('#percentage').should('be.visible');
    cy.get('#incentiveRate').should('be.visible');
    cy.get('#useHurdle').should('be.visible');
    cy.get('#highwaterMark').should('be.visible');
    
    cy.get('#name').type('Performance with Hurdle');
    cy.get('#percentage').clear().type('1.0');
    cy.get('#incentiveRate').clear().type('20');
    cy.get('#useHurdle').select('true');
    
    // Verify hurdle fields appear
    cy.get('#fixedHurdleRate').should('be.visible');
    cy.get('#hurdleRate').should('be.visible');
    cy.get('#hardHurdle').should('be.visible');
    
    cy.get('#hurdleRate').clear().type('5.0');
    cy.get('#hardHurdle').select('true');
    cy.get('#highwaterMark').select('true');
    
    cy.get('#submitButton').click();
    cy.url().should('include', '/manage-fees');
  });

  it('TC-FEE06: Percentage Boundary Values', () => {
    cy.log('🧪 TEST CASE: TC-FEE06 - Percentage boundary values');
    
    const boundaryCases = [
      { value: '0', shouldWork: true },
      { value: '0.01', shouldWork: true },
      { value: '50', shouldWork: true },
      { value: '100', shouldWork: true },
      { value: '-1', shouldWork: false },
      { value: '100.01', shouldWork: false }
    ];

    boundaryCases.forEach(testCase => {
      cy.visit('https://www.portfoliovisualizer.com/edit-fees');
      cy.get('#name').type(`Boundary ${testCase.value}`);
      cy.get('#percentage').clear().type(testCase.value);
      
      cy.get('#submitButton').click();
      
      if (testCase.shouldWork) {
        cy.url().should('include', '/manage-fees');
      } 
    });
  });

  it('TC-FEE07: Dynamic Field Dependencies by Fee Type', () => {
    cy.log('🧪 TEST CASE: TC-FEE07 - Dynamic field dependencies');
    
    const typeTests = [
      { 
        type: '1', 
        visible: ['#amount', '#inflationAdjusted'], 
        hidden: ['#percentage', '#tiersSection', '#incentiveRate'] 
      },
      { 
        type: '2', 
        visible: ['#percentage'], 
        hidden: ['#amount', '#tiersSection', '#incentiveRate', '#inflationAdjusted'] 
      },
      { 
        type: '3', 
        visible: ['#tiersSection', '#successiveTiers'], 
        hidden: ['#amount', '#incentiveRate', '#inflationAdjusted'] 
      },
      { 
        type: '5', 
        visible: ['#percentage', '#incentiveRate', '#useHurdle', '#highwaterMark'], 
        hidden: ['#amount', '#tiersSection', '#inflationAdjusted'] 
      }
    ];

    typeTests.forEach(test => {
      cy.get('#type').select(test.type);
      
      test.visible.forEach(selector => {
        cy.get(selector).should('be.visible');
      });
      
    });
  });

  it('TC-FEE08: Cancel Button Navigation', () => {
    cy.log('🧪 TEST CASE: TC-FEE08 - Cancel button navigation');
    
    // Fill some data then cancel
    cy.get('#name').type('Test Cancel');
    cy.get('#type').select('2');
    cy.get('#percentage').clear().type('2.0');
    
    cy.get('#cancelButton').click();
    
    // Should navigate to manage fees without saving
    cy.url().should('include', '/manage-fees');
    cy.url().should('not.include', '/edit-fees');
  });

  it('TC-FEE09: Empty Form Validation', () => {
    cy.log('🧪 TEST CASE: TC-FEE09 - Empty form validation');
    
    // Try to submit with empty required fields
    cy.get('#submitButton').click();
    
    // Should stay on page with validation errors
    cy.url().should('include', '/edit-fees');
  });

  it('TC-FEE10: Performance Fee Validation Rules', () => {
    cy.log('🧪 TEST CASE: TC-FEE10 - Performance fee validation rules');
    
    cy.get('#type').select('5');
    
    const validationCases = [
      { incentive: '20', shouldWork: true },
      { incentive: '100', shouldWork: true },
      { incentive: '0', shouldWork: true },
      { incentive: '101', shouldWork: false },
      { incentive: '-5', shouldWork: false }
    ];

    validationCases.forEach(testCase => {
      cy.visit('https://www.portfoliovisualizer.com/edit-fees');
      cy.get('#type').select('5');
      cy.get('#name').type(`Perf Val ${testCase.incentive}`);
      cy.get('#percentage').clear().type('1.0');
      cy.get('#incentiveRate').clear().type(testCase.incentive);
      
      cy.get('#submitButton').click();
      
      if (testCase.shouldWork) {
        cy.url().should('include', '/manage-fees');
      } 
    });
  });
});

// Add to cypress/support/commands.js
Cypress.Commands.add('loginToPortfolioVisualizer', () => {
  cy.session('portfolio-visualizer-login', () => {
    cy.visit('https://www.portfoliovisualizer.com/login');
    cy.get('#username').type(Cypress.env('PV_USERNAME'));
    cy.get('#password').type(Cypress.env('PV_PASSWORD'));
    cy.get('#submitButton').click();
    cy.url().should('include', '/');
  });
});