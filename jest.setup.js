// Import Jest DOM matchers
import '@testing-library/jest-dom';

// Mock window.alert
window.alert = jest.fn();

// Mock confetti function
window.confetti = jest.fn(() => {});
window.confetti.reset = jest.fn();
