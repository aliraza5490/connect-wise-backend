import axios, { AxiosInstance } from 'axios';

class wherebyAPI {
  client: AxiosInstance;

  constructor() {
    const client = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WHEREBY_API_KEY}`,
      },
    });

    this.client = client;
  }

  createMeeting() {
    return this.client.post('https://api.whereby.dev/v1/meetings', {
      endDate: new Date(new Date().getTime() + 3600000).toISOString(), // 1 hour from now
      recording: {
        type: 'local',
        destination: null,
        startTrigger: null,
      },
    });
  }
}

export default new wherebyAPI();
