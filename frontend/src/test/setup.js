import '@testing-library/jest-dom';

// Mock implementations
const mockObserver = () => ({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
});

window.IntersectionObserver = jest.fn().mockImplementation(mockObserver);
window.ResizeObserver = jest.fn().mockImplementation(mockObserver); 