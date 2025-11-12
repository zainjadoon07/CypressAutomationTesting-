describe('Portfolio Visualizer - Login Page Test Suite', () => {
  beforeEach(() => {
    // Open login page before each test
    cy.visit('https://www.portfoliovisualizer.com/login');
  });

  it('TC-LN01: Valid Login with Correct Credentials', () => {
    // Input valid credentials
    cy.get('#username')
      .should('be.visible')
      .clear()
      .type('zainulabdin.atd@gmail.com');

    cy.get('#password')
      .should('be.visible')
      .clear()
      .type('wasimkhan444');

    // Check "Stay signed in" checkbox
    cy.get('#rememberLogin')
      .should('exist')
      .check({ force: true });

    // Click Login button
    cy.get('#submitButton')
      .should('have.value', 'Login')
      .click();

    // Expected: Success - Redirect to dashboard
    cy.url({ timeout: 10000 }).should('include', '/');
    cy.contains('Portfolio Visualizer').should('exist');
    
    // Verify session persistence (you might see user-specific content)
    cy.get('body').should('not.contain', 'Invalid email or password');
  });

  it('TC-LN02: Empty Email and Password', () => {
    // Leave both fields empty
    cy.get('#username').clear();
    cy.get('#password').clear();

    // Ensure checkbox is unchecked (default)
    cy.get('#rememberLogin').should('not.be.checked');

    // Click Login button
    cy.get('#submitButton').click();

    // Expected: Error messages for required fields
    // Note: Adjust selectors based on actual error message elements
    cy.get('body').should(($body) => {
      // Check for any error messages - adjust based on actual implementation
      expect($body).to.satisfy(($el) => {
        const text = $el.text();
        return text.includes('Email required') || 
               text.includes('Password required') || 
               text.includes('Invalid email or password') ||
               text.includes('required');
      });
    });

    // Should stay on login page
    cy.url().should('include', '/login');
  });

  it('TC-LN03: Invalid Email Format with Valid Password Format', () => {
    // Input invalid email format
    cy.get('#username')
      .clear()
      .type('invalid-email');

    cy.get('#password')
      .clear()
      .type('Password123');

    // Check "Stay signed in" checkbox
    cy.get('#rememberLogin')
      .check({ force: true });

    // Click Login button
    cy.get('#submitButton').click();

    // Expected: Error for invalid email format
    cy.get('body').should(($body) => {
      expect($body).to.satisfy(($el) => {
        const text = $el.text();
        return text.includes('Invalid email format') || 
               text.includes('Invalid email or password') ||
               text.includes('valid email');
      });
    });

    // Should stay on login page
    cy.url().should('include', '/login');
  });

  it('TC-LN04: Unregistered Email with Short Password', () => {
    // Input unregistered email and short password
    cy.get('#username')
      .clear()
      .type('newuser@example.com');

    cy.get('#password')
      .clear()
      .type('pass'); // 4 characters - below minimum

    // Leave checkbox unchecked (default)
    cy.get('#rememberLogin').should('not.be.checked');

    // Click Login button
    cy.get('#submitButton').click();

    // Expected: Generic error for incorrect credentials
    cy.get('body').should(($body) => {
      expect($body).to.satisfy(($el) => {
        const text = $el.text();
        return text.includes('email or password incorrect') || 
               text.includes('Invalid email or password') ||
               text.includes('invalid credentials');
      });
    });

    // Should stay on login page
    cy.url().should('include', '/login');
  });

  it('TC-LN05: Valid Email with Excessively Long Password', () => {
    // Generate 51-character password
    const longPassword = 'A'.repeat(51);

    cy.get('#username')
      .clear()
      .type('user@example.com');

    cy.get('#password')
      .clear()
      .type(longPassword);

    // Check "Stay signed in" checkbox
    cy.get('#rememberLogin')
      .check({ force: true });

    // Click Login button
    cy.get('#submitButton').click();

    // Expected: Password length error or generic failure
    cy.get('body').should(($body) => {
      expect($body).to.satisfy(($el) => {
        const text = $el.text();
        return text.includes('Password too long') || 
               text.includes('Invalid email or password') ||
               text.includes('exceeded maximum length');
      });
    });

    // Should stay on login page
    cy.url().should('include', '/login');
  });

  it('TC-LN06: Forgot Password Flow with Valid Email', () => {
    // Input valid email
    cy.get('#username')
      .clear()
      .type('user@example.com');

    // Click "Forgot password?" link
    // Note: Adjust selector based on actual link text/element
    cy.contains('Forgot password?')
      .should('exist')
      .click();

    // Expected: Redirect to password reset page or show reset form
    cy.url().should(($url) => {
      expect($url).to.satisfy((url) => {
        return url.includes('/reset') || 
               url.includes('/forgot') || 
               url.includes('/recover');
      });
    });

    // Check for reset confirmation message
    cy.get('body').should(($body) => {
      expect($body).to.satisfy(($el) => {
        const text = $el.text();
        return text.includes('Reset email sent') || 
               text.includes('Check your email') ||
               text.includes('password reset');
      });
    });
  });
});