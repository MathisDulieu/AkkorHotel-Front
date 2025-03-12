import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ValidEmail from '../../pages/authentication/ValidEmail';
import { BrowserRouter as Router } from 'react-router-dom';

vi.mock('../../hooks/AuthenticationHooks', () => ({
    confirmEmail: vi.fn(),
}));
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('ValidEmail Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should display error message when no token is provided', () => {
        render(<ValidEmail />, { wrapper: Router });
        expect(screen.getByText(/No validation token provided/i)).toBeInTheDocument();
    });
});
