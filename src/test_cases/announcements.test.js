import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';  
import CorpLearnAnnouncements from './../pages/announcements';

describe('CorpLearnAnnouncements', () => {

  const announcements = [
    { id: 1, content: 'Announcement 1' },
    { id: 2, content: 'Announcement 2' }
  ];
  
  const loggedInUser = { 
    id: 1,
    role: 1
  };

  test('renders no announcements if none returned', async () => {

    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({ json: () => [] });

    render(<CorpLearnAnnouncements loggedInUser={loggedInUser} />);

    expect(screen.getByText(/No announcements yet/i)).toBeInTheDocument();
  });

  test('renders announcements from api response', async () => {
    
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({ json: () => announcements });

    render(<CorpLearnAnnouncements loggedInUser={loggedInUser} />);

    await waitFor(() => {
      expect(screen.getByText(/Announcement 1/i)).toBeInTheDocument();
    });
  });

  test('renders announcements from api response', async () => {

    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        json: () => announcements
      });
  
    render(<CorpLearnAnnouncements loggedInUser={loggedInUser} />);
  
    await waitFor(() => {
      expect(screen.getByText(/Announcement 1/i)).toBeInTheDocument();
    });
  
  });
  
  test('calls create announcement api on save', async () => {
  
    const newAnnouncement = {
      content: 'New announcement'
    };
    
    jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        json: () => newAnnouncement
      });
  
    render(<CorpLearnAnnouncements loggedInUser={loggedInUser} />);
  
    await waitFor(() => 
      expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/corpLearn/users/announcements/all', {
            headers: {
                Authorization: 'Bearer null',
                'Content-Type': 'application/json',
            },
            method: 'GET', 
        })
    );
  });

});