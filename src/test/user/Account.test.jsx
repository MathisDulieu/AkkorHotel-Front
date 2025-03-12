import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import Account from "../../pages/user/Account";
import { BrowserRouter as Router } from "react-router-dom";
import { getUserData, updateUser } from "../../hooks/UserHooks";

vi.mock("../../hooks/UserHooks", () => ({
    getUserData: vi.fn(),
    updateProfileImage: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe("Account Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render loading state initially", () => {
        render(<Account />, { wrapper: Router });
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render user details after loading", async () => {
        getUserData.mockResolvedValue({
            informations: {
                username: "testuser",
                email: "test@example.com",
                profileImageUrl: "test.jpg",
                userRole: "USER",
            },
        });
        render(<Account />, { wrapper: Router });
        await waitFor(() => {
            expect(screen.getByText("testuser")).toBeInTheDocument();
            expect(screen.getByText("test@example.com")).toBeInTheDocument();
            expect(
                screen.getByRole("img", { name: "Profile" })
            ).toBeInTheDocument();
            expect(screen.getByText("USER")).toBeInTheDocument();
        });
    });

    it("should allow editing username", async () => {
        getUserData.mockResolvedValue({
            informations: {
                username: "testuser",
                email: "test@example.com",
            },
        });
        render(<Account />, { wrapper: Router });
        await waitFor(() => {
            expect(screen.getByText("testuser")).toBeInTheDocument();
        });
        fireEvent.click(
            screen.getAllByRole("button", { "aria-label": "pencil" })[1]
        );
        const usernameInput = screen.getByRole("textbox");
        fireEvent.change(usernameInput, { target: { value: "newuser" } });
        fireEvent.submit(usernameInput);
        expect(screen.getByText("newuser")).toBeInTheDocument();
    });

    it("should allow editing email", async () => {
        getUserData.mockResolvedValue({
            informations: {
                username: "testuser",
                email: "test@example.com",
            },
        });
        render(<Account />, { wrapper: Router });
        await waitFor(() => {
            expect(screen.getByText("test@example.com")).toBeInTheDocument();
        });
        fireEvent.click(
            screen.getAllByRole("button", { "aria-label": "pencil" })[2]
        );
        const emailInput = screen.getByRole("textbox");
        fireEvent.change(emailInput, { target: { value: "new@example.com" } });
        fireEvent.submit(emailInput);
        expect(screen.getByText("new@example.com")).toBeInTheDocument();
    });

    it("should show error message when updateUser fails", async () => {
        getUserData.mockResolvedValue({
            informations: {
                username: "testuser",
                email: "test@example.com",
            },
        });
        updateUser.mockRejectedValue(new Error("Update failed"));
        render(<Account />, { wrapper: Router });
        await waitFor(() => {
            expect(screen.getByText("testuser")).toBeInTheDocument();
        });
        fireEvent.click(
            screen.getAllByRole("button", { "aria-label": "pencil" })[1]
        );
        const usernameInput = screen.getByRole("textbox");
        fireEvent.change(usernameInput, { target: { value: "newuser" } });
        fireEvent.submit(usernameInput);
        fireEvent.click(screen.getByText("Save changes"));
        await waitFor(() => {
            expect(
                screen.getByText("An error occurred during the update.")
            ).toBeInTheDocument();
        });
    });

    it("should show success message when updateUser is successful", async () => {
        getUserData.mockResolvedValue({
            informations: {
                username: "testuser",
                email: "test@example.com",
            },
        });
        updateUser.mockResolvedValue();
        render(<Account />, { wrapper: Router });
        await waitFor(() => {
            expect(screen.getByText("testuser")).toBeInTheDocument();
        });
        fireEvent.click(
            screen.getAllByRole("button", { "aria-label": "pencil" })[1]
        );
        const usernameInput = screen.getByRole("textbox");
        fireEvent.change(usernameInput, { target: { value: "newuser" } });
        fireEvent.submit(usernameInput);
        fireEvent.click(screen.getByText("Save changes"));
        await waitFor(() => {
            expect(
                screen.getByText("Information updated successfully!")
            ).toBeInTheDocument();
        });
    });
});
