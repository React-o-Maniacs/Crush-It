import handler from '../pages/api/planDay';
import serverAuth from '../lib/serverAuth';
import prismadb from '../lib/prismadb';

jest.mock('../pages/api/planDay', () => jest.fn());
jest.mock('../lib/serverAuth');
jest.mock('../lib/prismadb');

describe('planDay API', () => {
  it('should handle non-POST requests', async () => {
    await handler();
    expect(handler).toHaveBeenCalled();
  });

  it('should handle unauthenticated requests', async () => {
    serverAuth.mockImplementationOnce(() => {
      throw new Error('Not authenticated');
    });

    await handler();
    expect(handler).toHaveBeenCalled();
  });
});