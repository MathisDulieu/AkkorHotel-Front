import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import Login from "../../pages/authentication/Login";
import {login} from "../../hooks/AuthenticationHooks";
import {getUserData} from "../../hooks/UserHooks";
import {BrowserRouter as Router} from "react-router-dom";
import {AuthContext} from "../../services/AuthContext"; // Ajustez le chemin selon votre structure

// Mock the hooks
vi.mock("../../hooks/AuthenticationHooks", () => ({
    login: vi.fn(),
}));

vi.mock("../../hooks/UserHooks", () => ({
    getUserData: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
        getAll: () => store,
    };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Login Component", () => {
    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();
        localStorageMock.clear();

        // Mock implementation for login and getUserData
        login.mockImplementation(() =>
            Promise.resolve({ token: "fake-token" })
        );
        getUserData.mockImplementation(() =>
            Promise.resolve({
                informations: {
                    username: "testuser",
                    profileImageUrl: "test-image.jpg",
                    userRole: "USER",
                },
            })
        );
    });

    const renderWithContext = (ui) => {
        const mockSetIsAuthenticated = vi.fn();
        const mockSetIsAdmin = vi.fn();

        return render(
            <AuthContext.Provider
                value={{
                    setIsAuthenticated: mockSetIsAuthenticated,
                    setIsAdmin: mockSetIsAdmin,
                }}
            >
                <Router>{ui}</Router>
            </AuthContext.Provider>
        );
    };

    it("should render the login form correctly", () => {
        renderWithContext(<Login />);

        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByText("Password")).toBeInTheDocument();
        expect(screen.getByText("Remember me")).toBeInTheDocument();
        expect(screen.getByText("Log in")).toBeInTheDocument();
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    });

    it("should display an error message when form is submitted with empty fields", async () => {
        renderWithContext(<Login />);

        fireEvent.click(screen.getByText("Log in"));

        expect(
            await screen.findByText("Email is required.")
        ).toBeInTheDocument();
        expect(
            await screen.findByText(
                /Password must be at least 8 characters long/
            )
        ).toBeInTheDocument();
    });

    it("should display an error message when the password is too weak", async () => {
        renderWithContext(<Login />);

        fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
            target: { value: "test@example.com" },
        });

        fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
            target: { value: "weak" },
        });

        fireEvent.click(screen.getByText("Log in"));

        expect(
            await screen.findByText(
                /Password must be at least 8 characters long/
            )
        ).toBeInTheDocument();
    });

    it("should allow login with valid credentials", async () => {
        renderWithContext(<Login />);

        fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
            target: { value: "test@example.com" },
        });

        fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
            target: { value: "StrongPass1!" },
        });

        fireEvent.click(screen.getByText("Log in"));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith(
                "test@example.com",
                "StrongPass1!"
            );
            expect(
                screen.getByText("Login successful. Redirecting...")
            ).toBeInTheDocument();
        });

        // Check that user data was fetched and stored
        expect(getUserData).toHaveBeenCalled();

        await waitFor(() => {
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "username",
                "testuser"
            );
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "profileImage",
                "test-image.jpg"
            );
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "userRole",
                "USER"
            );
        });

        // Check for navigation after timeout
        await new Promise((r) => setTimeout(r, 2100)); // Wait for the 2000ms timeout
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should display error message when login fails", async () => {
        login.mockImplementation(() =>
            Promise.reject(new Error("Invalid credentials"))
        );

        renderWithContext(<Login />);

        fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
            target: { value: "test@example.com" },
        });

        fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
            target: { value: "StrongPass1!" },
        });

        fireEvent.click(screen.getByText("Log in"));

        expect(
            await screen.findByText("ERROR : Invalid credentials")
        ).toBeInTheDocument();
    });

    it("should redirect to home if user is already authenticated", () => {
        localStorageMock.setItem("authToken", "existing-token");

        renderWithContext(<Login />);

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should toggle remember me checkbox", () => {
        renderWithContext(<Login />);

        const checkbox = screen.getByLabelText("Remember me");
        expect(checkbox.checked).toBe(false);

        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(true);

        fireEvent.click(checkbox);
        expect(checkbox.checked).toBe(false);
    });
});
