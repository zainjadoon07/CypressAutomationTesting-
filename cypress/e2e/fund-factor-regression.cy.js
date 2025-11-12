describe('Portfolio Visualizer - Fund Factor Regressions Test Suite', () => {
  beforeEach(() => {
    cy.visit('https://www.portfoliovisualizer.com/etf-and-mutual-fund-factor-regressions');
  });

  it('TC-FFR01: Fama-French Three-Factor with All Significance', () => {
    cy.log('🧪 TEST CASE: TC-FFR01 - Fama-French 3-factor with all significance');
    
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
    
    // Expected: Table shows funds with 3-factor regressions
    cy.get('body').should('contain', 'Factor Regressions');
    cy.get('#DataTables_Table_0').should('be.visible');
    cy.get('#DataTables_Table_0 th').contains('MKT-RF').should('be.visible');
  });

  it('TC-FFR02: Bond Factors with ETFs and High R²', () => {
    cy.log('🧪 TEST CASE: TC-FFR02 - Bond factors with ETFs and high R²');
    
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
    cy.get('body').should('contain', 'Factor Regressions');
    cy.get('#DataTables_Table_0').should('be.visible');
  });

  it('TC-FFR03: AQR Five-Factor with Minimal Filters', () => {
    cy.log('🧪 TEST CASE: TC-FFR03 - AQR 5-factor with minimal filters');
    
    // Equity Factor Returns: AQR Factors
    cy.get('#factorDataSet').select('2');
    
    // Equity Factor Model: Five-Factor Model
    cy.get('#factorModel').select('5');
    
    // Fixed Income Model: None
    cy.get('#fixedIncomeFactorModel').should('have.value', '0');
    
    // Time Period: Maximum option
    cy.get('#timePeriod').select('-1');
    
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
    cy.get('body').should('contain', 'Factor Regressions');
    cy.get('#DataTables_Table_0').should('be.visible');
  });

  it('TC-FFR04: Complex Checkbox Interactions with Advanced Fixed Income', () => {
    cy.log('🧪 TEST CASE: TC-FFR04 - Complex checkbox interactions');
    
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
    
    // Statistical Significance: Mixed selection including advanced fixed income
    cy.get('#mkt').check();
    cy.get('#mom').check();
    cy.get('#trm').check();
    cy.get('#itrm').check(); // Advanced fixed income
    cy.get('#ltrm').check(); // Advanced fixed income
    cy.get('#cdt').check();
    cy.get('#hy').check(); // Advanced fixed income
    cy.get('#alpha').check();
    
    cy.get('#submitButton').click();
    
    // Expected: Tests complex checkbox interactions
    cy.get('body').should('contain', 'Factor Regressions');
  });

  it('TC-FFR05: International Funds with Six-Factor Model', () => {
    cy.log('🧪 TEST CASE: TC-FFR05 - International funds with six-factor model');
    
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
    cy.get('body').should('contain', 'Factor Regressions');
    cy.get('#DataTables_Table_0').should('be.visible');
  });

  it('TC-FFR06: Maximum Time Period Option', () => {
    cy.log('🧪 TEST CASE: TC-FFR06 - Maximum time period option');
    
    // Test the "Maximum" time period option (unique to this tool)
    cy.get('#timePeriod').select('-1');
    
    // Use default other settings
    cy.get('#submitButton').click();
    
    // Expected: Should work with maximum available data
    cy.get('body').should('contain', 'Factor Regressions');
    cy.get('#DataTables_Table_0').should('be.visible');
  });

  it('TC-FFR07: All Time Period Boundaries Including Maximum', () => {
    cy.log('🧪 TEST CASE: TC-FFR07 - All time period boundaries');
    
    const timePeriods = ['24', '36', '48', '60', '-1']; // Includes Maximum option
    
    timePeriods.forEach((period) => {
      cy.get('#timePeriod').select(period);
      cy.get('#submitButton').click();
      
      cy.get('body').should('contain', 'Factor Regressions');
      
      // Return for next test
      cy.visit('https://www.portfoliovisualizer.com/etf-and-mutual-fund-factor-regressions');
    });
  });

  it('TC-FFR08: Dynamic Factor Visibility with Alpha Architect', () => {
    cy.log('🧪 TEST CASE: TC-FFR08 - Dynamic factor visibility with Alpha Architect');
    
    // Test Alpha Architect factors
    cy.get('#factorDataSet').select('5'); // Alpha Architect
    
    // Verify International Developed is disabled for Alpha Architect
    cy.get('#marketArea option[value="1000"]').should('be.disabled');
    
    // Test available factor models
    cy.get('#factorModel').select('5'); // Five-Factor
    cy.get('#qmj').should('be.visible'); // Quality factor should be visible
    
  });

  it('TC-FFR09: Fund Type and Category Filter Combinations', () => {
    cy.log('🧪 TEST CASE: TC-FFR09 - Fund type and category combinations');
    
    // Test Closed-End Fund with Alternatives
    cy.get('#fundType').select('4'); // Closed-End Fund
    cy.get('#fundCategory').select('3'); // Alternatives
    cy.get('#submitButton').click();
    cy.get('body').should('contain', 'Factor Regressions');
    
    // Return and test ETF with Fixed Income
    cy.visit('https://www.portfoliovisualizer.com/etf-and-mutual-fund-factor-regressions');
    cy.get('#fundType').select('2'); // ETF
    cy.get('#fundCategory').select('4'); // Fixed Income
    cy.get('#submitButton').click();
    cy.get('body').should('contain', 'Factor Regressions');
  });

  it('TC-FFR10: No Statistical Significance Requirements', () => {
    cy.log('🧪 TEST CASE: TC-FFR10 - No statistical significance requirements');
    
    // Leave all significance checkboxes unchecked
    cy.get('#mkt').should('not.be.checked');
    cy.get('#smb').should('not.be.checked');
    cy.get('#hml').should('not.be.checked');
    cy.get('#alpha').should('not.be.checked');
    
    cy.get('#submitButton').click();
    
    // Expected: Should return results without significance filtering
    cy.get('body').should('contain', 'Factor Regressions');
    cy.get('#DataTables_Table_0').should('be.visible');
  });

  it('TC-FFR11: Data Table Search and Sorting', () => {
    cy.log('🧪 TEST CASE: TC-FFR11 - Data table functionality');
    
    // Perform a basic search first
    cy.get('#submitButton').click();
    
    // Verify table loads with regression data
    cy.get('#DataTables_Table_0').should('be.visible');
    
    // Test table search functionality
    cy.get('#DataTables_Table_0_filter input').type('Vanguard');
    cy.get('#DataTables_Table_0 tbody tr').should('have.length.at.least', 1);
    
    // Test sorting by different columns
    cy.get('#DataTables_Table_0 th').contains('Annual Alpha').click();
    cy.get('#DataTables_Table_0 th').contains('R2').click();
    
    // Test pagination
    cy.get('#DataTables_Table_0_next').click();
    cy.get('#DataTables_Table_0 tbody tr').should('have.length.at.least', 1);
  });

  it('TC-FFR12: Mixed Equity and Fixed Income Models', () => {
    cy.log('🧪 TEST CASE: TC-FFR12 - Mixed equity and fixed income models');
    
    // Equity Factor Model: Three-Factor
    cy.get('#factorModel').select('3');
    
    // Fixed Income Model: Term + Credit
    cy.get('#fixedIncomeFactorModel').select('2');
    
    // Fund Category: All (to get mixed fund types)
    cy.get('#fundCategory').select('-1');
    
    // Select significance for both equity and fixed income factors
    cy.get('#mkt').check();
    cy.get('#smb').check();
    cy.get('#trm').check();
    cy.get('#cdt').check();
    cy.get('#alpha').check();
    
    cy.get('#submitButton').click();
    
    // Expected: Should handle mixed factor models
    cy.get('body').should('contain', 'Factor Regressions');
    cy.get('#DataTables_Table_0').should('be.visible');
  });
});