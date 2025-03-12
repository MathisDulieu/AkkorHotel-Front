import {render, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import ValidEmail from "../../pages/authentication/ValidEmail";
import {confirmEmail} from "../../hooks/AuthenticationHooks";
import {BrowserRouter as Router} from "react-router-dom";

// Mock the hooks
vi.mock("../../hooks/AuthenticationHooks", () => ({
    confirmEmail: vi.fn(),
}));

describe("ValidEmail Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should display loading state when validating email", () => {
        render(<ValidEmail />, { wrapper: Router });

        expect(screen.getByText("Verifying your email address...")).toBeInTheDocument();
    });

    it("should display success message when email is validated", async () => {
        confirmEmail.mockResolvedValue({ message: "Email validated" });

        render(<ValidEmail />, { wrapper: Router, initialEntries: ["/valid-email/fake-token"] });

        await waitFor(() => {
            expect(screen.getByText((content, element) => element.textContent.includes("Your account has been activated"))).toBeInTheDocument();
            expect(screen.getByText((content, element) => element.textContent.includes("Redirecting to login page in 5 seconds..."))).toBeInTheDocument();
        });
    });

    it("should display error message when email validation fails", async () => {
        confirmEmail.mockRejectedValue(new Error("Validation failed"));

        render(<ValidEmail />, { wrapper: Router, initialEntries: ["/valid-email/fake-token"] });

        await waitFor(() => {
            expect(screen.getByText("There was a problem validating your email")).toBeInTheDocument();
        });
    });

    it("should redirect to login page after successful validation", async () => {
        confirmEmail.mockResolvedValue({ message: "Email validated" });

        render(<ValidEmail />, { wrapper: Router, initialEntries: ["/valid-email/fake-token"] });

        await waitFor(() => {
            expect(screen.getByText((content, element) => element.textContent.includes("Redirecting to login page in 5 seconds..."))).toBeInTheDocument();
        });

        vi.useFakeTimers();
        vi.advanceTimersByTime(5000);

        await waitFor(() => {
            expect(screen.queryByText((content, element) => element.textContent.includes("Redirecting to login page in 5 seconds..."))).not.toBeInTheDocument();
        });

        vi.useRealTimers();
    });

    it("should display error message when no token is provided", () => {
        render(<ValidEmail />, { wrapper: Router });

        expect(screen.getByText("No validation token provided.")).toBeInTheDocument();
    });
});
