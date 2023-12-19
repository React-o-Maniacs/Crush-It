import handler from '../pages/api/retrieveFocusTime';
import serverAuth from '../lib/serverAuth';
import prismadb from '../lib/prismadb';

// Define the FocusTime type based on your model
type FocusTime = {
  id: string;
  userId: string;
  title: string;
  startTime: number;
  endTime: number;
  numOfPomodoroTimers: number;
  remainingNumOfPomodoros: number;
  date: string;
};

// Mocking serverAuth
jest.mock('../lib/serverAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mocking prismadb with the correct structure
jest.mock('../lib/prismadb', () => ({
  __esModule: true,
  default: { focusTime: { findMany: jest.fn() } },
}));

describe('retrieveFocusTime API Endpoint', () => {
  const mockReq = { method: 'GET', headers: {}, query: {}, body: {} };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(), // Mock for setHeader
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (prismadb.focusTime.findMany as jest.Mock).mockReset();
  });

  it('should fetch focus time for authenticated user', async () => {
    const req = mockReq as any;
    const res = mockRes as any;

    const mockFocusTime: FocusTime[] = [{
      id: '1',
      userId: 'user1',
      title: 'Focus Session',
      startTime: 10,
      endTime: 12,
      numOfPomodoroTimers: 4,
      remainingNumOfPomodoros: 0,
      date: '12/19/2023'
    }];

    (serverAuth as jest.Mock).mockResolvedValue({ currentUser: { id: 'user1' } });
    (prismadb.focusTime.findMany as jest.Mock).mockResolvedValue(mockFocusTime);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockFocusTime);
  });

  it('should return 401 if not authenticated', async () => {
    const req = mockReq as any;
    const res = mockRes as any;

    (serverAuth as jest.Mock).mockRejectedValue(new Error('Not authenticated'));

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
  });

  it('should handle server errors gracefully', async () => {
    const req = mockReq as any;
    const res = mockRes as any;

    (serverAuth as jest.Mock).mockResolvedValue({ currentUser: { id: 'user1' } });
    (prismadb.focusTime.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching focus time: Database error' });
  });

  it('should return 405 if request method is not GET', async () => {
    const req = { ...mockReq, method: 'POST' } as any;
    const res = mockRes as any;
  
    await handler(req, res);
  
    expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith(`Method ${req.method} Not Allowed`);
  });

  it('should return 500 if there is an error fetching focus time', async () => {
    const req = mockReq as any;
    const res = mockRes as any;
  
    // Simulate an error in fetching focus time
    const errorMessage = 'Database error';
    (serverAuth as jest.Mock).mockResolvedValue({ currentUser: { id: 'user1' } });
    (prismadb.focusTime.findMany as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: `Error fetching focus time: ${errorMessage}` });
  });
});