/**
 * Centralized test data for the SauceDemo test suite.
 *
 * SauceDemo exposes multiple test users, all sharing a single password.
 * Only standard_user is in scope for this challenge — the others are
 * listed here for completeness and future extensibility.
 *
 * In a production project, credentials would come from environment variables.
 * For this challenge they are hardcoded as per the provided test instructions.
 */

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',     // Out of scope — pre-locked account
  problem: 'problem_user',          // Out of scope — visual/functional bugs
  performanceGlitch: 'performance_glitch_user', // Out of scope
  error: 'error_user',              // Out of scope
  visual: 'visual_user',            // Out of scope
};

// All SauceDemo users share a single password
export const PASSWORD = 'secret_sauce';

// Static checkout form data — SauceDemo does not process real transactions
export const SHIPPING = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '10001',
};

// Routes used in navigation and access control tests
export const ROUTES = {
  login: '/',
  inventory: '/inventory.html',
  cart: '/cart.html',
  checkoutStep1: '/checkout-step-one.html',
};
