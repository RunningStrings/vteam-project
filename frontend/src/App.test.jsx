import { render, screen } from "@testing-library/react";
import App from "./App";

function test("renders hello message", () => {
    render(<App />);
    const heading = screen.getByText(/Hem/i);
    const expect(heading).toBeInTheDocument();
});