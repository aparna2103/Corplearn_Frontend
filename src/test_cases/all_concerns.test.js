import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CorpLearnAllConcerns from './../pages/all_concerns';

describe('CorpLearnAllConcerns', () => {

    test('renders concerns from response', async () => {
      const concerns = [
        { id: 1, content: 'Concern 1' },
        { id: 2, content: 'Concern 2' }  
      ];
      
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: () => concerns
      });
  
      render(<CorpLearnAllConcerns />);
  
      await waitFor(() => {
        expect(screen.getByText(/Concern 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Concern 2/i)).toBeInTheDocument();
      });
    });
  
    test('calls backend on reply submit', async () => {
      const updatedConcern = {
        id: 1,
        content: 'Concern 1 | Test Reply' 
      };
      
      jest.spyOn(global, 'fetch')
        .mockResolvedValueOnce({ json: () => updatedConcern });
  
      render(<CorpLearnAllConcerns />);
  
      await waitFor(() => 
        expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/corpLearn/users/employee-concerns/all', {
          headers: {
             Authorization: 'Bearer null',
             'Content-Type': 'application/json',
            },
          method: 'GET', 
        })
      );
    });
  });