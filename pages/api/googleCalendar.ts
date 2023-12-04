import { google } from 'googleapis';
import { AppointmentData } from '../../components/Appointment';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

oauth2Client.setCredentials({
    refresh_token: '1//04qVQMJn7Hm2CCgYIARAAGAQSNwF-L9IrV9iI-veovvHLG7oCyFOC5nCAokMIda8SDkASn2JtKrk9eK0iG5tug3PsyXSnm5ggNMc'
  });
  
  oauth2Client.refreshAccessToken((err, tokens) => {
    if (err) {
      console.error('Failed to refresh access token', err);
      return;
    }
  
    if (tokens) {
      oauth2Client.setCredentials(tokens);  // tokens includes a new access token
    } else {
      console.error('No tokens received');
    }  // tokens includes a new access token
  });
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

calendar.events.list({
  calendarId: 'primary',
  timeMin: (new Date()).toISOString(),
  maxResults: 10,
  singleEvents: true,
  orderBy: 'startTime',
}, (err, res) => {
  if (err) return console.log('The API returned an error: ' + err);
  const events = res.data.items.map((event): AppointmentData => ({
    id: event.id,
    title: event.summary,
    startTime: new Date(event.start.dateTime || event.start.date).getHours(),
    endTime: new Date(event.end.dateTime || event.end.date).getHours(),
  }));
});