import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Header from "../../../components/structure/header.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../../../services/AuthContext"; // Ajustez le chemin selon votre structure

// Mock the hooks
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
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        getAll: () => store,
    };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Header Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
    });

    const renderWithContext = (ui) => {
        const mockSetIsAuthenticated = vi.fn();
        const mockSetIsAdmin = vi.fn();

        return render(
            <AuthContext.Provider
                value={{
                    isAuthenticated: true,
                    setIsAuthenticated: mockSetIsAuthenticated,
                    setIsAdmin: mockSetIsAdmin,
                }}
            >
                <Router>{ui}</Router>
            </AuthContext.Provider>
        );
    };

    it("should render the header with the correct title", () => {
        renderWithContext(<Header />);

        expect(screen.getByText("Akkor Hotel")).toBeInTheDocument();
    });

    it("should display the username and profile image when authenticated", () => {
        localStorageMock.setItem("authToken", "fake-token");
        localStorageMock.setItem("username", "testuser");
        localStorageMock.setItem("profileImage", "test-image.jpg");

        renderWithContext(<Header />);

        expect(screen.getByText("testuser")).toBeInTheDocument();
        expect(screen.getByAltText("Profile")).toBeInTheDocument();
    });

    it("should toggle the dropdown menu when the profile image is clicked", () => {
        localStorageMock.setItem("authToken", "fake-token");
        localStorageMock.setItem("username", "testuser");
        localStorageMock.setItem("profileImage", "test-image.jpg");

        renderWithContext(<Header />);

        const profileImage = screen.getByAltText("Profile");
        fireEvent.click(profileImage);

        expect(screen.getByText("My Account")).toBeInTheDocument();
        expect(screen.getByText("My Bookings")).toBeInTheDocument();
    });

    it("should navigate to the specified path when a menu item is clicked", () => {
        renderWithContext(<Header />);

        const profileImage = screen.getByAltText("Profile");
        fireEvent.click(profileImage);

        fireEvent.click(screen.getByText("My Account"));
        expect(mockNavigate).toHaveBeenCalledWith("/my-account");

        fireEvent.click(screen.getByText("My Bookings"));
        expect(mockNavigate).toHaveBeenCalledWith("/my-bookings");
    });

    it("should log out the user when the logout button is clicked", () => {
        renderWithContext(<Header />);
        // check is authenticated
        expect(localStorageMock.getItem("authToken")).toBe("fake-token");

        const profileImage = screen.getByAltText("Profile");
        fireEvent.click(profileImage);

        fireEvent.click(screen.getByText("Log Out"));

        expect(localStorageMock.removeItem).toHaveBeenCalledWith("authToken");
        expect(localStorageMock.removeItem).toHaveBeenCalledWith("username");
        expect(localStorageMock.removeItem).toHaveBeenCalledWith("profileImage");
        expect(localStorageMock.removeItem).toHaveBeenCalledWith("userRole");
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
