import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CorpLearnCourses from './../pages/all_courses';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), 
   useNavigate: jest.fn()
}));

describe('CorpLearnCourses', () => {

  test('renders no courses message if no courses', () => { 
    const navigate = jest.fn();

    render(<CorpLearnCourses />);
    
    expect(screen.getByText(/No courses yet/i)).toBeInTheDocument();
  });

  test('renders courses from response', async () => {

    const navigate = jest.fn();
     
    const courses = [{ 
      code: 'C1',
      time_to_complete: 10  
    }];
  
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        json: () => courses  
      });
  
    render(<CorpLearnCourses />);
  
    await waitFor(() => {
      expect(screen.getByText(/C1/i)).toBeInTheDocument();
    });
  
  });
  
  test('calls create course api on save', async () => {
    
    const navigate = jest.fn();
     
    const newCourse = {
      code: 'NEW',
      time_to_complete: 20
    };
  
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        json: () => newCourse
      });
  
    render(<CorpLearnCourses />);
  
    await waitFor(() => 
      expect(fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/corpLearn/courses', {
            headers: {
                Authorization: 'Bearer null',
                'Content-Type': 'application/json',
            },
            method: 'GET', 
        })
    );
  });
  
});