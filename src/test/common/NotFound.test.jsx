// Faire le test de redirection vers '/' si l'utilisateur tape une URL qui n'existe pas
import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import NotFound from "../../pages/common/NotFound";
import { BrowserRouter as Router } from "react-router-dom";

vi.mock("../../hooks/UserHooks", () => ({
    getUserData: vi.fn(),
}));

describe("NotFound Component", () => {
    it("should render without crashing", () => {
        render(<NotFound />, { wrapper: Router });
    });
});
