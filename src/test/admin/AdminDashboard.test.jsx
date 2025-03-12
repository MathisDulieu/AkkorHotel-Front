import React from "react";
import { describe, it, expect, vi} from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AdminDashboard from "../../pages/admin/AdminDashboard"; 

vi.mock("../../components/admin/DashboardPresentation.jsx", () => ({
    default: () => <div data-testid="dashboard-presentation">Dashboard Presentation</div>,
}));

vi.mock("../../components/admin/CreateHotel.jsx", () => ({
    default: () => <div data-testid="create-hotel">Create Hotel</div>,
}));

vi.mock("../../components/admin/UpdateHotel.jsx", () => ({
    default: () => <div data-testid="update-hotel">Update Hotel</div>,
}));

vi.mock("../../components/admin/DeleteHotel.jsx", () => ({
    default: () => <div data-testid="delete-hotel">Delete Hotel</div>,
}));

vi.mock("../../components/admin/GetUserById.jsx", () => ({
    default: () => <div data-testid="get-user-by-id">Get User By Id</div>,
}));

vi.mock("../../components/admin/UpdateUser.jsx", () => ({
    default: () => <div data-testid="update-user">Update User</div>,
}));

vi.mock("../../components/admin/GetUsers.jsx", () => ({
    default: () => <div data-testid="get-users">Get Users</div>,
}));

describe("AdminDashboard Component", () => {
    it("renders with default content (DashboardPresentation)", () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        expect(screen.getByTestId("dashboard-presentation")).toBeInTheDocument();
    });

    it("navigates to create hotel content", () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        fireEvent.click(screen.getByText("Hotels"));
        fireEvent.click(screen.getByText("Create a hotel"));
        expect(screen.getByTestId("create-hotel")).toBeInTheDocument();
    });

    it("navigates to update hotel content", () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        fireEvent.click(screen.getByText("Hotels"));
        fireEvent.click(screen.getByText("Update a hotel"));
        expect(screen.getByTestId("update-hotel")).toBeInTheDocument();
    });

    it("navigates to delete hotel content", () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        fireEvent.click(screen.getByText("Hotels"));
        fireEvent.click(screen.getByText("Delete a hotel"));
        expect(screen.getByTestId("delete-hotel")).toBeInTheDocument();
    });

    it("navigates to list bookings content", async () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        fireEvent.click(screen.getByText("Hotels"));
        fireEvent.click(screen.getByText("List of bookings"));
    
        await waitFor(() => {
            expect(screen.getByText("List of bookings")).toBeInTheDocument();
        });
    });

    it("navigates to retrieve user content", () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        fireEvent.click(screen.getByText("Users"));
        fireEvent.click(screen.getByText("Retrieve user by ID"));
        expect(screen.getByTestId("get-user-by-id")).toBeInTheDocument();
    });

    it("navigates to update user content", () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        fireEvent.click(screen.getByText("Users"));
        fireEvent.click(screen.getByText("Update user"));
        expect(screen.getByTestId("update-user")).toBeInTheDocument();
    });

    it("navigates to list users content", () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        fireEvent.click(screen.getByText("Users"));
        fireEvent.click(screen.getByText("List users"));
        expect(screen.getByTestId("get-users")).toBeInTheDocument();
    });

    it("toggles hotels menu", () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        const hotelsButton = screen.getByText("Hotels");
        fireEvent.click(hotelsButton);
        expect(screen.getByText("Create a hotel")).toBeInTheDocument();
        fireEvent.click(hotelsButton);
        expect(screen.queryByText("Create a hotel")).not.toBeInTheDocument();
    });

    it("toggles users menu", () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        const usersButton = screen.getByText("Users");
        fireEvent.click(usersButton);
        expect(screen.getByText("Retrieve user by ID")).toBeInTheDocument();
        fireEvent.click(usersButton);
        expect(screen.queryByText("Retrieve user by ID")).not.toBeInTheDocument();
    });
});