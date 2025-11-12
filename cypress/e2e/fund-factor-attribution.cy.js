describe('Portfolio Visualizer - Factor Performance Attribution Test Suite', () => {
  beforeEach(() => {
    cy.visit('https://www.portfoliovisualizer.com/factor-performance-attribution');
  });

  it('TC-FFA01: Fama-French Three-Factor with All Significance', () => {
    cy.log('🧪 TEST CASE: TC-FFA01 - Fama-French 3-factor with all significance');
    
    // Equity Factor Returns: Fama-French (default)
    cy.get('#factorDataSet').should('have.value', '0');
    
    // Stock Market: US (default)
    cy.get('#marketArea').should('have.value', '0');
    
    // Equity Factor Model: Three-Factor (default)
    cy.get('#factorModel').should('have.value', '3');
    
    // Fixed Income Model: None (default)
    cy.get('#fixedIncomeFactorModel').should('have.value', '0');
    
    // Fund Type: All (default)
    cy.get('#fundType').should('have.value', '-1');
    
    // Fund Category: US Equity Funds (default)
    cy.get('#fundCategory').should('have.value', '1');
    
    // Time Period: 36 Months (default)
    cy.get('#timePeriod').should('have.value', '36');
    
    // R²: >=80% (default)
    cy.get('#threshold').should('have.value', '80');
    
    // Statistical Significance: Check all available factors
    cy.get('#mkt').check();
    cy.get('#smb').check();
    cy.get('#hml').check();
    cy.get('#alpha').check();
    
    cy.get('#submitButton').click();
    
    // Expected: Table shows funds with 3-factor attribution
    cy.get('body').should('contain', 'Fund Performance Attribution');
    cy.get('#DataTables_Table_0').should('be.visible');
  });

  it('TC-FFA02: Bond Factors with ETFs and High R²', () => {
    cy.log('🧪 TEST CASE: TC-FFA02 - Bond factors with ETFs and high R²');
    
    // Equity Factor Model: None
    cy.get('#factorModel').select('0');
    
    // Fixed Income Model: Term + Credit
    cy.get('#fixedIncomeFactorModel').select('2');
    
    // Fund Type: ETF
    cy.get('#fundType').select('2');
    
    // Fund Category: Fixed Income
    cy.get('#fundCategory').select('4');
    
    // Time Period: Minimum (24 Months)
    cy.get('#timePeriod').select('24');
    
    // R²: Maximum (>=95%)
    cy.get('#threshold').select('95');
    
    // Statistical Significance: TRM, CDT, Alpha
    cy.get('#trm').check();
    cy.get('#cdt').check();
    cy.get('#alpha').check();
    
    cy.get('#submitButton').click();
    
    // Expected: Table shows bond ETFs with term/credit factors
    cy.get('body').should('contain', 'Fund Performance Attribution');
    cy.get('#DataTables_Table_0').should('be.visible');
  });

  it('TC-FFA03: AQR Five-Factor with Minimal Filters', () => {
    cy.log('🧪 TEST CASE: TC-FFA03 - AQR 5-factor with minimal filters');
    
    // Equity Factor Returns: AQR Factors
    cy.get('#factorDataSet').select('2');
    
    // Equity Factor Model: Five-Factor Model
    cy.get('#factorModel').select('5');
    
    // Fixed Income Model: None
    cy.get('#fixedIncomeFactorModel').should('have.value', '0');
    
    // Time Period: Maximum (60 Months)
    cy.get('#timePeriod').select('60');
    
    // R²: Minimum (>=70%)
    cy.get('#threshold').select('70');
    
    // Statistical Significance: No checkboxes (all unchecked)
    cy.get('#mkt').uncheck();
    cy.get('#smb').uncheck();
    cy.get('#hml').uncheck();
    cy.get('#mom').uncheck();
    cy.get('#qmj').uncheck();
    cy.get('#alpha').uncheck();
    
    cy.get('#submitButton').click();
    
    // Expected: Table shows funds with 5 AQR factors
    cy.get('body').should('contain', 'Fund Performance Attribution');
    cy.get('#DataTables_Table_0').should('be.visible');
  });

  it('TC-FFA04: Complex Checkbox Interactions', () => {
    cy.log('🧪 TEST CASE: TC-FFA04 - Complex checkbox interactions');
    
    // Equity Factor Model: Four-Factor Model
    cy.get('#factorModel').select('4');
    
    // Fixed Income Model: 2xTerm+2xCredit
    cy.get('#fixedIncomeFactorModel').select('4');
    
    // Fund Category: All
    cy.get('#fundCategory').select('-1');
    
    // Time Period: 48 Months
    cy.get('#timePeriod').select('48');
    
    // R²: >=85%
    cy.get('#threshold').select('85');
    
    // Statistical Significance: Mixed selection
    cy.get('#mkt').check();
    cy.get('#mom').check();
    cy.get('#trm').check();
    cy.get('#ltrm').check();
    cy.get('#cdt').check();
    cy.get('#hy').check();
    cy.get('#alpha').check();
    
    cy.get('#submitButton').click();
    
    // Expected: Tests complex checkbox interactions
    cy.get('body').should('contain', 'Fund Performance Attribution');
  });

  it('TC-FFA05: International Funds with Complex Model', () => {
    cy.log('🧪 TEST CASE: TC-FFA05 - International funds with complex model');
    
    // Equity Factor Returns: AQR Factors
    cy.get('#factorDataSet').select('2');
    
    // Stock Market: Intl Developed Ex US
    cy.get('#marketArea').select('1010');
    
    // Equity Factor Model: Six-Factor Model (enabled for AQR)
    cy.get('#factorModel').select('6');
    
    // Fund Type: Mutual Fund
    cy.get('#fundType').select('5');
    
    // Fund Category: Intl Equity Funds
    cy.get('#fundCategory').select('2');
    
    // Use default time period and R²
    
    // Check all available factors for six-factor model
    cy.get('#mkt').check();
    cy.get('#smb').check();
    cy.get('#hml').check();
    cy.get('#mom').check();
    cy.get('#qmj').check();
    cy.get('#bab').check();
    cy.get('#alpha').check();
    
    cy.get('#submitButton').click();
    
    // Expected: Table shows international mutual funds
    cy.get('body').should('contain', 'Fund Performance Attribution');
    cy.get('#DataTables_Table_0').should('be.visible');
  });

  it('TC-FFA06: Dynamic Checkbox Visibility', () => {
    cy.log('🧪 TEST CASE: TC-FFA06 - Dynamic checkbox visibility testing');
    
    // Test Fama-French five-factor model
    cy.get('#factorDataSet').select('0'); // Fama-French
    cy.get('#factorModel').select('5'); // Five-Factor
    
    // Should show RMW and CMA (Fama-French specific)
    cy.get('#rmw').should('be.visible');
    cy.get('#cma').should('be.visible');
    // Should not show QMJ and BAB (AQR specific)
    cy.get('#qmj').should('not.be.visible');
    cy.get('#bab').should('not.be.visible');
    
    // Switch to AQR factors
    cy.get('#factorDataSet').select('2'); // AQR
    cy.get('#factorModel').select('5'); // Five-Factor
    
    // Should show QMJ (AQR quality) but not RMW/CMA
    cy.get('#qmj').should('be.visible');
    cy.get('#rmw').should('not.be.visible');
    cy.get('#cma').should('not.be.visible');
    
    // Test six-factor model (AQR only)
    cy.get('#factorModel').select('6'); // Six-Factor
    cy.get('#bab').should('be.visible'); // Low beta factor
    
    // Test fixed income advanced factors
    cy.get('#fixedIncomeFactorModel').select('4'); // 2xTerm+2xCredit
    cy.get('#itrm').should('be.visible');
    cy.get('#ltrm').should('be.visible');
    cy.get('#hy').should('be.visible');
  });

  

  it('TC-FFA08: All R² Threshold Boundaries', () => {
    cy.log('🧪 TEST CASE: TC-FFA08 - All R² threshold boundaries');
    
    const rSquaredThresholds = ['70', '75', '80', '85', '90', '95'];
    
    rSquaredThresholds.forEach((threshold) => {
      cy.get('#threshold').select(threshold);
      cy.get('#submitButton').click();
      
      cy.get('body').should('contain', 'Fund Performance Attribution');
      
      // Return for next test
      cy.visit('https://www.portfoliovisualizer.com/factor-performance-attribution');
    });
  });

  it('TC-FFA09: Market Area Restrictions', () => {
    cy.log('🧪 TEST CASE: TC-FFA09 - Market area restrictions');
    
    // Test Alpha Architect with International restrictions
    cy.get('#factorDataSet').select('5'); // Alpha Architect
    cy.get('#marketArea option[value="1000"]').should('be.disabled'); // Intl Developed disabled
    
    // Fixed income should be hidden for non-US markets
    cy.get('#marketArea').select('1010'); // Intl Developed Ex US
    cy.get('#fixedIncomeFactorModel').should('not.be.visible');
    
    // Switch back to US market
    cy.get('#marketArea').select('0'); // US
    cy.get('#fixedIncomeFactorModel').should('be.visible');
  });

  it('TC-FFA10: Fund Type and Category Combinations', () => {
    cy.log('🧪 TEST CASE: TC-FFA10 - Fund type and category combinations');
    
    // Test ETF with US Equity
    cy.get('#fundType').select('2'); // ETF
    cy.get('#fundCategory').select('1'); // US Equity
    cy.get('#submitButton').click();
    cy.get('body').should('contain', 'Fund Performance Attribution');
    
    // Return and test Mutual Fund with International
    cy.visit('https://www.portfoliovisualizer.com/factor-performance-attribution');
    cy.get('#fundType').select('5'); // Mutual Fund
    cy.get('#fundCategory').select('2'); // Intl Equity
    cy.get('#submitButton').click();
    cy.get('body').should('contain', 'Fund Performance Attribution');
    
    // Return and test Closed-End with Alternatives
    cy.visit('https://www.portfoliovisualizer.com/factor-performance-attribution');
    cy.get('#fundType').select('4'); // Closed-End
    cy.get('#fundCategory').select('3'); // Alternatives
    cy.get('#submitButton').click();
    cy.get('body').should('contain', 'Fund Performance Attribution');
  });

  it('TC-FFA11: Data Table Functionality', () => {
    cy.log('🧪 TEST CASE: TC-FFA11 - Data table functionality');
    
    // Perform a basic search first
    cy.get('#submitButton').click();
    
    // Verify table loads
    cy.get('#DataTables_Table_0').should('be.visible');
    
    // Test table search
    cy.get('#DataTables_Table_0_filter input').type('Vanguard');
    cy.get('#DataTables_Table_0 tbody tr').should('have.length.at.least', 1);
    
    // Test pagination
    cy.get('#DataTables_Table_0_next').click();
    cy.get('#DataTables_Table_0 tbody tr').should('have.length.at.least', 1);
    
    // Test sorting
    cy.get('#DataTables_Table_0 th').contains('Ticker').click();
    cy.get('#DataTables_Table_0 tbody tr').first().should('contain', 'AAAGX');
  });

  it('TC-FFA12: No Equity Model with Fixed Income', () => {
    cy.log('🧪 TEST CASE: TC-FFA12 - No equity model with fixed income');
    
    // Equity Factor Model: None
    cy.get('#factorModel').select('0');
    
    // Fixed Income Model: Term + Credit
    cy.get('#fixedIncomeFactorModel').select('2');
    
    // Fund Category: Fixed Income
    cy.get('#fundCategory').select('4');
    
    // Check that equity factors are hidden
    cy.get('#equityFactorFilters').should('not.be.visible');
    
    // Fixed income factors should be visible
    cy.get('#fixedIncomeFactorFilters').should('be.visible');
    
    cy.get('#submitButton').click();
    
    // Expected: Table shows fixed income funds only
    cy.get('body').should('contain', 'Fund Performance Attribution');
  });
});


