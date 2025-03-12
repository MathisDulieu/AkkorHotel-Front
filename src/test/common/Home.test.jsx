import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import Home from "../../pages/common/Home";
import {fetchHotels} from "../../hooks/HotelHooks";
import {BrowserRouter as Router} from "react-router-dom";

// Mock the hooks
vi.mock("../../hooks/HotelHooks", () => ({
    fetchHotels: vi.fn(),
}));

beforeEach(() => {
    // Set up the fetchHotels mock to return a resolved promise with empty data
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

        // Find the guest counter section by looking for the surrounding div with the User icon
        const guestSection = screen
            .getByText("Guest(s)")
            .closest("div").parentElement;

        // Now find the increment button within this section (the button with the plus icon)
        const incrementButton = guestSection.querySelector(
            "button:last-of-type"
        );

        fireEvent.click(incrementButton);

        // Find the input in the same section and check its value
        const input = guestSection.querySelector("input");
        expect(input.value).toBe("2");
    });

    it("should decrement the guest count when the decrement button is clicked", () => {
        render(<Home />, { wrapper: Router });

        // Set initial guest count to 2 to test decrementing
        const guestSection = screen
            .getByText("Guest(s)")
            .closest("div").parentElement;
        const incrementButton = guestSection.querySelector(
            "button:last-of-type"
        );
        fireEvent.click(incrementButton); // Now count is 2

        // Find the decrement button
        const decrementButton = guestSection.querySelector(
            "button:first-of-type"
        );
        fireEvent.click(decrementButton);

        // Find the input and check its value
        const input = guestSection.querySelector("input");
        expect(input.value).toBe("1");
    });

    it("should increment the bedroom count when the increment button is clicked", () => {
        render(<Home />, { wrapper: Router });

        // Find the bedroom counter section
        const bedroomSection = screen
            .getByText("Bedrooms")
            .closest("div").parentElement;

        // Find the increment button
        const incrementButton = bedroomSection.querySelector(
            "button:last-of-type"
        );
        fireEvent.click(incrementButton);

        // Find the input and check its value
        const input = bedroomSection.querySelector("input");
        expect(input.value).toBe("2");
    });

    it("should decrement the bedroom count when the decrement button is clicked", () => {
        render(<Home />, { wrapper: Router });

        // Set initial bedroom count to 2 to test decrementing
        const bedroomSection = screen
            .getByText("Bedrooms")
            .closest("div").parentElement;
        const incrementButton = bedroomSection.querySelector(
            "button:last-of-type"
        );
        fireEvent.click(incrementButton); // Now count is 2

        // Find the decrement button
        const decrementButton = bedroomSection.querySelector(
            "button:first-of-type"
        );
        fireEvent.click(decrementButton);

        // Find the input and check its value
        const input = bedroomSection.querySelector("input");
        expect(input.value).toBe("1");
    });

    it("should update the price range when the price inputs are changed", () => {
        render(<Home />, { wrapper: Router });

        // Find the price inputs by their labels
        const minPriceInput = screen.getByLabelText(/Minimum price/i);
        const maxPriceInput = screen.getByLabelText(/Maximum price/i);

        // Change the values
        fireEvent.change(minPriceInput, { target: { value: "50" } });
        fireEvent.change(maxPriceInput, { target: { value: "150" } });
        fireEvent.blur(maxPriceInput); // Important to trigger the onBlur handler

        // Check that the inputs have the expected values
        expect(minPriceInput.value).toBe("50");
        expect(maxPriceInput.value).toBe("150");
    });

    it("should not allow minimum price to exceed maximum price minus 50", () => {
        render(<Home />, { wrapper: Router });

        const minPriceInput = screen.getByLabelText(/Minimum price:/i);
        const maxPriceInput = screen.getByLabelText(/Maximum price:/i);

        // Set max price first
        fireEvent.change(maxPriceInput, { target: { value: "200" } });
        fireEvent.blur(maxPriceInput);

        // Try to set min price too high
        fireEvent.change(minPriceInput, { target: { value: "180" } });

        // Min price should be limited to max price - 50
        expect(minPriceInput.value).toBe("150");
    });

    it("should not allow maximum price to be less than minimum price plus 50", () => {
        render(<Home />, { wrapper: Router });

        const minPriceInput = screen.getByLabelText(/Minimum price:/i);
        const maxPriceInput = screen.getByLabelText(/Maximum price:/i);

        // Set min price first
        fireEvent.change(minPriceInput, { target: { value: "100" } });

        // Try to set max price too low
        fireEvent.change(maxPriceInput, { target: { value: "120" } });
        fireEvent.blur(maxPriceInput);

        // Max price should be limited to min price + 50
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

    it("should navigate to the next page when the next page button is clicked", async () => {
        fetchHotels.mockResolvedValue({
            informations: {
                hotels: [],
                hotelsFound: 20,
                totalPages: 2,
                error: null,
            },
        });

        render(<Home />, { wrapper: Router });

        await waitFor(() => expect(fetchHotels).toHaveBeenCalled());

        const nextPageButton = screen.getByRole("button", {
            name: /next page/i,
        });
        fireEvent.click(nextPageButton);

        await waitFor(() => expect(fetchHotels).toHaveBeenCalledTimes(2));

        expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    });

    it("should navigate to the previous page when the previous page button is clicked", async () => {
        fetchHotels.mockResolvedValue({
            informations: {
                hotels: [],
                hotelsFound: 20,
                totalPages: 2,
                error: null,
            },
        });

        render(<Home />, { wrapper: Router });

        await waitFor(() => expect(fetchHotels).toHaveBeenCalled());

        const nextPageButton = screen.getByRole("button", { name: /next/i });
        fireEvent.click(nextPageButton);

        await waitFor(() => expect(fetchHotels).toHaveBeenCalledTimes(2));

        const previousPageButton = screen.getByRole("button", {
            name: /previous/i,
        });
        fireEvent.click(previousPageButton);

        await waitFor(() => expect(fetchHotels).toHaveBeenCalledTimes(3));

        expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    });

    it("should update searchCity state and call getHotels with updated city filter", async () => {
        fetchHotels.mockResolvedValue({
            informations: {
                hotels: [],
                hotelsFound: 20,
                totalPages: 2,
                error: null,
            },
        });

        render(<Home />, { wrapper: Router });

        const cityInput = screen.getByPlaceholderText("Search city...");
        fireEvent.change(cityInput, { target: { value: "Paris" } });
        fireEvent.blur(cityInput); // Ajout du blur pour forcer la validation

        await waitFor(() => {
            expect(cityInput.value).toBe("Paris"); // Vérifie que la valeur a bien changé
            expect(fetchHotels).toHaveBeenCalledWith(
                expect.objectContaining({
                    filters: expect.objectContaining({
                        city: "Paris",
                        bedrooms: 1,
                        guests: 1,
                        oneStar: false,
                        twoStars: false,
                        threeStars: false,
                        fourStars: false,
                        fiveStars: false,
                        hotelAmenities: [],
                        minPrice: 0,
                        maxPrice: 2000,
                    }),
                    page: 0,
                    pageSize: 10,
                    filter: "PRICE_LOW_TO_HIGH",
                })
            );
        });
    });
});
