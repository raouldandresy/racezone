export interface TeamRadioData {
    date: string; // UTC date and time in ISO 8601 format
    driver_number: number; // Unique number assigned to an F1 driver
    meeting_key: string; // Unique identifier for the meeting (e.g., "latest" for the current meeting)
    recording_url: string; // URL of the radio recording
    session_key: string; // Unique identifier for the session (e.g., "latest" for the current session)
  }
