/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';
import { vi } from 'vitest';

declare global {
    interface Window {
        IntersectionObserver: any;
        ResizeObserver: any;
    }
}

window.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
}));

window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
}));

vi.mock('chart.js', () => ({
    Chart: vi.fn(),
    registerables: []
}));

export { };

