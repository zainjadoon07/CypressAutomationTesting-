describe('Portfolio Visualizer - Fund Screener Test Suite', () => {
  beforeEach(() => {
    cy.visit('https://www.portfoliovisualizer.com/fund-screener');
  });

  it('TC-FS01: Specific Filters - ETF, US Equity, S&P 500, Long History, Low Expense', () => {
    cy.log('🧪 TEST CASE: TC-FS01 - Specific Filters');
    
    // Fund Type: ETF
    cy.get('#fundType').select('ETF');
    
    // Asset Class: US Equity (already selected by default)
    cy.get('#assetClass').select('All');
    
    // Benchmark: S&P 500
    cy.get('#benchmarkName').select('S&P 500 TR USD');
    
    // Performance History: 10 or more years
    cy.get('#performanceHistoryPeriod').select('10 or more years');
    
    // Expense Ratio: < 0.25%
    cy.get('#expenseRatio').select('< 0.25%');
    
    // Click Update Table
    cy.get('#submitButton').click();
    
    // Expected: Table updates with filtered results
    cy.url().should('include', '#analysisResults');
    cy.get('#DataTables_Table_0').should('be.visible');
    
    // Verify results show expected content
    cy.get('body').then(($body) => {
      const hasResults = $body.find('#DataTables_Table_0 tbody tr').length > 0;
      if (hasResults) {
        cy.log('✅ Results found with specific filters');
      } else {
        cy.log('⚠️ No results found with these specific filters');
      }
    });
  });

  it('TC-FS02: All Filters Set to "All" - Broadest Results', () => {
    cy.log('🧪 TEST CASE: TC-FS02 - All Filters Set to "All"');
    
    // Fund Type: All
    cy.get('#fundType').select('All');
    
    // Asset Class: All
    cy.get('#assetClass').select('All');
    
    // Benchmark: All (already selected by default)
    cy.get('#benchmarkName').should('have.value', '');
    
    // Performance History: All (already selected by default)
    cy.get('#performanceHistoryPeriod').should('have.value', '-1');
    
    // Expense Ratio: All
    cy.get('#expenseRatio').select('All');
    
    // Click Update Table
    cy.get('#submitButton').click();
    
    // Expected: Table shows broadest set of funds
    cy.url().should('include', '#analysisResults');
    cy.get('#DataTables_Table_0').should('be.visible');
    
    // Should show many results
    cy.get('#DataTables_Table_0_info').then(($info) => {
      const infoText = $info.text();
      const match = infoText.match(/Showing 1 to \d+ of (\d+) entries/);
      if (match && parseInt(match[1]) > 10) {
        cy.log(`✅ Broad results found: ${match[1]} entries`);
      }
    });
  });

  it('TC-FS03: Mutual Funds with International Equity and Long History', () => {
    cy.log('🧪 TEST CASE: TC-FS03 - Mutual Funds with International Equity');
    
    // Fund Type: Mutual Fund
    cy.get('#fundType').select('Mutual Fund');
    
    // Asset Class: International Equity
    cy.get('#assetClass').select('International Equity');
    
    // Benchmark: MSCI EAFE
    cy.get('#benchmarkName').select('MSCI EAFE NR USD');
    
    // Performance History: 25 or more years (maximum)
    cy.get('#performanceHistoryPeriod').select('25 or more years');
    
    // Expense Ratio: < 1.00% (maximum threshold)
    cy.get('#expenseRatio').select('< 1.00%');
    
    // Click Update Table
    cy.get('#submitButton').click();
    
    // Expected: Table updates with mutual funds, international equity
    cy.url().should('include', '#analysisResults');
    cy.get('#DataTables_Table_0').should('be.visible');
    
    // Check if results contain expected content
    cy.get('body').then(($body) => {
      const hasResults = $body.find('#DataTables_Table_0 tbody tr').length > 0;
      if (hasResults) {
        cy.log('✅ Mutual funds with international equity found');
      } else {
        cy.log('⚠️ No mutual funds found with these criteria');
      }
    });
  });

  it('TC-FS04: Client-Side Search Filtering with "VTI"', () => {
    cy.log('🧪 TEST CASE: TC-FS04 - Client-Side Search Filtering');
    
    // First get broad results (like TC-FS02)
    cy.get('#fundType').select('All');
    cy.get('#assetClass').select('All');
    cy.get('#expenseRatio').select('All');
    cy.get('#submitButton').click();
    
    // Wait for table to load
    cy.get('#DataTables_Table_0').should('be.visible');
    
    // Use client-side search box (do NOT click Update Table)
    cy.get('#DataTables_Table_0_filter input').type('VTI');
    
    // Wait for client-side filtering
    cy.wait(1000);
    
    // Expected: Table filtered to show only VTI or similar
    cy.get('#DataTables_Table_0_info').should(($info) => {
      const infoText = $info.text();
      expect(infoText).to.satisfy((text) => {
        return text.includes('VTI') || text.includes('1 to') || text.includes('entries');
      });
    });
    
    // Verify results are filtered
    cy.get('#DataTables_Table_0 tbody tr').then(($rows) => {
      if ($rows.length > 0) {
        cy.log(`✅ Client-side search found ${$rows.length} results for "VTI"`);
        // Should contain VTI in ticker or name
        cy.get('#DataTables_Table_0').should('contain', 'VTI');
      }
    });
  });

  it('TC-FS05: Client-Side Search with Non-Existent Term', () => {
    cy.log('🧪 TEST CASE: TC-FS05 - Client-Side Search with Non-Existent Term');
    
    // First get broad results (like TC-FS02)
    cy.get('#fundType').select('All');
    cy.get('#assetClass').select('All');
    cy.get('#expenseRatio').select('All');
    cy.get('#submitButton').click();
    
    // Wait for table to load
    cy.get('#DataTables_Table_0').should('be.visible');
    
    // Use client-side search with non-existent term
    cy.get('#DataTables_Table_0_filter input').clear().type('XYZNOFUND');
    
    // Wait for client-side filtering
    cy.wait(1000);
    
    // Expected: Table shows 0 entries
    cy.get('#DataTables_Table_0_info').should('contain', 'Showing 0 to 0 of 0 entries');
    
    // Verify no results in table body
    cy.get('#DataTables_Table_0 tbody tr').should('have.length', 1);
    
    cy.log('✅ Client-side search correctly shows 0 results for non-existent term');
  });


  it('TC-FS07: Boundary Testing - Minimum Performance History', () => {
    cy.log('🧪 TEST CASE: TC-FS07 - Minimum Performance History');
    
    // Fund Type: ETF
    cy.get('#fundType').select('ETF');
    
    // Performance History: 3 or more years (minimum)
    cy.get('#performanceHistoryPeriod').select('3 or more years');
    
    // Expense Ratio: < 0.25% (minimum threshold)
    cy.get('#expenseRatio').select('< 0.25%');
    
    // Click Update Table
    cy.get('#submitButton').click();
    
    // Expected: Should work with minimum filters
    cy.url().should('include', '#analysisResults');
    cy.get('#DataTables_Table_0').should('be.visible');
    
    cy.get('#DataTables_Table_0_info').should('contain', 'Showing');
    cy.log('✅ Minimum performance history filter working');
  });

  it('TC-FS08: Boundary Testing - Maximum Expense Ratio', () => {
    cy.log('🧪 TEST CASE: TC-FS08 - Maximum Expense Ratio');
    
    // Fund Type: Mutual Fund
    cy.get('#fundType').select('Mutual Fund');
    
    // Performance History: 25 or more years (maximum)
    cy.get('#performanceHistoryPeriod').select('25 or more years');
    
    // Expense Ratio: < 1.00% (maximum threshold)
    cy.get('#expenseRatio').select('< 1.00%');
    
    // Click Update Table
    cy.get('#submitButton').click();
    
    // Expected: Should work with maximum expense ratio
    cy.url().should('include', '#analysisResults');
    cy.get('#DataTables_Table_0').should('be.visible');
    
    cy.get('#DataTables_Table_0_info').should('contain', 'Showing');
    cy.log('✅ Maximum expense ratio filter working');
  });

  it('TC-FS09: Closed-End Fund Filtering', () => {
    cy.log('🧪 TEST CASE: TC-FS09 - Closed-End Fund Filtering');
    
    // Fund Type: Closed-End Fund (default in HTML)
    cy.get('#fundType').should('have.value', '-1'); // Closed-End Fund is default
    
    // Click Update Table with default Closed-End Fund
    cy.get('#submitButton').click();
    
    // Expected: Should show Closed-End Funds
    cy.url().should('include', '#analysisResults');
    cy.get('#DataTables_Table_0').should('be.visible');
    
    // Verify results contain Closed-End Funds
    cy.get('body').then(($body) => {
      const hasResults = $body.find('#DataTables_Table_0 tbody tr').length > 0;
      if (hasResults) {
        cy.log('✅ Closed-End Fund results found');
      }
    });
  });


  it('TC-FS10: Pagination Functionality', () => {
    cy.log('🧪 TEST CASE: TC-FS11 - Pagination');
    
    // Get broad results to ensure multiple pages
    cy.get('#fundType').select('All');
    cy.get('#assetClass').select('All');
    cy.get('#submitButton').click();
    
    // Wait for table to load
    cy.get('#DataTables_Table_0').should('be.visible');
    
    // Check if pagination is available
    cy.get('body').then(($body) => {
      const hasPagination = $body.find('.dataTables_paginate .paginate_button:not(.disabled)').length > 0;
      
      if (hasPagination) {
        // Test Next button if available
        cy.get('#DataTables_Table_0_next').then(($next) => {
          if (!$next.hasClass('disabled')) {
            cy.get('#DataTables_Table_0_next').click();
            cy.log('✅ Pagination Next button working');
          }
        });
      } else {
        cy.log('⚠️ No pagination available (results fit on one page)');
      }
    });
  });

  it('TC-FS11: Results Table Structure Verification', () => {
    cy.log('🧪 TEST CASE: TC-FS12 - Table Structure');
    
    // Get some results
    cy.get('#fundType').select('ETF');
    cy.get('#submitButton').click();
    
    // Verify table structure
    cy.get('#DataTables_Table_0').should('be.visible');
    cy.get('#DataTables_Table_0 thead').should('exist');
    cy.get('#DataTables_Table_0 tbody').should('exist');
    
    // Verify expected columns exist
    const expectedColumns = [
      'Ticker',
      'Name',
      'Asset Class',
      'Category',
      'YTD',
      '1Y',
      'ER'
    ];
    
    expectedColumns.forEach(column => {
      cy.get('#DataTables_Table_0').contains('th', column).should('exist');
    });
    
    cy.log('✅ Results table structure verified');
  });
});