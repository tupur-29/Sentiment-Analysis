import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import FileUpload from '../FileUpload';
import { AuthContext } from '../../context/AuthContext';

describe('FileUpload', () => {
    const mockOnAnalysisComplete = vi.fn();
    const mockAuthContext = {
        token: 'test-token',
        isAuthenticated: () => true
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders file upload component', () => {
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <FileUpload onAnalysisComplete={mockOnAnalysisComplete} />
            </AuthContext.Provider>
        );

        expect(screen.getByText(/Upload CSV File/i)).toBeInTheDocument();
    });

    it('handles file selection', async () => {
        render(
            <AuthContext.Provider value={mockAuthContext}>
                <FileUpload onAnalysisComplete={mockOnAnalysisComplete} />
            </AuthContext.Provider>
        );

        const file = new File(['test'], 'test.csv', { type: 'text/csv' });
        const input = screen.getByLabelText(/choose csv file/i);

        await waitFor(() => {
            fireEvent.change(input, { target: { files: [file] } });
        });

        expect(input.files[0]).toBe(file);
    });
});