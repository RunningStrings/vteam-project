import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import User from './User';

describe('LoginForm', () => {
  test('submits the form with email and password', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();

    render(<LoginForm onSubmit={mockSubmit} />);

    // Hitta input-fälten och knappen
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Simulera att användaren fyller i formuläret
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Klicka på knappen för att skicka formuläret
    await user.click(submitButton);

    // Kontrollera att mockSubmit har kallats med rätt värden
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    // Kontrollera att mockSubmit bara kallades en gång
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });
});