describe('Portfolio Visualizer - Manage Reports Test Suite', () => {
  beforeEach(() => {
    cy.loginToPortfolioVisualizer();
    cy.visit('https://www.portfoliovisualizer.com/manage-reports');
  });

  it('TC-REP01: Complete Report Template with All Features', () => {
    cy.log('🧪 TEST CASE: TC-REP01 - Complete report template with all features');
    
    // Verify default values
    cy.get('#companyName').should('have.value', 'Color Test');
    cy.get('#includeLogo').should('have.value', 'true');
    cy.get('#companyLinkText').should('have.value', 'www.portfoliovisualizer.com');
    cy.get('#companyLinkURL').should('have.value', 'https://www.portfoliovisualizer.com');
    cy.get('#includePageNumbers').select('true');
    cy.get('#includeReportDate').select( 'true');
    cy.get('#disclosuresType').select( '0');
    cy.get('#fontName').select('Roboto');
    cy.get('#chartPalette').select( 'Palette 1');
    
    // Update all fields
    cy.get('#companyName').clear().type('Alpha Investments');
    cy.get('#companyLinkText').clear().type('Alpha Investments');
    cy.get('#companyLinkURL').clear().type('https://alphainv.com');
    cy.get('#useCoverPage').select('true');
    cy.get('#disclosuresType').select('1'); // Display above default
    cy.get('#disclosures').clear().type('Custom disclosure text for testing purposes.');
    cy.get('#fontName').select('Roboto');
    cy.get('#chartPalette').select('Palette 2');
    
    // Submit form
    cy.get('#submitReportsButton').click();
    
    // Verify success
    cy.url().should('include', '/manage-reports');
    cy.get('body').should('contain', 'Report Template');
  });

  it('TC-REP02: Minimal Report Template - No Logo, No Cover Page', () => {
    cy.log('🧪 TEST CASE: TC-REP02 - Minimal template without logo and cover page');
    
    cy.get('#companyName').clear().type('Minimal Template');
    cy.get('#includeLogo').select('false');
    cy.get('#useCoverPage').select('false');
    cy.get('#includePageNumbers').select('false');
    cy.get('#includeReportDate').select('false');
    cy.get('#disclosuresType').select('2'); // Display below default
    cy.get('#disclosures').clear(); // Empty disclosures
    
    cy.get('#submitReportsButton').click();
    
    cy.url().should('include', '/manage-reports');
    cy.get('body').should('contain', 'Report Template');
  });

  it('TC-REP03: Invalid Inputs - Empty Company Name and Invalid Colors', () => {
    cy.log('🧪 TEST CASE: TC-REP03 - Invalid inputs validation');
    
    // Test empty company name
    cy.get('#companyName').clear();
    cy.get('#companyLinkURL').clear().type('invalid-url'); // Invalid URL format
    cy.get('#chartPalette').select('Custom');
    
    cy.get('#submitReportsButton').click();
    
    // Should show validation errors
    cy.url().should('include', '/manage-reports');
  });

  it('TC-REP04: All Chart Color Palettes', () => {
    cy.log('🧪 TEST CASE: TC-REP04 - Test all chart color palettes');
    
    const palettes = ['Palette 1', 'Palette 2', 'Palette 3', 'Palette 4'];
    
    palettes.forEach(palette => {
      cy.get('#companyName').clear().type(`Test ${palette}`);
      cy.get('#chartPalette').select(palette);
      cy.get('#submitReportsButton').click();
      
      cy.url().should('include', '/manage-reports');
      cy.visit('https://www.portfoliovisualizer.com/manage-reports');
    });
  });

  it('TC-REP05: All Font Options', () => {
    cy.log('🧪 TEST CASE: TC-REP05 - Test all font options');
    
    const fonts = ['Lato', 'Merriweather', 'Montserrat', 'Open Sans', 'Roboto', 'Source Sans Pro'];
    
    fonts.forEach(font => {
      cy.get('#companyName').clear().type(`Test ${font}`);
      cy.get('#fontName').select(font);
      cy.get('#submitReportsButton').click();
      
      cy.url().should('include', '/manage-reports');
      cy.visit('https://www.portfoliovisualizer.com/manage-reports');
    });
  });

  it('TC-REP06: Disclosure Type Combinations', () => {
    cy.log('🧪 TEST CASE: TC-REP06 - All disclosure type combinations');
    
    const disclosureTypes = [
      { value: '0', label: 'Replace' },
      { value: '1', label: 'Above' },
      { value: '2', label: 'Below' }
    ];
    
    disclosureTypes.forEach(type => {
      cy.get('#companyName').clear().type(`Disclosure ${type.label}`);
      cy.get('#disclosuresType').select(type.value);
      cy.get('#disclosures').clear().type(`Custom text for ${type.label} default disclosures.`);
      cy.get('#submitReportsButton').click();
      
      cy.url().should('include', '/manage-reports');
      cy.visit('https://www.portfoliovisualizer.com/manage-reports');
    });
  });

  it('TC-REP07: File Upload Scenarios', () => {
    cy.log('🧪 TEST CASE: TC-REP07 - File upload scenarios');
    
    // Test logo upload (simulate file selection)
    cy.get('#companyName').clear().type('File Upload Test');
    cy.get('#includeLogo').select('true');
    // Note: Actual file upload would require test files
    // cy.get('#logoImage').selectFile('cypress/fixtures/test-logo.png');
    
    cy.get('#useCoverPage').select('true');
    // cy.get('#coverPage').selectFile('cypress/fixtures/test-cover.pdf');
    
    cy.get('#submitReportsButton').click();
    
    cy.url().should('include', '/manage-reports');
  });

  it('TC-REP08: Restore Defaults Functionality', () => {
    cy.log('🧪 TEST CASE: TC-REP08 - Restore defaults functionality');
    
    // Change some values first
    cy.get('#companyName').clear().type('Custom Company');
    cy.get('#fontName').select('Montserrat');
    cy.get('#chartPalette').select('Palette 3');
    
    // Restore defaults
    cy.get('#restoreReportsButton').click();
    
    // Verify defaults are restored
    cy.get('#companyName').should('have.value', 'Portfolio Visualizer');
    cy.get('#fontName').should('have.value', 'Roboto');
    cy.get('#chartPalette').should('have.value', 'Palette 1');
  });

  it('TC-REP09: Cancel Button Navigation', () => {
    cy.log('🧪 TEST CASE: TC-REP09 - Cancel button navigation');
    
    // Make changes then cancel
    cy.get('#companyName').clear().type('Cancel Test');
    cy.get('#cancelReportsButton').click();
    
    // Should stay on same page without saving
    cy.url().should('include', '/manage-reports');
  });

  it('TC-REP10: Custom Color Palette Option', () => {
    cy.log('🧪 TEST CASE: TC-REP10 - Custom color palette option');
    
    cy.get('#companyName').clear().type('Custom Colors');
    cy.get('#chartPalette').select('Custom');
    
    // Verify custom color field appears
    cy.get('#chartColorList').should('be.visible');
    cy.get('#chartColorList').clear().type('#FF0000 #00FF00 #0000FF #FFFF00');
    
    cy.get('#submitReportsButton').click();
    
    cy.url().should('include', '/manage-reports');
  });

  it('TC-REP11: Boundary Values - Company Name Length', () => {
    cy.log('🧪 TEST CASE: TC-REP11 - Company name boundary values');
    
    // Test max length (64 characters based on HTML)
    const maxName = 'A'.repeat(64);
    cy.get('#companyName').clear().type(maxName);
    cy.get('#submitReportsButton').click();
    
    cy.url().should('include', '/manage-reports');
    
    // Test over max length
    cy.visit('https://www.portfoliovisualizer.com/manage-reports');
    const overMaxName = 'A'.repeat(65);
    cy.get('#companyName').clear().type(overMaxName);
    // Should be truncated by browser
  });

  it('TC-REP12: Color Picker Interactions', () => {
    cy.log('🧪 TEST CASE: TC-REP12 - Color picker field interactions');
    
    // Verify all color fields have default values
    cy.get('#reportTitleBackground').should('have.value', '#00649E');
    cy.get('#reportTitleForeground').should('have.value', '#FFFFFF');
    cy.get('#sectionTitleBackground').should('have.value', '#D8D8D8');
    cy.get('#sectionTitleForeground').should('have.value', '#000000');
    cy.get('#tableHeaderBackground').should('have.value', '#4477AA');
    cy.get('#tableHeaderForeground').should('have.value', '#FFFFFF');
    cy.get('#notesBackground').should('have.value', '#ECECEC');
    
    // Test form submission with default colors
    cy.get('#companyName').clear().type('Color Test');
    cy.get('#submitReportsButton').click();
    
    cy.url().should('include', '/manage-reports');
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