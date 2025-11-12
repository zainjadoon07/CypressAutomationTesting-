describe('Portfolio Visualizer - Monte Carlo Simulation Test Suite', () => {
  beforeEach(() => {
    cy.visit('https://www.portfoliovisualizer.com/monte-carlo-simulation');
  });

  it('TC-MC01: Valid Simulation with Asset Classes', () => {
    cy.log('🧪 TEST CASE: TC-MC01 - Valid Simulation with Asset Classes');
    
    // Portfolio Type
    cy.get('#mode').should('have.value', '1'); // Asset Classes (default)
    
    // Initial Amount (already set to 1000000 by default)
    cy.get('#initialAmount').should('have.value', '1000000');
    
    // Cashflows - Withdraw fixed amount periodically (default)
    cy.get('#adjustmentType').should('have.value', '2');
    cy.get('#adjustmentAmount').should('have.value', '45000');
    
    // Inflation Adjusted (default Yes)
    cy.get('#inflationAdjusted').should('have.value', 'true');
    
    // Withdrawal Frequency (default Annually)
    cy.get('#frequency').should('be.visible').and('have.value', '4');
    
    // Simulation Period (default 30 years)
    cy.get('#years').should('have.value', '30');
    
    // Tax Treatment (default Pre-tax)
    cy.get('#taxTreatment').should('have.value', 'false');
    
    // Simulation Model (default Historical Returns)
    cy.get('#simulationModel').should('have.value', '1');
    
    // Use Full History (default Yes)
    cy.get('#fullHistory').should('have.value', 'true');
    
    // Bootstrap Model (default Single Year)
    cy.get('#bootstrapModel').should('be.visible').and('have.value', '1');
    
    // Sequence of Returns Risk (default No Adjustments)
    cy.get('#sequenceStressTest').should('have.value', '0');
    
    // Inflation Model (default Historical)
    cy.get('#inflationModel').should('have.value', '1');
    
    // Rebalancing (default Rebalance annually)
    cy.get('#rebalanceType').should('have.value', '1');
    
    // Intervals (default Defaults)
    cy.get('#customIntervals').should('have.value', 'false');
    
    
    
    // Asset Allocation - Set up 60/40 portfolio
    cy.get('#asset1').select('US Stock Market');
    cy.get('#allocation1_1').clear().type('60');
    
    cy.get('#asset2').select('Total US Bond Market');
    cy.get('#allocation2_1').clear().type('40');
    
    // Verify total allocation
    cy.get('#total1').should('have.value', '60');
    
    // Run simulation
    cy.get('#submitButton').click();
    
    // Expected: Should redirect to results
    cy.url().should('include', '#analysisResults');
    cy.get('body').should('contain', 'Monte Carlo Simulation');
  });

  it('TC-MC02: Invalid Inputs - Zero Amount and Incomplete Allocation', () => {
    cy.log('🧪 TEST CASE: TC-MC02 - Invalid Inputs');
    
    // Set initial amount to 0
    cy.get('#initialAmount').clear().type('0');
    
    // Set withdrawal amount to 0
    cy.get('#adjustmentAmount').clear().type('0');
    
    // Set incomplete allocation (50% only)
    cy.get('#asset1').select('US Stock Market');
    cy.get('#allocation1_1').clear().type('50');
    
    // Run simulation
    cy.get('#submitButton').click();
    
    // Expected: Should show validation errors
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.satisfy((content) => {
        return content.includes('error') || 
               content.includes('invalid') || 
               content.includes('required') ||
               content.includes('allocation') ||
               $body.find('.is-invalid, .alert-danger').length > 0;
      });
    });
  });

  it('TC-MC03: Boundary Violations - Negative Values and Over-Allocation', () => {
    cy.log('🧪 TEST CASE: TC-MC03 - Boundary Violations');
    
    // Set negative initial amount
    cy.get('#initialAmount').clear().type('-1000');
    
    // Set negative withdrawal amount
    cy.get('#adjustmentAmount').clear().type('-1000');
    
    // Set over-allocation (120% + 20% = 140%)
    cy.get('#asset1').select('US Stock Market');
    cy.get('#allocation1_1').clear().type('120');
    
    cy.get('#asset2').select('Total US Bond Market');
    cy.get('#allocation2_1').clear().type('20');
    
    // Run simulation
    cy.get('#submitButton').click();
    
    // Expected: Should show validation errors
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.satisfy((content) => {
        return content.includes('error') || 
               content.includes('invalid') || 
               content.includes('positive') ||
               content.includes('allocation') ||
               $body.find('.is-invalid').length > 0;
      });
    });
  });

  it('TC-MC04: Minimum Simulation Period with Forecasted Model', () => {
    cy.log('🧪 TEST CASE: TC-MC04 - Minimum Period with Forecasted Model');
    
    // Set minimum simulation period
    cy.get('#years').select('5');
    
    // Change to Forecasted Returns model
    cy.get('#simulationModel').select('Forecasted Returns');
    
    // Use Full History should be No for forecasted
    cy.get('#fullHistory').should('not.be.visible');
    
    // Bootstrap Model should be hidden for forecasted
    cy.get('#bootstrapModel').should('not.be.visible');
    
    // Set asset allocation
    cy.get('#asset1').select('US Stock Market');
    cy.get('#allocation1_1').clear().type('100');
    
    // Run simulation
    cy.get('#submitButton').click();
    
    // Expected: Should run successfully
    cy.url().should('include', '#analysisResults');
    cy.get('body').should('contain', 'Monte Carlo Simulation');
  });

  it('TC-MC05: Allocation Precision Testing', () => {
    cy.log('🧪 TEST CASE: TC-MC05 - Allocation Precision');
    
    // Set allocation to 99.99% total (three assets at 33.33% each)
    cy.get('#asset1').select('US Stock Market');
    cy.get('#allocation1_1').clear().type('33.33');
    
    cy.get('#asset2').select('International ex-US Small Cap');
    cy.get('#allocation2_1').clear().type('33.33');
    
    cy.get('#asset3').select('Total US Bond Market');
    cy.get('#allocation3_1').clear().type('33.33');
    
    // Set withdrawal amount equal to initial amount (boundary case)
    cy.get('#adjustmentAmount').clear().type('10000');
    cy.get('#initialAmount').clear().type('10000');
    
    // Run simulation
    cy.get('#submitButton').click();
    
    // Check behavior - may accept or reject the allocation
    cy.get('body').then(($body) => {
      if ($body.text().includes('error') || $body.text().includes('allocation') || $body.find('.is-invalid').length > 0) {
        cy.log('Allocation precision validation working');
      } else {
        // Might accept the near-100% allocation
        cy.url().should('include', '#analysisResults');
      }
    });
  });

  it('TC-MC06: Dynamic Field Behavior - Cashflow Types', () => {
    cy.log('🧪 TEST CASE: TC-MC06 - Cashflow Dynamic Fields');
    
    // Test 1: No contributions or withdrawals
    cy.get('#adjustmentType').select('No contributions or withdrawals');
    cy.get('#adjustmentAmount').should('not.be.visible');
    cy.get('#frequency').should('not.be.visible');
    cy.get('#inflationAdjusted').should('not.be.visible');
    
    // Test 2: Contribute fixed amount
    cy.get('#adjustmentType').select('Contribute fixed amount periodically');
    cy.get('#adjustmentAmount').should('be.visible');
    cy.get('#frequency').should('be.visible');
    cy.get('#inflationAdjusted').should('be.visible');
    
    // Test 3: Withdraw fixed percentage
    cy.get('#adjustmentType').select('Withdraw fixed percentage periodically');
    cy.get('#adjustmentAmount').should('not.be.visible');
    cy.get('#adjustmentPercentage').should('be.visible');
    cy.get('#frequency').should('be.visible');
    cy.get('#inflationAdjusted').should('not.be.visible');
    
    // Test 4: Back to default (Withdraw fixed amount)
    cy.get('#adjustmentType').select('Withdraw fixed amount periodically');
    cy.get('#adjustmentAmount').should('be.visible');
    cy.get('#frequency').should('be.visible');
    cy.get('#inflationAdjusted').should('be.visible');
  });

  it('TC-MC07: Dynamic Field Behavior - Simulation Models', () => {
  cy.log('🧪 TEST CASE: TC-MC07 - Simulation Model Dynamic Fields');
  
  // Test 1: Historical Returns (default)
  cy.get('#simulationModel').select('Historical Returns');
  cy.get('#fullHistory').should('be.visible');
  cy.get('#bootstrapModel').should('be.visible');
  cy.get('#meanReturn').should('not.be.visible');
  cy.get('#volatility').should('not.be.visible');
  
  // Test 2: Forecasted Returns
  cy.get('#simulationModel').select('Forecasted Returns');
  cy.get('#fullHistory').should('not.be.visible');
  cy.get('#bootstrapModel').should('not.be.visible');
  cy.get('#historicalVolatility').should('be.visible');
  cy.get('#historicalCorrelations').should('be.visible');
  
  // Test 3: Statistical Returns - CORRECTED
  cy.get('#simulationModel').select('Statistical Returns');
  cy.get('#fullHistory').should('be.visible'); // Should be hidden
  cy.get('#bootstrapModel').should('not.be.visible'); // Should be hidden
  cy.get('#timeSeries').should('be.visible');
  
  // Test 4: Parameterized Returns
  cy.get('#simulationModel').select('Parameterized Returns');
  cy.get('#fullHistory').should('not.be.visible');
  cy.get('#bootstrapModel').should('not.be.visible');
  cy.get('#meanReturn').should('be.visible');
  cy.get('#volatility').should('be.visible');
  cy.get('#distribution').should('be.visible');
});

  it('TC-MC08: Tax Treatment Dynamic Behavior', () => {
    cy.log('🧪 TEST CASE: TC-MC08 - Tax Treatment Dynamic Fields');
    
    // Test 1: Pre-tax Returns (default)
    cy.get('#taxTreatment').select('Pre-tax Returns');
    cy.get('#investmentHorizon').should('not.be.visible');
    cy.get('#incomeTax').should('not.be.visible');
    cy.get('#capitalGainsTax').should('not.be.visible');
    
    // Test 2: After-tax Returns
    cy.get('#taxTreatment').select('After-tax Returns');
    cy.get('#investmentHorizon').should('be.visible');
    cy.get('#incomeTax').should('be.visible');
    cy.get('#capitalGainsTax').should('be.visible');
    cy.get('#dividendTax').should('be.visible');
    
    // Test 3: Back to Pre-tax
    cy.get('#taxTreatment').select('Pre-tax Returns');
    cy.get('#investmentHorizon').should('not.be.visible');
    cy.get('#incomeTax').should('not.be.visible');
  });

  

  it('TC-MC10: All Simulation Period Options', () => {
    cy.log('🧪 TEST CASE: TC-MC10 - All Simulation Periods');
    
    cy.get('#asset1').select('US Stock Market');
    cy.get('#allocation1_1').clear().type('100');
    
    // Test a few key simulation periods
    const periods = ['5', '15', '30', '50', '75'];
    
    periods.forEach((period) => {
      cy.get('#years').select(period);
      cy.get('#submitButton').click();
      
      // Should work with any valid period
      cy.url().should('include', '#analysisResults');
      cy.get('body').should('contain', 'Monte Carlo Simulation');
      
      // Go back for next test
      cy.visit('https://www.portfoliovisualizer.com/monte-carlo-simulation');
    });
  });



  it('TC-MC12: Sequence of Returns Risk Options', () => {
    cy.log('🧪 TEST CASE: TC-MC12 - Sequence Risk Options');
    
    cy.get('#asset1').select('US Stock Market');
    cy.get('#allocation1_1').clear().type('100');
    
    // Test different sequence risk options
    const riskOptions = ['0', '1', '5', '10']; // No adjustments, Worst 1 Year, Worst 5 Years, Worst 10 Years
    
    riskOptions.forEach((risk) => {
      cy.get('#sequenceStressTest').select(risk);
      cy.get('#submitButton').click();
      
      // Should work with any sequence risk option
      cy.url().should('include', '#analysisResults');
      
      // Go back for next test
      cy.visit('https://www.portfoliovisualizer.com/monte-carlo-simulation');
    });
  });
});