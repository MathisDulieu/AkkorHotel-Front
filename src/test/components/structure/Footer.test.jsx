import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../../../components/structure/footer";

describe("Footer Component", () => {
    it("should render the footer with the correct links", () => {
        render(<Footer />);

        expect(screen.getByText("Useful links")).toBeInTheDocument();
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("My Account")).toBeInTheDocument();
        expect(screen.getByText("My Bookings")).toBeInTheDocument();

        expect(screen.getByText("Legal")).toBeInTheDocument();
        expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
        expect(screen.getByText("Cookie Policy")).toBeInTheDocument();
        expect(screen.getByText("Terms of Service")).toBeInTheDocument();

        expect(screen.getByText("Contact")).toBeInTheDocument();
        expect(screen.getByText("Email: contact@akkorhotel.com")).toBeInTheDocument();
        expect(screen.getByText("Phone: +33 1 23 45 67 89")).toBeInTheDocument();
    });

    it("should display the current year in the footer", () => {
        render(<Footer />);

        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(`© ${currentYear} AkkorHotel. All rights reserved.`))).toBeInTheDocument();
    });
});
