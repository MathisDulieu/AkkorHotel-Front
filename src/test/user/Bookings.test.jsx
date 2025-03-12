import {render} from "@testing-library/react";
import {describe, it, vi} from "vitest";
import Bookings from "../../pages/user/Bookings";
import {BrowserRouter as Router} from "react-router-dom";

vi.mock("../../hooks/UserHooks", () => ({
    getUserData: vi.fn(),
}));

describe("Bookings Component", () => {
    it("should render without crashing", () => {
        render(<Bookings />, { wrapper: Router });
    });

});