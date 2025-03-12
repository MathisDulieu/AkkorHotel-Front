import {fireEvent, render, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import Register from "../../pages/authentication/Register";
import {register} from "../../hooks/AuthenticationHooks";
import {BrowserRouter as Router} from "react-router-dom";

// Mock de la fonction register
vi.mock("../../hooks/AuthenticationHooks", () => ({
    register: vi.fn(),
}));

describe("Register Component", () => {
    beforeEach(() => {
        // Réinitialiser les appels mock avant chaque test
        vi.clearAllMocks();
    });

    it("should render the register form correctly", () => {
        render(<Register />, { wrapper: Router });
        expect(screen.getByText("Create Account")).toBeInTheDocument();
        expect(screen.getByText("Username")).toBeInTheDocument();
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByText("Password")).toBeInTheDocument();
        expect(screen.getByText("Confirm Password")).toBeInTheDocument();
    });

    it("should display an error message when the form is submitted with empty fields", async () => {
        render(<Register />, { wrapper: Router });
        fireEvent.click(screen.getByText("Sign Up"));

        expect(
            await screen.findByText("Username is required.")
        ).toBeInTheDocument();
        expect(
            await screen.findByText("Invalid email format.")
        ).toBeInTheDocument();
        expect(
            await screen.findByText(
                "Password must be at least 8 characters long."
            )
        ).toBeInTheDocument();
    });

    it("should display an error message when passwords do not match", async () => {
        render(<Register />, { wrapper: Router });
        fireEvent.change(screen.getByPlaceholderText("Create a password"), {
            target: { value: "password123" },
        });
        fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
            target: { value: "password124" },
        });
        fireEvent.click(screen.getByText("Sign Up"));

        expect(
            await screen.findByText("Passwords do not match.")
        ).toBeInTheDocument();
    });

    it("should display a success message when registration is successful", async () => {
        register.mockResolvedValue(true);

        render(<Register />, { wrapper: Router });
        fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
            target: { value: "John Doe" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
            target: { value: "john@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Create a password"), {
            target: { value: "Password123!" },
        });
        fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
            target: { value: "Password123!" },
        });
        fireEvent.click(screen.getByText("Sign Up"));

        expect(
            await screen.findByText("Account created successfully.")
        ).toBeInTheDocument();
    });

    it("should display an error message when registration fails", async () => {
        register.mockRejectedValue(new Error("Registration failed"));

        render(<Register />, { wrapper: Router });
        fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
            target: { value: "John Doe" },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
            target: { value: "john@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Create a password"), {
            target: { value: "Password123!" },
        });
        fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
            target: { value: "Password123!" },
        });
        fireEvent.click(screen.getByText("Sign Up"));

        expect(
            await screen.findByText("Registration failed")
        ).toBeInTheDocument();
    });
});
