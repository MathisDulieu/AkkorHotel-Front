import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import Home from "../../pages/common/Home";
import {fetchHotels} from "../../hooks/HotelHooks";
import {BrowserRouter as Router} from "react-router-dom";

vi.mock("../../hooks/HotelHooks", () => ({
    fetchHotels: vi.fn(),
}));

beforeEach(() => {
    vi.mocked(fetchHotels).mockResolvedValue({
        informations: {
            hotels: [],
            hotelsFound: 0,
            totalPages: 0,
        },
    });
});

describe("Home Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render the main sections when the component is mounted", () => {
        render(<Home />, { wrapper: Router });

        expect(screen.getByText("Informations")).toBeInTheDocument();
        expect(screen.getByText("City")).toBeInTheDocument();
        expect(screen.getByText("Check-in")).toBeInTheDocument();
        expect(screen.getByText("Check-out")).toBeInTheDocument();
        expect(screen.getByText("Guest(s)")).toBeInTheDocument();
        expect(screen.getByText("Bedrooms")).toBeInTheDocument();
        expect(screen.getByText("Filters")).toBeInTheDocument();
    });

    it("should fetch hotels when the component is mounted", async () => {
        fetchHotels.mockResolvedValue({
            informations: {
                hotels: [],
                hotelsFound: 0,
                totalPages: 0,
                error: null,
            },
        });

        render(<Home />, { wrapper: Router });
        await waitFor(() => {
            expect(fetchHotels).toHaveBeenCalled();
        });
    });

    it("should display an error message when fetching hotels fails", async () => {
        fetchHotels.mockRejectedValue(new Error("Failed to fetch hotels"));

        render(<Home />, { wrapper: Router });
        await waitFor(() => {
            expect(
                screen.getByText("Failed to fetch hotels")
            ).toBeInTheDocument();
        });
    });

    it("should increment the guest count when the increment button is clicked", () => {
        render(<Home />, { wrapper: Router });

        const guestSection = screen
            .getByText("Guest(s)")
            .closest("div").parentElement;

        const incrementButton = guestSection.querySelector(
            "button:last-of-type"
        );

        fireEvent.click(incrementButton);

        const input = guestSection.querySelector("input");
        expect(input.value).toBe("2");
    });

    it("should decrement the guest count when the decrement button is clicked", () => {
        render(<Home />, { wrapper: Router });

        const guestSection = screen
            .getByText("Guest(s)")
            .closest("div").parentElement;
        const incrementButton = guestSection.querySelector(
            "button:last-of-type"
        );
        fireEvent.click(incrementButton);

        const decrementButton = guestSection.querySelector(
            "button:first-of-type"
        );
        fireEvent.click(decrementButton);

        const input = guestSection.querySelector("input");
        expect(input.value).toBe("1");
    });

    it("should increment the bedroom count when the increment button is clicked", () => {
        render(<Home />, { wrapper: Router });

        const bedroomSection = screen
            .getByText("Bedrooms")
            .closest("div").parentElement;

        const incrementButton = bedroomSection.querySelector(
            "button:last-of-type"
        );
        fireEvent.click(incrementButton);

        const input = bedroomSection.querySelector("input");
        expect(input.value).toBe("2");
    });

    it("should decrement the bedroom count when the decrement button is clicked", () => {
        render(<Home />, { wrapper: Router });

        const bedroomSection = screen
            .getByText("Bedrooms")
            .closest("div").parentElement;
        const incrementButton = bedroomSection.querySelector(
            "button:last-of-type"
        );
        fireEvent.click(incrementButton);

        const decrementButton = bedroomSection.querySelector(
            "button:first-of-type"
        );
        fireEvent.click(decrementButton);

        const input = bedroomSection.querySelector("input");
        expect(input.value).toBe("1");
    });

    it("should update the price range when the price inputs are changed", async () => {
        render(<Home />, { wrapper: Router });

        const minPriceInput = await screen.findByLabelText(/Minimum price/i);
        const maxPriceInput = await screen.findByLabelText(/Maximum price/i);

        fireEvent.change(minPriceInput, { target: { value: "50" } });
        fireEvent.change(maxPriceInput, { target: { value: "150" } });
        fireEvent.blur(maxPriceInput);

        expect(minPriceInput.value).toBe("50");
        expect(maxPriceInput.value).toBe("150");
    });

    it("should not allow minimum price to exceed maximum price minus 50", () => {
        render(<Home />, { wrapper: Router });

        const minPriceInput = screen.getByLabelText(/Minimum price:/i);
        const maxPriceInput = screen.getByLabelText(/Maximum price:/i);

        fireEvent.change(maxPriceInput, { target: { value: "200" } });
        fireEvent.blur(maxPriceInput);

        fireEvent.change(minPriceInput, { target: { value: "180" } });

        expect(minPriceInput.value).toBe("150");
    });

    it("should not allow maximum price to be less than minimum price plus 50", () => {
        render(<Home />, { wrapper: Router });

        const minPriceInput = screen.getByLabelText(/Minimum price:/i);
        const maxPriceInput = screen.getByLabelText(/Maximum price:/i);

        fireEvent.change(minPriceInput, { target: { value: "100" } });

        fireEvent.change(maxPriceInput, { target: { value: "120" } });
        fireEvent.blur(maxPriceInput);

        expect(maxPriceInput.value).toBe("150");
    });

    it("should update the star categories when the checkboxes are clicked", () => {
        render(<Home />, { wrapper: Router });
        const oneStarCheckbox = screen.getByLabelText("1 Star");
        const twoStarsCheckbox = screen.getByLabelText("2 Stars");

        fireEvent.click(oneStarCheckbox);
        expect(oneStarCheckbox).toBeChecked();

        fireEvent.click(twoStarsCheckbox);
        expect(twoStarsCheckbox).toBeChecked();
    });

    it("should update the hotel amenities when the checkboxes are clicked", () => {
        render(<Home />, { wrapper: Router });
        const wifiCheckbox = screen.getByLabelText("WiFi");
        const poolCheckbox = screen.getByLabelText("Swimming Pool");

        fireEvent.click(wifiCheckbox);
        expect(wifiCheckbox).toBeChecked();

        fireEvent.click(poolCheckbox);
        expect(poolCheckbox).toBeChecked();
    });
});
