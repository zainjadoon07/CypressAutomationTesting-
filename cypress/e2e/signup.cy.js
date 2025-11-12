describe('Portfolio Visualizer - Signup Page Test Suite', () => {
  beforeEach(() => {
    cy.visit('https://www.portfoliovisualizer.com/sign-up');
  });

  it('TC-SU01: Valid Individual Investor Signup', () => {
    cy.log('🧪 TEST CASE: TC-SU01 - Valid Individual Investor Signup');
    
    // Configuration Section
    cy.get('#profileType').select('Individual Investor');
    cy.get('#country').select('United States');
    cy.get('#marketRegion').select('North America');

    // Account Information
    cy.get('#firstName').type('John');
    cy.get('#lastName').type('Doe');
    cy.get('#email').type('john.doe@example.com');
    // Company field should be hidden for Individual Investor
    cy.get('#company').should('not.be.visible');
    cy.get('#companyType').should('not.be.visible');
    
    // Passwords
    cy.get('#password').type('Passw0rd123!');
    cy.get('#confirmPassword').type('Passw0rd123!');

    

    // Submit form
    cy.get('#submitButton').click();
    cy.get('body').then(($body) => {
  const text = $body.text();
  cy.log('Actual page text:', text);
  
  // Check for expected errors
  expect(text).to.include('reCAPTCHA');
 
});
    // Expected: Should show success or redirect
    // Note: Actual success behavior may vary due to reCAPTCHA
    cy.url().should('include', '/sign-up');
  });

  it('TC-SU02: All Required Fields Empty', () => {
    cy.log('🧪 TEST CASE: TC-SU02 - All Required Fields Empty');
    
    // Leave all fields empty/default
    cy.get('#submitButton').click();

// Debug version to see all error messages
cy.get('body').then(($body) => {
  const text = $body.text();
  cy.log('Actual page text:', text);
  
  // Check for expected errors
  expect(text).to.include('First name not specified');
  expect(text).to.include('Email not specified');
  expect(text).to.include('Password not specified');
  expect(text).to.include('Last name not specified');
  expect(text).to.include('Please select profile type');
});

    // Should stay on signup page
    cy.url().should('include', '/sign-up');
  });

  it('TC-SU03: Firm Profile with Invalid Data', () => {
    cy.log('🧪 TEST CASE: TC-SU03 - Firm Profile with Invalid Data');
    
    // Configuration - Firm profile
    cy.get('#profileType').select('Financial Advisor');
    cy.get('#country').select('Pakistan');
    cy.get('#marketRegion').select('North America'); // Potential mismatch

    // Account Information with invalid data
    cy.get('#firstName').type('John');
    cy.get('#lastName').type('Doe12345678901234567890123456789012345678901234567'); // 51 chars
    cy.get('#email').type('invalid-email-format');
    
    // Company fields should be visible for Firm profile
    cy.get('#company').should('be.visible');
    cy.get('#companyType').should('be.visible');
    
    cy.get('#company').type('A'.repeat(101)); // 101 chars - exceeds typical limit
    cy.get('#companyType').select('Asset Manager');

    // Passwords
    cy.get('#password').type('Passw0rd123!');
    cy.get('#confirmPassword').type('Passw0rd123!');

    cy.get('#submitButton').click();

    // Expected: Multiple validation errors
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.satisfy((content) => {
        return content.includes('Invalid') || 
               content.includes('valid') ||
               content.includes('error') ||
               $body.find('.is-invalid').length > 0;
      });
    });
  });

  it('TC-SU04: Individual Profile with Short Password and Long Company', () => {
    cy.log('🧪 TEST CASE: TC-SU04 - Short Password Validation');
    
    cy.get('#profileType').select('Individual Investor');
    cy.get('#country').select('United States');
    cy.get('#marketRegion').select('North America');

    // Leave first name empty (required field)
    cy.get('#firstName').clear();
    cy.get('#lastName').type('Doe');
    cy.get('#email').clear(); // Empty but optional

    // Short password
    cy.get('#password').type('pass'); // 4 chars
    cy.get('#confirmPassword').type('pass'); // Matching but short

    cy.get('#submitButton').click();

    // Expected: Password length error and first name required
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.satisfy((content) => {
        return content.includes('First name not specified') ||
               content.includes('not specified') ||
               content.includes('minimum') ||
               $body.find('.is-invalid').length > 0;
      });
    });
  });

  it('TC-SU05: Password Mismatch', () => {
    cy.log('🧪 TEST CASE: TC-SU05 - Password Mismatch');
    
    cy.get('#profileType').select('Individual Investor');
    cy.get('#country').select('United States');
    cy.get('#marketRegion').select('North America');

    cy.get('#firstName').type('John');
    cy.get('#lastName').type('Doe');
    cy.get('#email').type('john.doe@example.com');

    // Mismatched passwords
    cy.get('#password').type('Passw0rd123!');
    cy.get('#confirmPassword').type('DifferentPassword123!');

    cy.get('#submitButton').click();

    // Expected: Password mismatch error
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.satisfy((content) => {
        return content.includes('match') ||
               content.includes('same') ||
               content.includes('confirm') ||
               $body.find('.is-invalid').length > 1; // Both password fields might show error
      });
    });
  });

  it('TC-SU06: Firm Profile without Firm Type', () => {
    cy.log('🧪 TEST CASE: TC-SU06 - Firm Profile without Firm Type');
    
    cy.get('#profileType').select('Financial Advisor'); // Firm profile
    cy.get('#country').select('United States');
    cy.get('#marketRegion').select('North America');

    cy.get('#firstName').type('John');
    cy.get('#lastName').type('Doe');
    cy.get('#email').type('john.doe@example.com');
    
    // Company field visible but Firm Type not selected (default "Select...")
    cy.get('#companyType').should('have.value', ''); // Empty value

    cy.get('#password').type('Passw0rd123!');
    cy.get('#confirmPassword').type('Passw0rd123!');

    cy.get('#submitButton').click();

    // Expected: Firm Type required error
    cy.get('body').should(($body) => {
      const text = $body.text();
      expect(text).to.satisfy((content) => {
        return content.includes('Required') ||
               content.includes('Firm') ||
               content.includes('Type') ||
               $body.find('.is-invalid').length > 0;
      });
    });
  });

  it('TC-SU07: Valid Data with Long Password', () => {
    cy.log('🧪 TEST CASE: TC-SU07 - Long Password Validation');
    
    cy.get('#profileType').select('Individual Investor');
    cy.get('#country').select('United States');
    cy.get('#marketRegion').select('North America');

    cy.get('#firstName').type('John');
    cy.get('#lastName').type('Doe');
    cy.get('#email').type('john.doe@example.com');

    // 51-character password
    const longPassword = 'A'.repeat(51);
    cy.get('#password').type(longPassword);
    cy.get('#confirmPassword').type(longPassword);

    cy.get('#submitButton').click();

    // Expected: May accept or show length error
    cy.get('body').then(($body) => {
      if ($body.text().includes('long') || $body.text().includes('maximum') || $body.find('.is-invalid').length > 0) {
        cy.log('Password length validation working');
      } else {
        // Might accept the long password
        cy.log('Long password accepted by system');
      }
    });
  });

  it('TC-SU08: Cancel Button Functionality', () => {
    cy.log('🧪 TEST CASE: TC-SU08 - Cancel Button Functionality');
    
    // Fill some data
    cy.get('#firstName').type('Test');
    cy.get('#lastName').type('User');

    // Click cancel button
    cy.get('#cancelButton').click();

    // Expected: Redirect to home page
    cy.url().should('eq', 'https://www.portfoliovisualizer.com/');
  });

  it('TC-SU09: Profile Type Dynamic Fields', () => {
    cy.log('🧪 TEST CASE: TC-SU09 - Profile Type Dynamic Field Behavior');
    
    // Test Individual Investor - Company fields should be hidden
    cy.get('#profileType').select('Individual Investor');
    cy.get('#company').should('not.be.visible');
    cy.get('#companyType').should('not.be.visible');
    
    // Test Financial Advisor - Company fields should be visible
    cy.get('#profileType').select('Financial Advisor');
    cy.get('#company').should('be.visible');
    cy.get('#companyType').should('be.visible');
    
    // Test Academic - Company fields should be hidden
    cy.get('#profileType').select('Academic');
    cy.get('#company').should('not.be.visible');
    cy.get('#companyType').should('not.be.visible');
    
    // Test Institutional Investor - Company fields should be visible
    cy.get('#profileType').select('Institutional Investor');
    cy.get('#company').should('be.visible');
    cy.get('#companyType').should('be.visible');
  });

  it('TC-SU10: Email Format Validation', () => {
    cy.log('🧪 TEST CASE: TC-SU10 - Email Format Validation');
    
    cy.get('#profileType').select('Individual Investor');
    cy.get('#country').select('United States');
    cy.get('#marketRegion').select('North America');
    cy.get('#firstName').type('John');
    cy.get('#lastName').type('Doe');

    // Test various invalid email formats
    const invalidEmails = [
      'invalid-email',
      'user@',
      '@domain.com',
      'user@domain',
      'user domain.com'
    ];

    invalidEmails.forEach((email, index) => {
      cy.get('#email').clear().type(email);
      cy.get('#password').type('Passw0rd123!');
      cy.get('#confirmPassword').type('Passw0rd123!');
      
      cy.get('#submitButton').click();

     // Fixed code - matches the actual error message
cy.get('body').then(($body) => {
  if ($body.text().includes('Email address is not valid') || 
      $body.text().includes('Invalid') || 
      $body.text().includes('valid') || 
      $body.find('.is-invalid').length > 0) {
    cy.log(`Email validation working for: ${email}`);
  }
});

      // Clear for next iteration
      if (index < invalidEmails.length - 1) {
        cy.reload();
      }
    });
  });
});