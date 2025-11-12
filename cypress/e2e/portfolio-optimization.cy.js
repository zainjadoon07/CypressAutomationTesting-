describe('Portfolio Visualizer - Portfolio Optimization Test Suite', () => {
  beforeEach(() => {
    cy.visit('https://www.portfoliovisualizer.com/optimize-portfolio');
  });

  it('TC-PO01: Valid Ticker Portfolio with Weight Constraints', () => {
    cy.log('🧪 TEST CASE: TC-PO01 - Tickers with constraints (TC-EF01)');
    
    // Portfolio Type: Tickers (default)
    cy.get('#mode').should('have.value', '2');
    
    // Time Period: Year-to-Year (default) 
    cy.get('#timePeriod').should('have.value', '4');
    
    // Date Range
    cy.get('#startYear').select('2010');
    cy.get('#endYear').select('2020');
    
    // Optimization Goal: Maximize Sharpe Ratio (default)
    cy.get('#goal').should('have.value', '2');
    
    // Asset Constraints: Yes (default)
    cy.get('#constrained').should('have.value', 'true');
    
    // Add assets with weight constraints
    cy.get('#symbol1').type('VTI');
    cy.get('#minWeight1').type('20');
    cy.get('#maxWeight1').type('80');
    
    cy.get('#symbol2').type('BND');
    cy.get('#minWeight2').type('20');
    cy.get('#maxWeight2').type('80');
    
    cy.get('#submitButton').click();
    
    // Expected: Successful optimization
    cy.url().should('include', '#analysisResults');
  });



  it('TC-PO03: Multiple Validation Error Scenarios', () => {
    cy.log('🧪 TEST CASE: TC-PO03 - Multiple errors (TC-EF03)');
    
    // Invalid date range
    cy.get('#startYear').select('2025');
    cy.get('#endYear').select('2020');
    
    // Invalid weight constraints
    cy.get('#symbol1').type('VTI');
    cy.get('#minWeight1').type('80'); // Min > Max
    cy.get('#maxWeight1').type('20');
    
    // Invalid ticker
    cy.get('#symbol2').type('INVALID');
    
    cy.get('#submitButton').click();
    
    // Should show validation errors
    cy.get('body').should(($body) => {
      expect($body.text()).to.match(/(error|invalid|not found)/i);
    });
  });

  it('TC-PO04: Weight Boundary Value Violations', () => {
    cy.log('🧪 TEST CASE: TC-PO04 - Weight boundaries (TC-EF04)');
    
    cy.get('#symbol1').type('VTI');
    cy.get('#minWeight1').type('-5');  // Below lower bound
    cy.get('#maxWeight1').type('110'); // Above upper bound
    
    cy.get('#submitButton').click();
    
    cy.get('body').should(($body) => {
      expect($body.text()).to.match(/(error|invalid|weight)/i);
    });
  });

  it('TC-PO05: No Assets Provided Error', () => {
    cy.log('🧪 TEST CASE: TC-PO05 - Empty portfolio (TC-EF05)');
    
    // Leave all asset fields empty
    cy.get('#submitButton').click();
    
    cy.get('body').should(($body) => {
      expect($body.text()).to.match(/(error|asset|required)/i);
    });
  });

  it('TC-PO06: Single Year Boundary Analysis', () => {
    cy.log('🧪 TEST CASE: TC-PO06 - Single year (TC-EF06)');
    
    // Same start and end year
    cy.get('#startYear').select('1985');
    cy.get('#endYear').select('1985');
    
    cy.get('#symbol1').type('VTI');
    cy.get('#symbol2').type('BND');
    
    cy.get('#submitButton').click();
    
    cy.url().should('include', '#analysisResults');
  });

  it('TC-PO07: Dynamic Field Dependencies', () => {
    cy.log('🧪 TEST CASE: TC-PO07 - Field dependency testing');
    
    // Test month fields visibility
    cy.get('#timePeriod').select('2'); // Month-to-Month
    cy.get('#firstMonth').should('be.visible');
    cy.get('#lastMonth').should('be.visible');
    
    cy.get('#timePeriod').select('4'); // Year-to-Year  
    cy.get('#firstMonth').should('not.be.visible');
    cy.get('#lastMonth').should('not.be.visible');
    
    // Test goal-dependent fields
    cy.get('#goal').select('3'); // Minimize Volatility subject to...
    cy.get('#targetAnnualReturn').should('be.visible');
  });

  it('TC-PO08: Group Constraints Functionality', () => {
    cy.log('🧪 TEST CASE: TC-PO08 - Group constraints');
    
    cy.get('#groupConstraints').select('true');
    
    // Assign assets to groups
    cy.get('#symbol1').type('VTI');
    cy.get('#assetGroup1').select('A');
    cy.get('#symbol2').type('BND'); 
    cy.get('#assetGroup2').select('B');
    
    // Set group constraints
    cy.get('#minGroupWeight1').type('30');
    cy.get('#maxGroupWeight1').type('70');
    
    cy.get('#submitButton').click();
    
    cy.url().should('include', '#analysisResults');
  });

  it('TC-PO09: Benchmark Comparison', () => {
    cy.log('🧪 TEST CASE: TC-PO09 - Benchmark analysis');
    
    cy.get('#symbol1').type('VTI');
    cy.get('#symbol2').type('BND');
    
    // Set custom benchmark
    cy.get('#benchmark').select('-1'); // Specify Ticker
    cy.get('#benchmarkSymbol').type('SPY');
    
    cy.get('#submitButton').click();
    
    cy.url().should('include', '#analysisResults');
    cy.get('body').should('contain', 'Benchmark');
  });

  it('TC-PO10: Custom Expected Returns', () => {
    cy.log('🧪 TEST CASE: TC-PO10 - Custom return expectations');
    
    // Switch to custom expected returns
    cy.get('#historicalReturns').select('false');
    
    cy.get('#symbol1').type('VTI');
    cy.get('#mean1').type('8'); // 8% expected return
    
    cy.get('#symbol2').type('BND');
    cy.get('#mean2').type('4'); // 4% expected return  
    
    cy.get('#submitButton').click();
    
    cy.url().should('include', '#analysisResults');
  });

  it('TC-PO11: Different Optimization Strategies', () => {
    cy.log('🧪 TEST CASE: TC-PO11 - Multiple optimization goals');
    
    cy.get('#symbol1').type('VTI');
    cy.get('#symbol2').type('BND');
    cy.get('#symbol3').type('VXUS');
    
    // Test different optimization approaches
    const strategies = [
      { value: '5', name: 'Minimize CVaR' },
      { value: '9', name: 'Risk Parity' },
      { value: '13', name: 'Minimize Tracking Error' }
    ];
    
    strategies.forEach((strategy) => {
      cy.get('#goal').select(strategy.value);
      cy.get('#submitButton').click();
      
      cy.url().should('include', '#analysisResults');
      
      // Return for next test
      cy.visit('https://www.portfoliovisualizer.com/optimize-portfolio');
      cy.get('#symbol1').type('VTI');
      cy.get('#symbol2').type('BND');
      cy.get('#symbol3').type('VXUS');
    });
  });


});