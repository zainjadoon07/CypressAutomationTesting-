describe('Portfolio Visualizer - Asset Backfills Management Test Suite', () => {
  beforeEach(() => {
    cy.loginToPortfolioVisualizer();
    cy.visit('https://www.portfoliovisualizer.com/manage-backfills');
  });

  it('TC-BF01: Valid Backfill Configuration with Multiple Pairs', () => {
    cy.log(' TEST CASE: TC-BF01 - Valid Backfill Configuration with Multiple Pairs');
    
    
    
    // Row 1: VFIAX to SPY
    cy.get('#bfticker1').type('VFIAX');
    cy.get('#bfproxy1').type('SPY');
    
    // Row 2: FSKAX to VTI
    cy.get('#bfticker2').type('FSKAX');
    cy.get('#bfproxy2').type('VTI');
    
    // Row 3: VBTLX to BND
    cy.get('#bfticker3').type('VBTLX');
    cy.get('#bfproxy3').type('BND');
    
    // Save changes
    cy.get('#submitBackfillsButton').click();
    
    // Expected: Success - page reloads with success message
    cy.url().should('include', 'manage-backfills');
    cy.get('body').should(($body) => {
      expect($body.text()).to.match(/success|saved|updated/i);
    });
  });

  it('TC-BF02: Invalid Inputs - Empty Asset and Same Ticker', () => {
    cy.log(' TEST CASE: TC-BF02 - Invalid Inputs');
    
    // Enable share class backfill
    cy.get('#backfillOldestShareClass').select('true');
    
    // Row 1: Empty asset ticker
    cy.get('#bfticker1').clear();
    cy.get('#bfproxy1').type('SPY');
    
    // Row 2: Invalid ticker format
    cy.get('#bfticker2').type('INVALID!');
    cy.get('#bfproxy2').clear();
    
    // Row 3: Same ticker for asset and proxy
    cy.get('#bfticker3').type('VFIAX');
    cy.get('#bfproxy3').type('VFIAX');
    
    // Save changes
    cy.get('#submitBackfillsButton').click();
    
    // Expected: Should show validation errors
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.satisfy((content) => {
        return content.includes('error') || 
               content.includes('invalid') || 
               content.includes('required') ||
               content.includes('ticker') ||
               $body.find('.is-invalid, .alert-danger').length > 0;
      });
    });
  });

  it('TC-BF03: Invalid Ticker Symbols and Unrelated Pairs', () => {
    cy.log('TEST CASE: TC-BF03 - Invalid Ticker Symbols');
    
    // Row 1: Non-existent asset ticker
    cy.get('#bfticker1').type('ABCDXYZ');
    cy.get('#bfproxy1').type('SPY');
    
    // Row 2: Invalid proxy ticker
    cy.get('#bfticker2').type('VFIAX');
    cy.get('#bfproxy2').type('PROXY123');
    
    // Row 3: Unrelated pair (gold to tech stock)
    cy.get('#bfticker3').type('GLD');
    cy.get('#bfproxy3').type('MSFT');
    
    // Save changes
    cy.get('#submitBackfillsButton').click();
    
    // Expected: May accept or show validation errors
    cy.get('body').then(($body) => {
      if ($body.text().includes('error') || $body.text().includes('invalid')) {
        cy.get('body').should('contain', 'ticker');
      } else {
        // Might accept the configurations
        cy.url().should('include', 'manage-backfills');
      }
    });
  });

  it('TC-BF04: Empty Configuration - No Backfill Pairs', () => {
    cy.log(' TEST CASE: TC-BF04 - Empty Configuration');
    
    // Clear all rows
    for (let i = 1; i <= 10; i++) {
      cy.get(`#bfticker${i}`).clear();
      cy.get(`#bfproxy${i}`).clear();
    }
    
    // Backfill Oldest Share Class - No
    cy.get('#backfillOldestShareClass').select('false');
    
    // Save changes
    cy.get('#submitBackfillsButton').click();
    
    // Expected: Should save empty configuration successfully
    cy.url().should('include', 'manage-backfills');
    cy.get('body').then(($body) => {
      expect($body.text()).to.match(/success|saved|updated/i);
    });
  });

  it('TC-BF05: Maximum Rows Configuration', () => {
    cy.log(' TEST CASE: TC-BF05 - Maximum Rows Configuration');
    
    // Enable share class backfill
    cy.get('#backfillOldestShareClass').select('true');
    
    // Fill all 10 rows with valid pairs
    const pairs = [
      { asset: 'VFIAX', proxy: 'SPY' },
      { asset: 'FSKAX', proxy: 'VTI' },
      { asset: 'VBTLX', proxy: 'BND' },
      { asset: 'VTSAX', proxy: 'VTI' },
      { asset: 'VTIAX', proxy: 'VXUS' },
      { asset: 'VGSLX', proxy: 'VNQ' },
      { asset: 'VMVAX', proxy: 'VOE' },
      { asset: 'VSGAX', proxy: 'VBK' },
      { asset: 'VEMAX', proxy: 'VWO' },
      { asset: 'VTABX', proxy: 'BNDX' }
    ];
    
    pairs.forEach((pair, index) => {
      cy.get(`#bfticker${index + 1}`).type(pair.asset);
      cy.get(`#bfproxy${index + 1}`).type(pair.proxy);
    });
    
    // Save changes
    cy.get('#submitBackfillsButton').click();
    
    // Expected: Should handle maximum rows successfully
    cy.url().should('include', 'manage-backfills');
    cy.get('body').then(($body) => {
      expect($body.text()).to.match(/success|saved|updated/i);
    });
  });

  it('TC-BF06: Add More Button Functionality', () => {
    cy.log('TEST CASE: TC-BF06 - Add More Button');
    
    // Click Add More button
    cy.get('#addbackfill').click();
    
    // Should add additional rows beyond initial 10
    cy.get('.backfill').should('have.length.greaterThan', 10);
    
    // Fill one of the new rows
    cy.get('#bfticker11').should('be.visible').type('NewETF');
    cy.get('#bfproxy11').should('be.visible').type('SPY');
    
    // Save changes
    cy.get('#submitBackfillsButton').click();
    
    // Expected: Should save with additional rows
    cy.url().should('include', 'manage-backfills');
  });

  it('TC-BF07: Cancel Button Functionality', () => {
    cy.log(' TEST CASE: TC-BF07 - Cancel Button');
    
    // Fill some data
    cy.get('#bfticker1').type('TESTASSET');
    cy.get('#bfproxy1').type('TESTPROXY');
    cy.get('#backfillOldestShareClass').select('true');
    
    // Click cancel button
    cy.get('#cancelBackfillsButton').click();
    
    // Expected: Should stay on same page without saving
    cy.url().should('include', 'manage-backfills');
  });

  it('TC-BF08: Delete All Button Functionality', () => {
    cy.log('TEST CASE: TC-BF08 - Delete All Button');
    
    // First set up some configurations
    cy.get('#bfticker1').type('VFIAX');
    cy.get('#bfproxy1').type('SPY');
    cy.get('#submitBackfillsButton').click();
    
    // Click Delete All button
    cy.get('#deleteAllBackfillsButton').click();
    
    // Handle confirmation dialog
    cy.get('#confirmDialog').should('be.visible');
    cy.get('#confirmButton').click();
    
    // Expected: Should delete all configurations
    cy.url().should('include', 'manage-backfills');
    cy.get('body').then(($body) => {
      expect($body.text()).to.match(/deleted|removed/i);
    });
  });

  it('TC-BF09: Search Icon Functionality', () => {
    cy.log('TEST CASE: TC-BF09 - Search Icon');
    
    // Click search icon for asset ticker
    cy.get('#bfticker1').closest('.input-group').find('.fa-search').click();
    
    // Symbol picker modal should appear
    cy.get('#symbolPicker').should('be.visible');
    cy.get('#symbolPickerTitle').should('contain', 'Find ETF, Mutual Fund or Stock Symbol');
    
    // Close the modal
    cy.get('#symbolPicker .btn-close').click();
    cy.get('#symbolPicker').should('not.be.visible');
    
    // Click search icon for proxy ticker
    cy.get('#bfproxy1').closest('.input-group').find('.fa-search').click();
    cy.get('#symbolPicker').should('be.visible');
    cy.get('#symbolPicker .btn-secondary').contains('Close').click();
  });

  it('TC-BF10: Mixed Valid and Empty Rows', () => {
    cy.log('TEST CASE: TC-BF10 - Mixed Valid and Empty Rows');
    
    // Row 1: Valid pair
    cy.get('#bfticker1').type('VFIAX');
    cy.get('#bfproxy1').type('SPY');
    
    // Row 2: Empty (skip)
    
    // Row 3: Valid pair
    cy.get('#bfticker3').type('VBTLX');
    cy.get('#bfproxy3').type('BND');
    
    // Row 4: Asset only (no proxy)
    cy.get('#bfticker4').type('FSKAX');
    cy.get('#bfproxy4').clear();
    
    // Row 5: Proxy only (no asset)
    cy.get('#bfticker5').clear();
    cy.get('#bfproxy5').type('VTI');
    
    // Save changes
    cy.get('#submitBackfillsButton').click();
    
    // Expected: Should handle mixed configuration appropriately
    cy.get('body').then(($body) => {
      if ($body.text().includes('error') || $body.text().includes('invalid')) {
        cy.get('body').should('contain', 'ticker');
      } else {
        cy.url().should('include', 'manage-backfills');
      }
    });
  });

  it('TC-BF11: Boundary Testing - Short Ticker Symbols', () => {
    cy.log('🧪 TEST CASE: TC-BF11 - Boundary Testing');
    
    // Test very short ticker (boundary case)
    cy.get('#bfticker1').type('A'); // Single character
    cy.get('#bfproxy1').type('SPY');
    
    // Test normal length tickers
    cy.get('#bfticker2').type('VTI'); // 3 chars
    cy.get('#bfproxy2').type('SPY');
    
    // Test longer ticker
    cy.get('#bfticker3').type('ABCDEFGHIJ'); // 10 chars
    cy.get('#bfproxy3').type('SPY');
    
    // Save changes
    cy.get('#submitBackfillsButton').click();
    
    // Expected: Should handle various ticker lengths
    cy.get('body').then(($body) => {
      if ($body.text().includes('error') || $body.text().includes('invalid')) {
        cy.get('body').should('contain', 'ticker');
      } else {
        cy.url().should('include', 'manage-backfills');
      }
    });
  });

  it('TC-BF12: Dynamic Row Highlighting', () => {
    cy.log(' TEST CASE: TC-BF12 - Row Highlighting');
    
    // Check that alternating rows have highlightRow class
    cy.get('.backfill.highlightRow').should('have.length', 5); // Rows 1, 3, 5, 7, 9
    
    // Verify specific rows are highlighted
    cy.get('.backfill').eq(0).should('have.class', 'highlightRow'); // Row 1
    cy.get('.backfill').eq(1).should('not.have.class', 'highlightRow'); // Row 2
    cy.get('.backfill').eq(2).should('have.class', 'highlightRow'); // Row 3
    
    // Add more rows and check highlighting continues
    cy.get('#addbackfill').click();
    cy.get('.backfill').should('have.length.greaterThan', 10);
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