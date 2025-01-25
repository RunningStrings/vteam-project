import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Importera MemoryRouter
import { describe, test, expect } from "vitest";
import Navbar from "./Navbar";

describe("Navbar", () => {
    test("renders the Navbar correctly", () => {
    // Wrappar komponenten med MemoryRouter
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        // Kontrollera att sidan renderas korrekt
        expect(screen.getByText(/Hem/i)).toBeInTheDocument();
    });
});