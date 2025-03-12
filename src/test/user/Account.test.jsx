import {render} from "@testing-library/react";
import {describe, it, vi} from "vitest";
import Account from "../../pages/user/Account";
import {BrowserRouter as Router} from "react-router-dom";

vi.mock("../../hooks/UserHooks", () => ({
    getUserData: vi.fn(),
}));

describe("Account Component", () => {
    it("should render without crashing", () => {
        render(<Account />, { wrapper: Router });
    });

});