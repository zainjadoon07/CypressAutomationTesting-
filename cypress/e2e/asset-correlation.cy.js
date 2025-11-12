describe('Portfolio Visualizer - Asset Correlations Test Suite', () => {
  beforeEach(() => {
    cy.visit('https://www.portfoliovisualizer.com/asset-correlations');
  });

  it('TC-AC01: Valid 3-Asset Correlation with Monthly Returns', () => {
    cy.log('🧪 TEST CASE: TC-AC01 - Valid 3-asset correlation');
    
    // Tickers: VTI, BND, VXUS
    cy.get('#symbols').type('VTI, BND, VXUS');
    
    // Start Date: 01/01/2020
    cy.get('#startDate').type('01/01/2020');
    
    // End Date: 12/31/2023
    cy.get('#endDate').type('12/31/2023');
    
    // Correlation Basis: Monthly Returns (default)
    cy.get('#timePeriod').should('have.value', '2');
    
    // Rolling Correlation: 36 Months (default)
    cy.get('#months').should('have.value', '36');
    
    cy.get('#submitButton').click();
    
    // Expected: Shows correlation matrix and rolling correlation charts
    cy.url().should('include', '#analysisResults');
    
  });

  it('TC-AC02: Multiple Validation Errors', () => {
    cy.log('🧪 TEST CASE: TC-AC02 - Multiple validation errors');
    
    // Tickers: Leave Blank
    cy.get('#symbols').clear();
    
    // Start Date: Future date (01/01/2030)
    cy.get('#startDate').type('01/01/2030');
    
    // End Date: Before start date (12/31/2019)
    cy.get('#endDate').type('12/31/2019');
    
    cy.get('#submitButton').click();
    
    // Expected: Multiple errors for empty tickers and invalid dates
    cy.get('body').should(($body) => {
      expect($body.text()).to.match(/(error|invalid|required|ticker)/i);
    });
  });

  it('TC-AC03: Single Ticker Error', () => {
    cy.log('🧪 TEST CASE: TC-AC03 - Single ticker error');
    
    // Tickers: Only VTI (single ticker)
    cy.get('#symbols').type('VTI');
    
    // Start Date: Leave Blank
    cy.get('#startDate').should('have.attr', 'placeholder', 'MM/DD/YYYY (optional)');
    
    // End Date: Leave Blank
    cy.get('#endDate').should('have.attr', 'placeholder', 'MM/DD/YYYY (optional)');
    
    // Rolling Correlation: Minimum (12 Months)
    cy.get('#months').select('12');
    
    cy.get('#submitButton').click();
    
    // Expected: "At least two tickers required" error
    cy.get('body').should(($body) => {
      expect($body.text()).to.match(/(error|at least two|multiple|ticker)/i);
    });
  });

  it('TC-AC04: Invalid Ticker with Boundary Dates', () => {
    cy.log('🧪 TEST CASE: TC-AC04 - Invalid ticker with boundary dates');
    
    // Tickers: VTI, INVALID
    cy.get('#symbols').type('VTI, INVALID');
    
    // Start Date: Very early (12/31/1984)
    cy.get('#startDate').type('12/31/1984');
    
    // End Date: Leave Blank (use most recent)
    cy.get('#endDate').clear();
    
    // Correlation Basis: Daily Returns
    cy.get('#timePeriod').select('1');
    
    // Rolling Correlation: Maximum (60 Months when visible)
    // Note: Daily returns shows tradingDays, not months
    cy.get('#tradingDays').should('be.visible');
    cy.get('#tradingDays').select('120');
    
    cy.get('#submitButton').click();
    
    // Expected: Unknown ticker symbol error
    cy.get('body').should(($body) => {
      expect($body.text()).to.match(/(error|unknown|invalid|ticker|INVALID)/i);
    });
  });

  it('TC-AC05: Single Year Analysis', () => {
    cy.log('🧪 TEST CASE: TC-AC05 - Single year analysis');
    
    // Tickers: SPY, QQQ, IWM
    cy.get('#symbols').type('SPY, QQQ, IWM');
    
    // Start Date: 01/01/2022
    cy.get('#startDate').type('01/01/2022');
    
    // End Date: 01/02/2023 (single year + 1 day)
    cy.get('#endDate').type('01/02/2023');
    
    cy.get('#submitButton').click();
    
    // Expected: Runs for single year period
    cy.url().should('include', '#analysisResults');
    cy.get('body').should('contain', 'Correlation');
  });

  it('TC-AC06: Different Correlation Basis Options', () => {
    cy.log('🧪 TEST CASE: TC-AC06 - Different correlation basis');
    
    cy.get('#symbols').type('VTI, BND');
    
    // Test Daily Returns
    cy.get('#timePeriod').select('1');
    cy.get('#tradingDays').should('be.visible');
    cy.get('#months').should('not.be.visible');
    cy.get('#tradingDays').select('60');
    
    cy.get('#submitButton').click();
    cy.url().should('include', '#analysisResults');
    
    // Return and test Annual Returns
    cy.visit('https://www.portfoliovisualizer.com/asset-correlations');
    cy.get('#symbols').type('VTI, BND');
    cy.get('#timePeriod').select('4');
    cy.get('#months').should('not.be.visible');
    cy.get('#tradingDays').should('not.be.visible');
    
    cy.get('#submitButton').click();
    cy.url().should('include', '#analysisResults');
  });

  it('TC-AC07: All Rolling Correlation Periods', () => {
    cy.log('🧪 TEST CASE: TC-AC07 - All rolling correlation periods');
    
    cy.get('#symbols').type('VTI, VXUS');
    
    // Test all month-based rolling periods
    const monthPeriods = ['12', '24', '36', '48', '60'];
    
    monthPeriods.forEach((period) => {
      cy.get('#months').select(period);
      cy.get('#submitButton').click();
      
      cy.url().should('include', '#analysisResults');
      
      // Return for next test
      cy.visit('https://www.portfoliovisualizer.com/asset-correlations');
      cy.get('#symbols').type('VTI, VXUS');
    });
  });



  it('TC-AC09: Ticker Search Functionality', () => {
    cy.log('🧪 TEST CASE: TC-AC09 - Ticker search UI');
    
    // Test search button visibility
    cy.get('.ticker-search').should('be.visible');
    
    // Test dropdown menu functionality
    cy.get('.dropdown-toggle').eq(0).click();
    cy.contains('Clear List').should('not.be.visible');
    cy.contains('Upload List').should('not.be.visible');
    
   
  });

  it('TC-AC10: Optional Date Fields', () => {
    cy.log('🧪 TEST CASE: TC-AC10 - Optional date fields');
    
    // Tickers only, no dates specified
    cy.get('#symbols').type('VTI, BND, VXUS');
    
    // Leave both date fields blank (use default range)
    cy.get('#startDate').should('have.attr', 'placeholder', 'MM/DD/YYYY (optional)');
    cy.get('#endDate').should('have.attr', 'placeholder', 'MM/DD/YYYY (optional)');
    
    cy.get('#submitButton').click();
    
    // Should work with default date range
    cy.url().should('include', '#analysisResults');
    cy.get('body').should('contain', 'Correlation');
  });

  it('TC-AC11: Multiple Asset Correlation', () => {
    cy.log('🧪 TEST CASE: TC-AC11 - Multiple assets correlation');
    
    // Test with 5 different assets
    cy.get('#symbols').type('VTI, VXUS, BND, VNQ, GLD');
    
    // Use default dates and settings
    cy.get('#submitButton').click();
    
    // Should handle multiple assets
    cy.url().should('include', '#analysisResults');
  });

 
   it('TC-AC12: Cancel and UI Interactions', () => {
    cy.log('🧪 TEST CASE: TC-AC12 - UI functionality');
    
    // Test cancel button
    cy.get('#cancelButton').click();
    cy.url().should('eq', 'https://www.portfoliovisualizer.com/');
    
    // Return and test calendar icons
    cy.visit('https://www.portfoliovisualizer.com/asset-correlations');
    cy.get('.fa-calendar').should('have.length', 2);
    
    // Test date field formatting
    cy.get('#startDate').should('have.attr', 'maxlength', '10');
    cy.get('#startDate').should('have.attr', 'placeholder', 'MM/DD/YYYY (optional)');
    
    // Test auto-uppercase for tickers
    cy.get('#symbols').type('vti');
    cy.get('#symbols').should('have.class', 'fmt-uppercase');
  });
});