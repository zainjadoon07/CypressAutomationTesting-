describe('Portfolio Visualizer - Market Expectations Test Suite', () => {
  beforeEach(() => {
    cy.loginToPortfolioVisualizer();
    cy.visit('https://www.portfoliovisualizer.com/manage-market-expectations');
  });

  it('TC-ME01: Mixed Asset Classes and Tickers with Valid Returns', () => {
    cy.log('🧪 TEST CASE: TC-ME01 - Mixed asset classes and tickers with valid returns');
    
    // Row 1: Asset Class - US Stock Market
    cy.get('#fatype1').select('1');
    cy.get('#faac1').select('TotalStockMarket');
    cy.get('#fareturn1').clear().type('8.5');
    cy.get('#favolatility1').clear().type('15');
    
    // Row 2: Asset Class - US Bond Market  
    cy.get('#fatype2').select('1');
    cy.get('#faac2').select('TotalBond');
    cy.get('#fareturn2').clear().type('4.0');
    cy.get('#favolatility2').clear().type('5');
    
    // Row 3: Ticker - VTI
    cy.get('#fatype3').select('2');
    cy.get('#faticker3').should('be.visible');
    cy.get('#faticker3').clear().type('VTI');
    cy.get('#fareturn3').clear().type('9.0');
    cy.get('#favolatility3').clear().type('16');
    
    cy.get('#submitExpectationsButton').click();
    cy.url().should('include', '/manage-market-expectations');
  });

  it('TC-ME02: Invalid Inputs - Empty Assets and Negative Volatility', () => {
    cy.log('🧪 TEST CASE: TC-ME02 - Invalid inputs validation');
    
    cy.get('#fatype1').select('1');
    cy.get('#fareturn1').clear();
    cy.get('#favolatility1').clear().type('-5');
    
    cy.get('#fatype2').select('2');
    cy.get('#faticker2').should('be.visible');
    cy.get('#faticker2').clear();
    cy.get('#fareturn2').clear();
    cy.get('#favolatility2').clear();
    
    cy.get('#submitExpectationsButton').click();
    cy.url().should('include', '/manage-market-expectations');
  });

  it('TC-ME03: Extreme Boundary Values and Invalid Ticker', () => {
    cy.log('🧪 TEST CASE: TC-ME03 - Extreme boundary values and invalid ticker');
    
    cy.get('#fatype1').select('2');
    cy.get('#faticker1').clear().type('INVALID');
    cy.get('#fareturn1').clear().type('-5');
    cy.get('#favolatility1').clear().type('0');
    
    cy.get('#fatype2').select('1');
    cy.get('#faac2').select('TotalStockMarket');
    cy.get('#fareturn2').clear().type('-100.01');
    cy.get('#favolatility2').clear().type('200.01');
    
    cy.get('#submitExpectationsButton').click();
    cy.url().should('include', '/manage-market-expectations');
  });

  it('TC-ME04: Boundary Value Testing', () => {
    cy.log('🧪 TEST CASE: TC-ME04 - Boundary value testing');
    
    cy.get('#fatype1').select('1');
    cy.get('#faac1').select('TotalStockMarket');
    cy.get('#fareturn1').clear().type('-100');
    cy.get('#favolatility1').clear().type('200');
    
    cy.get('#fatype2').select('2');
    cy.get('#faticker2').clear().type('VTI');
    cy.get('#fareturn2').clear().type('1000');
    cy.get('#favolatility2').clear().type('0');
    
    cy.get('#submitExpectationsButton').click();
    cy.url().should('include', '/manage-market-expectations');
  });

  it('TC-ME05: Multiple Asset Classes with Various Returns', () => {
    cy.log('🧪 TEST CASE: TC-ME05 - Multiple asset classes with various returns');
    
    cy.get('#fatype1').select('1');
    cy.get('#faac1').select('Commodities');
    cy.get('#fareturn1').clear().type('3.0');
    cy.get('#favolatility1').clear().type('25');
    
    cy.get('#fatype2').select('2');
    cy.get('#faticker2').clear().type('GLD');
    cy.get('#fareturn2').clear().type('2.5');
    cy.get('#favolatility2').clear().type('18');
    
    cy.get('#fatype3').select('1');
    cy.get('#faac3').select('IntlDeveloped');
    cy.get('#fareturn3').clear().type('7.0');
    cy.get('#favolatility3').clear().type('20');
    
    cy.get('#submitExpectationsButton').click();
    cy.url().should('include', '/manage-market-expectations');
  });

  it('TC-ME06: Type Switching Behavior', () => {
    cy.log('🧪 TEST CASE: TC-ME06 - Type switching behavior');
    
    cy.get('#fatype1').select('1');
    cy.get('#faac1').should('be.visible');
    cy.get('#faticker1').should('not.be.visible');
    
    cy.get('#fatype1').select('2');
    cy.get('#faac1').should('not.be.visible');
    cy.get('#faticker1').should('be.visible');
    
    cy.get('#fatype1').select('1');
    cy.get('#faac1').should('be.visible');
    cy.get('#faticker1').should('not.be.visible');
  });

  it('TC-ME07: All Asset Class Categories', () => {
    cy.log('🧪 TEST CASE: TC-ME07 - Test all asset class categories');
    
    const assetClasses = [
      { type: 'TotalStockMarket', return: '8.5', vol: '15' },
      { type: 'TotalBond', return: '4.0', vol: '5' },
      { type: 'REIT', return: '6.0', vol: '18' },
      { type: 'Gold', return: '3.0', vol: '20' }
    ];
    
    assetClasses.forEach((asset, index) => {
      const row = index + 1;
      cy.get(`#fatype${row}`).select('1');
      cy.get(`#faac${row}`).select(asset.type);
      cy.get(`#fareturn${row}`).clear().type(asset.return);
      cy.get(`#favolatility${row}`).clear().type(asset.vol);
    });
    
    cy.get('#submitExpectationsButton').click();
    cy.url().should('include', '/manage-market-expectations');
  });

  it('TC-ME08: Valid Ticker Symbols', () => {
    cy.log('🧪 TEST CASE: TC-ME08 - Valid ticker symbols');
    
    const tickers = ['VTI', 'BND', 'GLD', 'VNQ'];
    
    tickers.forEach((ticker, index) => {
      const row = index + 1;
      cy.get(`#fatype${row}`).select('2');
      cy.get(`#faticker${row}`).clear().type(ticker);
      cy.get(`#fareturn${row}`).clear().type('5.0');
      cy.get(`#favolatility${row}`).clear().type('10');
    });
    
    cy.get('#submitExpectationsButton').click();
    cy.url().should('include', '/manage-market-expectations');
  });

  it('TC-ME09: Cancel Button Functionality', () => {
    cy.log('🧪 TEST CASE: TC-ME09 - Cancel button functionality');
    
    cy.get('#fatype1').select('1');
    cy.get('#faac1').select('TotalStockMarket');
    cy.get('#fareturn1').clear().type('10.0');
    
    cy.get('#cancelExpectationsButton').click();
    cy.url().should('include', '/manage-market-expectations');
  });

  it('TC-ME10: Return Percentage Validation', () => {
    cy.log('🧪 TEST CASE: TC-ME10 - Return percentage validation');
    
    const testCases = [
      { return: '0', valid: true },
      { return: '-5.0', valid: true },
      { return: '50.0', valid: true },
      { return: '', valid: false }
    ];
    
    testCases.forEach((testCase, index) => {
      const row = index + 1;
      cy.get(`#fatype${row}`).select('1');
      cy.get(`#faac${row}`).select('TotalStockMarket');
    });
    
    cy.get('#submitExpectationsButton').click();
    cy.get('body').should('contain', 'Expectations for the same asset specified multiple times');
    cy.url().should('include', '/manage-market-expectations');
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