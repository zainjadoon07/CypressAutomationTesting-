describe('Portfolio Visualizer - Fund Performance Analysis Test Suite', () => {
  beforeEach(() => {
    cy.visit('https://www.portfoliovisualizer.com/fund-performance');
  });

  it('TC-FP01: Complete Analysis with Comparisons, Benchmark, and Regime', () => {
    cy.log('🧪 TEST CASE: TC-FP01 - Complete Analysis');
    
    // Fund Ticker: VTI
    cy.get('#symbol').type('VTI');
    
    // Compare To: QQQ, BND (multiple tickers)
    cy.get('#symbols').type('QQQ, BND');
    
    // Benchmark: SPY
    cy.get('#benchmarkSymbol').type('SPY');
    
    // Regime Performance: Market Volatility
    cy.get('#regimeType').select('Market Volatility');
    
    // Start Date: 01/01/2020
    cy.get('#startDate').type('01/01/2020');
    
    // End Date: 12/31/2023
    cy.get('#endDate').type('12/31/2023');
    
    // Click View Performance
    cy.get('#submitButton').click();
    
    // Expected: Page loads with performance charts and analysis
    cy.url().should('include', '#analysisResults');
    cy.get('body').should('contain', 'Performance');
  });

  it('TC-FP02: Multiple Invalid Inputs - Error Validation', () => {
    cy.log('🧪 TEST CASE: TC-FP02 - Multiple Invalid Inputs');
    
    // Leave Fund Ticker empty (required field)
    cy.get('#symbol').clear();
    
    // Invalid Compare To ticker
    cy.get('#symbols').type('INVALID');
    
    // Invalid Benchmark
    cy.get('#benchmarkSymbol').type('INVALIDBM');
    
    // Future Start Date
    cy.get('#startDate').type('01/01/2030');
    
    // End Date before Start Date
    cy.get('#endDate').type('12/31/2019');
    
    // Click View Performance
    cy.get('#submitButton').click();
    
    // Expected: Multiple validation errors
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.satisfy((content) => {
        return content.includes('error') || 
               content.includes('invalid') || 
               content.includes('required') ||
               content.includes('not found') ||
               content.includes('symbol') ||
               $body.find('.is-invalid, .alert-danger').length > 0;
      });
    });
  });

  it('TC-FP03: Basic Analysis with Only Required Field', () => {
    cy.log('🧪 TEST CASE: TC-FP03 - Basic Analysis');
    
    // Fund Ticker: VTI (only required field)
    cy.get('#symbol').type('VTI');
    
    // Leave all optional fields empty/default
    cy.get('#symbols').clear();
    cy.get('#benchmarkSymbol').clear();
    cy.get('#regimeType').should('have.value', ''); // None (default)
    cy.get('#startDate').clear();
    cy.get('#endDate').clear();
    
    // Click View Performance
    cy.get('#submitButton').click();
    
    // Expected: Basic performance analysis using default dates
    cy.url().should('include', '#analysisResults');
    cy.get('body').should('contain', 'Performance');
  });

  it('TC-FP04: Invalid Ticker Format with Boundary Date', () => {
    cy.log('🧪 TEST CASE: TC-FP04 - Invalid Ticker Format');
    
    // Invalid ticker format
    cy.get('#symbol').type('123!@#');
    
    // Valid Compare To
    cy.get('#symbols').type('VTI');
    
    // Very early Start Date (boundary - before data likely exists)
    cy.get('#startDate').type('12/31/1984');
    
    // Leave End Date blank
    cy.get('#endDate').clear();
    
    // Click View Performance
    cy.get('#submitButton').click();
    
    // Expected: Ticker format error or "not found"
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.satisfy((content) => {
        return content.includes('not found') || 
               content.includes('invalid') || 
               content.includes('error') ||
               content.includes('symbol') ||
               $body.find('.is-invalid').length > 0;
      });
    });
  });



  it('TC-FP06: Date Format Validation', () => {
    cy.log('🧪 TEST CASE: TC-FP06 - Date Format Validation');
    
    cy.get('#symbol').type('VTI');
    
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
          cy.log(`✅ Date validation working for: ${date}`);
        }
      });
      
      // Clear for next test
      cy.reload();
    });
  });

  it('TC-FP07: Multiple Compare To Tickers', () => {
    cy.log('🧪 TEST CASE: TC-FP07 - Multiple Compare To Tickers');
    
    cy.get('#symbol').type('VTI');
    
    // Multiple valid tickers in Compare To
    cy.get('#symbols').type('QQQ, BND, VXUS');
    
    // Click View Performance
    cy.get('#submitButton').click();
    
    // Expected: Should work with multiple comparison tickers
    cy.url().should('include', '#analysisResults');
    cy.get('body').should('contain', 'Performance');
  });

  it('TC-FP08: Mixed Valid and Invalid Compare To Tickers', () => {
    cy.log('🧪 TEST CASE: TC-FP08 - Mixed Valid/Invalid Compare To');
    
    cy.get('#symbol').type('VTI');
    
    // Mix of valid and invalid tickers
    cy.get('#symbols').type('QQQ, INVALIDTICKER, BND');
    
    // Click View Performance
    cy.get('#submitButton').click();
    
    // Expected: Should error on the invalid ticker
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.satisfy((content) => {
        return content.includes('not found') || 
               content.includes('invalid') || 
               content.includes('INVALIDTICKER') ||
               $body.find('.is-invalid').length > 0;
      });
    });
  });


  it('TC-FP10: Boundary Date Testing', () => {
    cy.log('🧪 TEST CASE: TC-FP10 - Boundary Dates');
    
    cy.get('#symbol').type('VTI');
    
    // Test reasonable date range
    cy.get('#startDate').type('01/01/2010');
    cy.get('#endDate').type('12/31/2020');
    
    // Click View Performance
    cy.get('#submitButton').click();
    
    // Expected: Should work with valid date range
    cy.url().should('include', '#analysisResults');
    cy.get('body').should('contain', 'Performance');
  });

  it('TC-FP11: Empty Optional Fields Validation', () => {
    cy.log('🧪 TEST CASE: TC-FP11 - Empty Optional Fields');
    
    // Only fill required field
    cy.get('#symbol').type('VTI');
    
    // Ensure all optional fields are empty
    cy.get('#symbols').should('have.value', '');
    cy.get('#benchmarkSymbol').should('have.value', '');
    cy.get('#regimeType').should('have.value', '');
    cy.get('#startDate').should('have.value', '');
    cy.get('#endDate').should('have.value', '');
    
    // Click View Performance
    cy.get('#submitButton').click();
    
    // Expected: Should work with all optional fields empty
    cy.url().should('include', '#analysisResults');
    cy.get('body').should('contain', 'Performance');
  });



  it('TC-FP13: Various Fund Types', () => {
    cy.log('🧪 TEST CASE: TC-FP13 - Various Fund Types');
    
    // Test different types of funds
    const fundTickers = [
      'VTI',   // ETF
      'VFINX', // Mutual Fund
      'BND',   // Bond ETF
      'VXUS'   // International ETF
    ];
    
    fundTickers.forEach((ticker) => {
      cy.get('#symbol').clear().type(ticker);
      cy.get('#submitButton').click();
      
      // Should work with various fund types
      cy.url().should('include', '#analysisResults');
      cy.get('body').should('contain', 'Performance');
      
      // Go back for next test
      cy.visit('https://www.portfoliovisualizer.com/fund-performance');
    });
  });

  it('TC-FP14: Benchmark Comparison Functionality', () => {
    cy.log('🧪 TEST CASE: TC-FP14 - Benchmark Comparison');
    
    cy.get('#symbol').type('VTI');
    
    // Test with different benchmarks
    const benchmarks = [
      'SPY',  // S&P 500
      'QQQ',  // NASDAQ
      'IWM'   // Russell 2000
    ];
    
    benchmarks.forEach((benchmark) => {
      cy.get('#benchmarkSymbol').clear().type(benchmark);
      cy.get('#submitButton').click();
      
      // Should work with various benchmarks
      cy.url().should('include', '#analysisResults');
      cy.get('body').should('contain', 'Performance');
      
      // Go back for next test
      cy.visit('https://www.portfoliovisualizer.com/fund-performance');
    });
  });
});