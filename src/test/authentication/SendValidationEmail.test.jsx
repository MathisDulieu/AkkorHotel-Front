import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import SendValidationEmail from "../../pages/authentication/SendValidationEmail";
import {resendConfirmationEmail} from "../../hooks/AuthenticationHooks";
import {BrowserRouter as Router} from "react-router-dom";

vi.mock("../../hooks/AuthenticationHooks", () => ({
    resendConfirmationEmail: vi.fn(),
}));

describe("SendValidationEmail Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the email input and send button', () => {
        render(<SendValidationEmail />, { wrapper: Router });

        expect(screen.getByText('Account Confirmation')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();

        expect(screen.getByText('Send')).toBeInTheDocument();
    });

    it("should display an error message when the email is invalid", async () => {
        render(<SendValidationEmail />, { wrapper: Router });

        fireEvent.change(screen.getByPlaceholderText("Enter your email address"), {
            target: { value: "invalid-email" },
        });
        fireEvent.click(screen.getByText("Send"));

        expect(await screen.findByText("Please enter a valid email address")).toBeInTheDocument();
    });

    it("should send a confirmation email when the email is valid", async () => {
        resendConfirmationEmail.mockResolvedValue({ message: "Email sent" });

        render(<SendValidationEmail />, { wrapper: Router });

        fireEvent.change(screen.getByPlaceholderText("Enter your email address"), {
            target: { value: "test@example.com" },
        });
        fireEvent.click(screen.getByText("Send"));

        await waitFor(() => {
            expect(resendConfirmationEmail).toHaveBeenCalledWith("test@example.com");
            expect(screen.getByText("Confirmation email sent successfully!")).toBeInTheDocument();
        });
    });

    it("should display an error message when sending the email fails", async () => {
        resendConfirmationEmail.mockRejectedValue(new Error("Failed to send email"));

        render(<SendValidationEmail />, { wrapper: Router });

        fireEvent.change(screen.getByPlaceholderText("Enter your email address"), {
            target: { value: "test@example.com" },
        });
        fireEvent.click(screen.getByText("Send"));

        expect(await screen.findByText("Failed to send email")).toBeInTheDocument();
    });

    it("should disable the send button after sending an email", async () => {
        resendConfirmationEmail.mockResolvedValue({ message: "Email sent" });

        render(<SendValidationEmail />, { wrapper: Router });

        fireEvent.change(screen.getByPlaceholderText("Enter your email address"), {
            target: { value: "test@example.com" },
        });
        fireEvent.click(screen.getByText("Send"));

        await waitFor(() => {
            expect(screen.queryByText("Send")).not.toBeInTheDocument();
        });
    });
});
