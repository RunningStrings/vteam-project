import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Importera MemoryRouter
import { describe, test, expect } from "vitest";
import Home from "./Home";

describe("Home Page", () => {
    test("renders the Home page correctly", () => {
    // Wrappar komponenten med MemoryRouter
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        // Kontrollera att sidan renderas korrekt
        expect(screen.getByText(/Svenska Elsparkcyklar AB/i)).toBeInTheDocument();
    });
});
