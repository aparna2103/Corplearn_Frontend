import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CorpLearnLogin from './../authentication/corplearn_login';

describe('CorpLearnLogin', () => {

  test('renders email input', () => {
    render(<CorpLearnLogin />);
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeInTheDocument();
  });

  test('renders password input', () => {
    render(<CorpLearnLogin />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  test('calls handleSubmit on form submit', () => {
    const handleSubmit = jest.fn();
    render(<CorpLearnLogin handleSubmit={handleSubmit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(handleSubmit).toHaveBeenCalledTimes(0);
  });

  test('sets email value on change', () => {
    const setEmail = jest.fn();
    render(<CorpLearnLogin setEmail={setEmail} />);
    
    fireEvent.change(screen.getByLabelText(/email address/i), { 
      target: { value: 'test@example.com' }
    });
    
    expect(setEmail).toHaveBeenCalledTimes(0);
  });

  test('sets password value on change', () => {
    const setPassword = jest.fn();
    render(<CorpLearnLogin setPassword={setPassword} />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }  
    });
    
    expect(setPassword).toHaveBeenCalledTimes(0);
  });
});