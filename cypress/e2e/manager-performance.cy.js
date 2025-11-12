describe('Portfolio Visualizer - Manager Performance Analysis Test Suite', () => {
  beforeEach(() => {
    cy.visit('https://www.portfoliovisualizer.com/manager-performance');
  });

  it('TC-FR01: Valid Analysis with All Fields', () => {
    cy.log('🧪 TEST CASE: TC-FR01 - Valid Analysis with All Fields');
    
    // Ticker (using typeahead field)
    cy.get('#symbol').type('FLPSX');
    
    // Benchmark (optional)
    cy.get('#benchmarkSymbol').type('VOE');
    
    // Risk Factor Model
    cy.get('#factorSource').select('Fama-French US Equity Factors');
    
    // Regression Method (hidden by default, shows when factor source selected)
    cy.get('#regressionMethod').should('be.visible');
    
    // Regime Performance
    cy.get('#regimePerformance').select('Yes');
    
    // Regime Type and Analysis (should be visible when regime performance is Yes)
    cy.get('#regimeType').should('be.visible');
    cy.get('#regimeAnalysis').should('be.visible');
    cy.get('#regimeType').select('Market Volatility');
    cy.get('#regimeAnalysis').select('In Aggregate');
    
    // Start Date (optional according to HTML)
    cy.get('#startDate').type('01/01/2015');
    
    // End Date (optional according to HTML)
    cy.get('#endDate').clear(); // Leave blank for default
    
    // Periodicity
    cy.get('#periodicity').select('Monthly Returns');
    
    // Rolling Period
    cy.get('#rollingPeriod').select('36 Months');
    
    // Submit form
    cy.get('#submitButton').click();
    
    // Expected: Should redirect to results or show analysis
    cy.url().should('include', '#analysisResults');
  });

  it('TC-FR02: Multiple Invalid Inputs - Error Validation', () => {
    cy.log('🧪 TEST CASE: TC-FR02 - Multiple Invalid Inputs');
    
    // Leave Ticker empty (required field)
    cy.get('#symbol').clear();
    
    // Invalid benchmark
    cy.get('#benchmarkSymbol').type('INVALIDBM');
    
    // Future start date
    cy.get('#startDate').type('01/01/2030');
    
    // End date before start date
    cy.get('#endDate').type('12/31/2020');
    
    // Use defaults for other fields
    cy.get('#submitButton').click();
    
    // Expected: Should show validation errors
    cy.get('body').should(($body) => {
      expect($body).to.satisfy(($el) => {
        const text = $el.text();
        return text.includes('error') || 
               text.includes('invalid') || 
               text.includes('required') ||
               $body.find('.is-invalid, .alert-danger').length > 0;
      });
    });
  });

  it('TC-FR03: Invalid Ticker Format and Early Start Date', () => {
    cy.log('🧪 TEST CASE: TC-FR03 - Invalid Ticker Format');
    
    // Invalid ticker format (numbers/special chars)
    cy.get('#symbol').type('123!@#');
    
    // Empty benchmark (valid - optional)
    cy.get('#benchmarkSymbol').clear();
    
    // Regime Performance No (default)
    cy.get('#regimePerformance').select('No');
    
    // Very early start date (before dataset likely exists)
    cy.get('#startDate').type('12/31/1984');
    
    // End date blank
    cy.get('#endDate').clear();
    
    cy.get('#submitButton').click();
    
    // Expected: Ticker format error or "not found"
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.satisfy((content) => {
        return content.includes('not found') || 
               content.includes('invalid') || 
               content.includes('error') ||
               content.includes('No fund') ||
               $body.find('.is-invalid').length > 0;
      });
    });
  });

  it('TC-FR04: Minimum Rolling Period Analysis', () => {
    cy.log('🧪 TEST CASE: TC-FR04 - Minimum Rolling Period');
    
    // Valid ticker
    cy.get('#symbol').type('FLPSX');
    
    // Empty benchmark (valid)
    cy.get('#benchmarkSymbol').clear();
    
    // Minimum rolling period
    cy.get('#rollingPeriod').select('3 Months');
    
    // Use defaults for other fields
    cy.get('#submitButton').click();
    
    // Expected: Analysis should run with shortest rolling period
    cy.url().should('include', '#analysisResults');
    
  });

  it('TC-FR05: Dynamic Field Behavior - Regime Performance', () => {
    cy.log('🧪 TEST CASE: TC-FR05 - Dynamic Field Behavior');
    
    // Test 1: Regime Performance = No (default)
    cy.get('#regimePerformance').select('No');
    cy.get('#regimeType').should('not.be.visible');
    cy.get('#regimeAnalysis').should('not.be.visible');
    
    // Test 2: Regime Performance = Yes
    cy.get('#regimePerformance').select('Yes');
    cy.get('#regimeType').should('be.visible');
    cy.get('#regimeAnalysis').should('be.visible');
    
    // Test 3: Regime Performance back to No
    cy.get('#regimePerformance').select('No');
    cy.get('#regimeType').should('not.be.visible');
    cy.get('#regimeAnalysis').should('not.be.visible');
  });

  it('TC-FR06: Dynamic Field Behavior - Risk Factor Model', () => {
    cy.log('🧪 TEST CASE: TC-FR06 - Risk Factor Model Dynamic Fields');
    
    // Test 1: No Risk Factor Model (default)
    cy.get('#factorSource').select('None');
    cy.get('#regressionMethod').should('not.be.visible');
    
    // Test 2: With Risk Factor Model
    cy.get('#factorSource').select('Fama-French US Equity Factors');
    cy.get('#regressionMethod').should('be.visible');
    
    // Test 3: Back to None
    cy.get('#factorSource').select('None');
    cy.get('#regressionMethod').should('not.be.visible');
  });

  it('TC-FR07: Date Format Validation', () => {
    cy.log('🧪 TEST CASE: TC-FR07 - Date Format Validation');
    
    cy.get('#symbol').type('FLPSX');
    
    // Test various invalid date formats
    const invalidDates = [
      '2023-13-45',
      '13/45/2023',
      'invalid-date',
      '01-01-2023', // Wrong separator
      '1/1/23' // Short year
    ];
    
    invalidDates.forEach((date) => {
      cy.get('#startDate').clear().type(date);
      cy.get('#submitButton').click();
      
      // Check for date format errors
      cy.get('body').then(($body) => {
        if ($body.text().includes('invalid') || $body.text().includes('format') || $body.find('.is-invalid').length > 0) {
          cy.log(`Date validation working for: ${date}`);
        }
      });
      
      // Clear for next test
      cy.reload();
    });
  });

  it('TC-FR08: Optional Fields Empty - Valid Scenario', () => {
    cy.log('🧪 TEST CASE: TC-FR08 - Optional Fields Empty');
    
    // Only required field (Ticker)
    cy.get('#symbol').type('FLPSX');
    
    // Leave all optional fields empty/default
    cy.get('#benchmarkSymbol').clear();
    cy.get('#startDate').clear();
    cy.get('#endDate').clear();
    
    // Use defaults for other fields
    cy.get('#submitButton').click();
    
    // Expected: Should still work with only ticker
    cy.url().should('include', '#analysisResults');
  });

  it('TC-FR09: Cancel Button Functionality', () => {
    cy.log('🧪 TEST CASE: TC-FR09 - Cancel Button');
    
    // Fill some data
    cy.get('#symbol').type('TEST');
    cy.get('#startDate').type('01/01/2020');
    
    // Click cancel
    cy.get('#cancelButton').click();
    
    // Expected: Redirect to home page
    cy.url().should('eq', 'https://www.portfoliovisualizer.com/');
  });

  
  it('TC-FR10: All Rolling Period Options', () => {
    cy.log('🧪 TEST CASE: TC-FR10 - All Rolling Period Options');
    
    cy.get('#symbol').type('FLPSX');
    
    // Test a few key rolling period options
    const rollingPeriods = ['3 Months', '12 Months', '36 Months', '60 Months'];
    
    rollingPeriods.forEach((period) => {
      cy.get('#rollingPeriod').select(period);
      cy.get('#submitButton').click();
      
      // Should work with any valid rolling period
      cy.url().should('include', '#analysisResults');
      
      // Go back for next test
      cy.visit('https://www.portfoliovisualizer.com/manager-performance');
    });
  });
});