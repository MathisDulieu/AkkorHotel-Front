import React from "react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react"; // Import render and screen
import Home from "../../pages/common/Home";
import { fetchHotels } from "../../hooks/HotelHooks.js";

// Mock fetchHotels with vi.mock
vi.mock("../../hooks/HotelHooks.js", () => ({
    fetchHotels: vi.fn(),
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


describe("Home Component", () => {
    beforeEach(() => {
        vi.mocked(fetchHotels).mockClear();
    });

    it("renders the component with initial state", () => {
        renderWithContext(<Home />);
        expect(
            screen.getByPlaceholderText("Search city...")
        ).toBeInTheDocument();
        expect(screen.getByText("1 hôtel trouvé")).toBeInTheDocument();
        expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    });

    it("updates search city input", () => {
        render(<Home />);
        const input = screen.getByPlaceholderText("Search city...");
        fireEvent.change(input, { target: { value: "Paris" } });
        expect(input.value).toBe("Paris");
    });

    it("increments and decrements guest count", async () => {
        render(<Home />);
        const decrementButton = screen.getAllByRole("button", { name: /-/ })[0];
        const incrementButton = screen.getAllByRole("button", {
            name: /\+/,
        })[0];
        const guestInput = screen.getByDisplayValue("1");

        await userEvent.click(incrementButton);
        expect(guestInput.value).toBe("2");

        await userEvent.click(decrementButton);
        expect(guestInput.value).toBe("1");
    });

    it("increments and decrements bedroom count", async () => {
        render(<Home />);
        const decrementButton = screen.getAllByRole("button", { name: /-/ })[1];
        const incrementButton = screen.getAllByRole("button", {
            name: /\+/,
        })[1];
        const bedroomInput = screen.getByDisplayValue("1");

        await userEvent.click(incrementButton);
        expect(bedroomInput.value).toBe("2");

        await userEvent.click(decrementButton);
        expect(bedroomInput.value).toBe("1");
    });

    it("toggles star category filters", async () => {
        render(<Home />);
        const oneStarCheckbox = screen.getByLabelText("1 Star");
        await userEvent.click(oneStarCheckbox);
        expect(oneStarCheckbox).toBeChecked();

        await userEvent.click(oneStarCheckbox);
        expect(oneStarCheckbox).not.toBeChecked();
    });

    it("toggles hotel amenity filters", async () => {
        render(<Home />);
        const wifiCheckbox = screen.getByLabelText("WiFi");
        await userEvent.click(wifiCheckbox);
        expect(wifiCheckbox).toBeChecked();

        await userEvent.click(wifiCheckbox);
        expect(wifiCheckbox).not.toBeChecked();
    });

    it("updates min and max price", async () => {
        render(<Home />);
        const minPriceInput = screen.getByLabelText("Minimum price:");
        const maxPriceInput = screen.getByLabelText("Maximum price:");

        await userEvent.type(minPriceInput, "{selectall}{del}100");
        expect(minPriceInput.value).toBe("100");

        await userEvent.type(maxPriceInput, "{selectall}{del}1500");
        await fireEvent.blur(maxPriceInput);
        expect(maxPriceInput.value).toBe("1500");
    });

    it("handles filter removal", async () => {
        render(<Home />);
        fireEvent.change(screen.getByPlaceholderText("Search city..."), {
            target: { value: "Paris" },
        });
        await userEvent.click(screen.getByLabelText("1 Star"));
        await userEvent.click(screen.getByLabelText("WiFi"));
        await userEvent.type(
            screen.getByLabelText("Minimum price:"),
            "{selectall}{del}100"
        );
        await userEvent.type(
            screen.getByLabelText("Maximum price:"),
            "{selectall}{del}1500"
        );
        await fireEvent.blur(screen.getByLabelText("Maximum price:"));

        await userEvent.click(screen.getAllByRole("button", { name: /x/ })[0]); //remove city
        await userEvent.click(screen.getAllByRole("button", { name: /x/ })[0]); //remove star
        await userEvent.click(screen.getAllByRole("button", { name: /x/ })[0]); //remove amenity
        await userEvent.click(screen.getAllByRole("button", { name: /x/ })[0]); //remove price

        expect(screen.getByPlaceholderText("Search city...").value).toBe("");
        expect(screen.getByLabelText("1 Star")).not.toBeChecked();
        expect(screen.getByLabelText("WiFi")).not.toBeChecked();
        expect(screen.getByLabelText("Minimum price:").value).toBe("0");
        expect(screen.getByLabelText("Maximum price:").value).toBe("2000");
    });

    it("fetches hotels and displays them", async () => {
        vi.mocked(fetchHotels).mockResolvedValue({
            informations: {
                hotels: [
                    {
                        hotelId: 1,
                        name: "Test Hotel",
                        description: "Test Description",
                        price: 100,
                        stars: 4,
                        googleMapUrl: "http://test.com",
                        address: "Test Address",
                        firstPicture: "image.jpg",
                    },
                ],
                hotelsFound: 1,
                totalPages: 1,
            },
        });

        render(<Home />);
        await waitFor(() =>
            expect(screen.getByText("Test Hotel")).toBeInTheDocument()
        );
        expect(screen.getByText("1 hôtel trouvé")).toBeInTheDocument();
    });

    it("handles hotels fetch error", async () => {
        vi.mocked(fetchHotels).mockRejectedValue(new Error("Failed to fetch"));
        render(<Home />);
        await waitFor(() =>
            expect(screen.getByText("Failed to fetch")).toBeInTheDocument()
        );
    });

    it("handles hotels fetch warning", async () => {
        vi.mocked(fetchHotels).mockResolvedValue({
            warning: {
                error: "no hotel found",
                totalPages: 1,
            },
        });
        render(<Home />);
        await waitFor(() =>
            expect(screen.getByText("no hotel found")).toBeInTheDocument()
        );
    });

    it("handles hotels fetch error in response", async () => {
        vi.mocked(fetchHotels).mockResolvedValue({
            error: {
                error: "internal error",
            },
        });
        render(<Home />);
        await waitFor(() =>
            expect(screen.getByText("internal error")).toBeInTheDocument()
        );
    });

    it("navigates to the next and previous page", async () => {
        vi.mocked(fetchHotels).mockResolvedValue({
            informations: {
                hotels: [],
                hotelsFound: 0,
                totalPages: 2,
            },
        });

        render(<Home />);
        await waitFor(() =>
            expect(screen.getByText("Page 1 of 2")).toBeInTheDocument()
        );
        await userEvent.click(
            screen.getByRole("button", { name: /svg.*right/i })
        );
        await waitFor(() =>
            expect(screen.getByText("Page 2 of 2")).toBeInTheDocument()
        );
        await userEvent.click(
            screen.getByRole("button", { name: /svg.*left/i })
        );
        await waitFor(() =>
            expect(screen.getByText("Page 1 of 2")).toBeInTheDocument()
        );
    });

    it("refresh button works", async () => {
        vi.mocked(fetchHotels).mockResolvedValue({
            informations: {
                hotels: [
                    {
                        hotelId: 1,
                        name: "Test Hotel",
                        description: "Test Description",
                        price: 100,
                        stars: 4,
                        googleMapUrl: "http://test.com",
                        address: "Test Address",
                        firstPicture: "image.jpg",
                    },
                ],
                hotelsFound: 1,
                totalPages: 1,
            },
        });

        render(<Home />);
        await waitFor(() =>
            expect(screen.getByText("Test Hotel")).toBeInTheDocument()
        );

        await userEvent.click(screen.getByRole("button", { name: /Refresh/i }));
        expect(vi.mocked(fetchHotels)).toHaveBeenCalledTimes(2);
    });

    it("renders hotel cards", async () => {
        vi.mocked(fetchHotels).mockResolvedValue({
            informations: {
                hotels: [
                    {
                        hotelId: 1,
                        name: "Test Hotel",
                        description: "Test Description",
                        price: 100,
                        stars: 4,
                        googleMapUrl: "http://test.com",
                        address: "Test Address",
                        firstPicture: "image.jpg",
                    },
                ],
                hotelsFound: 1,
                totalPages: 1,
            },
        });

        render(<Home />);
        await waitFor(() =>
            expect(screen.getByText("Test Hotel")).toBeInTheDocument()
        );
        expect(
            screen.getByRole("link", { name: /En savoir plus/i })
        ).toBeInTheDocument();
    });

    it('displays "Aucun hôtel trouvé" when no hotels are returned', async () => {
        vi.mocked(fetchHotels).mockResolvedValue({
            informations: {
                hotels: [],
                hotelsFound: 0,
                totalPages: 0,
            },
        });

        render(<Home />);
        await waitFor(() =>
            expect(screen.getByText("Aucun hôtel trouvé")).toBeInTheDocument()
        );
    });
});
