import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import LoginForm from "../auth/LoginForm";

// Mock du contexte d'authentification
const mockLogin = vi.fn();
const mockAuthContext = {
    login: mockLogin,
    isLoading: false,
    error: null,
};

const renderWithRouter = (ui, { providerProps = {} } = {}) => {
    return render(
        <BrowserRouter>
            <AuthContext.Provider
                value={{ ...mockAuthContext, ...providerProps }}
            >
                {ui}
            </AuthContext.Provider>
        </BrowserRouter>
    );
};

describe("LoginForm", () => {
    beforeEach(() => {
        mockLogin.mockClear();
    });

    it("should render all form elements when component mounts", () => {
        renderWithRouter(<LoginForm />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /se connecter/i })
        ).toBeInTheDocument();
    });

});
