import { AppointmentData } from '../../components/Appointment';

// pages/api/calendar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const credentials = {
  client_id: process.env.GOOGLE_CLIENT_ID || '',
  client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirect_uris: [process.env.GOOGLE_REDIRECT_URI || ''],
};

const oAuth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  credentials.redirect_uris[0]
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
  
  oAuth2Client.refreshAccessToken((err, tokens) => {
    if (err) {
      console.error('Failed to refresh access token', err);
      return;
    }
  
    if (tokens) {
      oAuth2Client.setCredentials(tokens);  // tokens includes a new access token
    } else {
      console.error('No tokens received');
    }  // tokens includes a new access token
  });

  try {


    // Example: Fetch calendar events
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const eventsResponse = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = eventsResponse.data.items || [];
    res.status(200).json(events);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
