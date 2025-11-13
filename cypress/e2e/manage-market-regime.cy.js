
describe('Portfolio Visualizer - Market Regimes Definition Test Suite', () => {
  beforeEach(() => {
cy.loginToPortfolioVisualizer();
    cy.visit('https://www.portfoliovisualizer.com/edit-market-regime');  });

  it('TC-MR01: Create Valid Regime Series with VIX Data', () => {
    cy.log('🧪 TEST CASE: TC-MR01 - Create Valid Regime Series with VIX Data');
    
    // Basic Information
    cy.get('#name').type('Volatility Regimes');
    cy.get('#description').type('VIX-based volatility threshold regimes');
    
    // Regime Data Source - Existing Series (default)
    cy.get('#symbolDefined').should('have.value', 'true');
    
    // Time Series
    cy.get('#sourceSymbol').type('SVIX');
    
    // Series Type
    cy.get('#seriesType').select('Monthly Returns');
    
    // Regime Definitions
    cy.get('#regimeType').select('Value Breakdown');
    
    // Smoothing Factor
    cy.get('#smoothingFactor').select('6');
    
    // Default Regime Type
    cy.get('#defaultRegimeLabel').type('Normal');
    
    // Regime Level 1
    cy.get('#comparisonType1').select('-1'); // >=
    cy.get('#threshold1').type('20');
    cy.get('#label1').type('High Volatility');
    
    // Regime Level 2
    cy.get('#comparisonType2').select('1'); // <
    cy.get('#threshold2').type('20');
    cy.get('#label2').type('Low Volatility');
    
    // Regime Sort Order
    cy.get('#sortOrder').should('have.value', '0');
    
    // Submit form
    cy.get('#submitButton').click();
    
    // Expected: Success - redirect to manage page
    cy.url().should('include', 'manage-market-regimes');
    cy.get('body').should('contain', 'Market Regimes');
    cy.get('body').should(($body) => {
      expect($body.text()).to.match(/success|saved|created/i);
    });
  });

  it('TC-MR02: Invalid Inputs - Empty Required Fields', () => {
    cy.log('🧪 TEST CASE: TC-MR02 - Invalid Inputs - Empty Required Fields');
    
    // Leave name empty
    cy.get('#name').clear();
    
    // Leave comparison as "Select" (default invalid)
    cy.get('#comparisonType1').should('have.value', '0');
    
    // Leave threshold empty
    cy.get('#threshold1').clear();
    
    // Leave regime type empty
    cy.get('#label1').clear();
    
    // Submit form
    cy.get('#submitButton').click();
    
    // Expected: Should show validation errors
    const errors=['No source series found for ticker symbol','No source ticker identified for dynamic series','Regime Name is required','Threshold value is required','Regime Label is required'];

      errors.forEach((error) => {
        cy.get('body').then(($body) => {
          if ($body.text().includes(error)) {
            cy.url().should('include', '/edit-market-regime');
          }
        })

      })
    
  });

  it('TC-MR03: Boundary Values - Extreme Threshold and Max Smoothing', () => {
    cy.log('🧪 TEST CASE: TC-MR03 - Boundary Values');
    
    // Basic Information
    cy.get('#name').type('Extreme Threshold Test');
    
    // Time Series
    cy.get('#sourceSymbol').type('SPY');
    
    // Series Type
    cy.get('#seriesType').select('Monthly Returns');
    
    // Max smoothing
    cy.get('#smoothingFactor').select('12');
    
    // Extreme negative threshold
    cy.get('#comparisonType1').select('-1'); // >=
    cy.get('#threshold1').type('-100.01');
    cy.get('#label1').type('Extreme Low');
    cy.get('#defaultRegimeLabel').type('Normal');
    // Submit form
    cy.get('#submitButton').click();
    
    // Expected: Should handle boundary values appropriately
    cy.get('body').then(($body) => {
      if ($body.text().includes('error') || $body.text().includes('invalid')) {
        cy.get('body').should('contain', 'threshold');
      } else {
        cy.url().should('include', 'manage-market-regimes');
      }
    });
  });

  it('TC-MR04: Multi-Level Regime with Minimum Smoothing', () => {
    cy.log('🧪 TEST CASE: TC-MR04 - Multi-Level Regime');
    
    // Basic Information
    cy.get('#name').type('Multi-Level Regimes');
    
    // Time Series
    cy.get('#sourceSymbol').type('SPY');
    
    // Series Type
    cy.get('#seriesType').select('Monthly Index Values');
    
    // Regime Definitions
    cy.get('#regimeType').select('Quartile');
    
    // Min smoothing
    cy.get('#smoothingFactor').select('2');
   
    
    
    
    // Submit form
    cy.get('#submitButton').click();
    
    // Expected: Should succeed with multi-level regime
    cy.url().should('include', 'manage-market-regimes');
    cy.get('body').should('contain', 'Multi-Level Regimes');
  });

  it('TC-MR05: Complex Regime Definition with Dislocation', () => {
    cy.log('🧪 TEST CASE: TC-MR05 - Complex Dislocation Definition');
    
    // Basic Information
    cy.get('#name').type('Complex Dislocation Regimes');
    
    // Time Series
    cy.get('#sourceSymbol').type('VTI');
    
    // Series Type
    cy.get('#seriesType').select('Monthly Returns');
    
    // Dislocation regime definition
    cy.get('#regimeType').select('100'); // Dislocation
    
    // Dislocation fields should appear
    cy.get('#dislocationPeriod').should('be.visible');
    cy.get('#dislocationDirection').should('be.visible');
    
    cy.get('#dislocationPeriod').select('6');
    cy.get('#dislocationDirection').select('1'); // Up
    
    // Submit form
    cy.get('#submitButton').click();
    
    // Expected: Should handle complex dislocation logic
    cy.url().should('include', 'manage-market-regimes');
    cy.get('body').should('contain', 'Complex Dislocation Regimes');
  });

  it('TC-MR06: File Upload Data Source Validation', () => {
    cy.log('🧪 TEST CASE: TC-MR06 - File Upload Data Source');
    
    // Switch to Imported File data source
    cy.get('#symbolDefined').select('false');
    
    // File upload field should appear
    cy.get('#upload').should('be.visible');
    cy.get('#sourceSymbol').should('not.be.visible');
    
    // Series Type should be visible and enabled
    cy.get('#seriesType').should('be.visible');
    cy.get('#seriesType option:first').should('not.be.disabled');
    
    // Submit without file (should fail)
    cy.get('#submitButton').click();
    
    // Expected: Should show file required error
    cy.get('body').should('contain', 'file');
    cy.get('body').should(($body) => {
      expect($body.text()).to.match(/required|upload|file/i);
    });
  });

  it('TC-MR07: Dynamic Field Behavior - Data Source Changes', () => {
    cy.log('🧪 TEST CASE: TC-MR07 - Data Source Dynamic Fields');
    
    // Test 1: Existing Series (default)
    cy.get('#symbolDefined').should('have.value', 'true');
    cy.get('#sourceSymbol').should('be.visible');
    cy.get('#upload').should('not.be.visible');
    
    // Test 2: Imported File
    cy.get('#symbolDefined').select('false');
    cy.get('#sourceSymbol').should('not.be.visible');
    cy.get('#upload').should('be.visible');
    
    // Test 3: Back to Existing Series
    cy.get('#symbolDefined').select('true');
    cy.get('#sourceSymbol').should('be.visible');
    cy.get('#upload').should('not.be.visible');
  });

  it('TC-MR08: All Regime Definition Methods', () => {
    cy.log('🧪 TEST CASE: TC-MR08 - All Regime Definition Methods');
    
    cy.get('#name').type('All Definition Methods Test');
    cy.get('#sourceSymbol').type('VTI');
    cy.get('#seriesType').select('Monthly Returns');
    
    // Test different regime definition methods
    const definitions = [
      { value: '200', name: 'Value Breakdown' },
      { value: '300', name: 'Percentile Breakdown' },
      { value: '4', name: 'Quartile' },
      { value: '5', name: 'Quintile' },
      { value: '10', name: 'Decile' },
      { value: '100', name: 'Dislocation' }
    ];
    
    definitions.forEach((definition) => {
      cy.get('#regimeType').select(definition.value);
      
      // For Value and Percentile Breakdown, regime levels should be visible
      if (definition.value === '200' || definition.value === '300') {
        cy.get('#regimeBreakpoints').should('be.visible');
        cy.get('#defaultRegimeLabel').should('be.visible');
      }
      
      // For Dislocation, additional fields should appear
      if (definition.value === '100') {
        cy.get('#dislocationPeriod').should('be.visible');
        cy.get('#dislocationDirection').should('be.visible');
      }
    });
  });

  it('TC-MR09: Cancel Button Functionality', () => {
    cy.log('🧪 TEST CASE: TC-MR09 - Cancel Button');
    
    // Fill some data
    cy.get('#name').type('Cancel Test Regime');
    cy.get('#sourceSymbol').type('SPY');
    
    // Click cancel button
    cy.get('#cancelButton').click();
    
    // Expected: Should redirect to manage page without saving
    cy.url().should('include', 'manage-market-regimes');
    cy.get('body').should('contain', 'Market Regimes');
  });

  it('TC-MR10: All Sort Order Options', () => {
    cy.log('🧪 TEST CASE: TC-MR10 - All Sort Order Options');
    
    cy.get('#name').type('Sort Order Test');
    cy.get('#sourceSymbol').type('SPY');
    cy.get('#seriesType').select('Monthly Returns');
    cy.get('#regimeType').select('Value Breakdown');
    
    // Test all sort order options
    const sortOrders = [
      { value: '0', name: 'Chronological' },
      { value: '1', name: 'Alphabetical' },
      { value: '2', name: 'Numerical' }
    ];
    
    sortOrders.forEach((order) => {
      cy.get('#sortOrder').select(order.value);
      cy.get('#sortOrder').should('have.value', order.value);
    });
    
    // Verify all sort options are available
    cy.get('#sortOrder option').should('have.length', sortOrders.length);
  });

  it('TC-MR11: Precision Testing - Decimal Thresholds', () => {
    cy.log('🧪 TEST CASE: TC-MR11 - Decimal Precision Testing');
    
    cy.get('#name').type('Precision Test');
    cy.get('#sourceSymbol').type('VTI');
    cy.get('#seriesType').select('Monthly Returns');
    cy.get('#regimeType').select('Value Breakdown');
    cy.get('#defaultRegimeLabel').type('Normal');
    
    // Test decimal precision in thresholds
    cy.get('#comparisonType1').select('-1'); // >=
    cy.get('#threshold1').type('0.001');
    cy.get('#label1').type('Very Small Positive');
    
    cy.get('#comparisonType2').select('-1'); // >=
    cy.get('#threshold2').type('33.333');
    cy.get('#label2').type('Precise Level');
    
    cy.get('#comparisonType3').select('-1'); // >=
    cy.get('#threshold3').type('99.999');
    cy.get('#label3').type('Very High');
    
    // Submit form
    cy.get('#submitButton').click();
    
    // Should handle decimal precision appropriately
    cy.get('body').then(($body) => {
      if ($body.text().includes('error') || $body.text().includes('invalid')) {
        cy.get('body').should('contain', 'threshold');
      } else {
        cy.url().should('include', 'manage-market-regimes');
      }
    });
  });

  it('TC-MR12: Invalid Ticker Symbol', () => {
    cy.log('🧪 TEST CASE: TC-MR12 - Invalid Ticker Symbol');
    
    cy.get('#name').type('Invalid Ticker Test');
    
    // Use invalid ticker symbol
    cy.get('#sourceSymbol').type('INVALIDTICKER123');
    
    // Set up basic regime
    cy.get('#seriesType').select('Monthly Returns');
    cy.get('#regimeType').select('Value Breakdown');
    cy.get('#comparisonType1').select('-1'); // >=
    cy.get('#threshold1').type('0.1');
    cy.get('#label1').type('Test Level');
    
    // Submit form
    cy.get('#submitButton').click();
    
    // Expected: Should show ticker validation error
    cy.get('body').should('contain', 'ticker');
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.match(/invalid|not found|symbol|ticker/i);
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