export interface GrandPrixMeeting {
  circuit_key: number;             // The unique identifier for the circuit
  circuit_short_name: string;      // The short or common name of the circuit
  country_code: string;            // The code that uniquely identifies the country
  country_key: number;             // The unique identifier for the country
  country_name: string;            // The full name of the country
  date_end: string;                // The UTC ending date and time in ISO 8601 format
  date_start: string;              // The UTC starting date and time in ISO 8601 format
  gmt_offset: string;              // The difference in hours and minutes from GMT
  location: string;                // The city or geographical location of the event
  meeting_key: number;             // The unique identifier for the meeting
  session_key: number;             // The unique identifier for the session
  session_name: string;            // The name of the session (Practice 1, Qualifying, Race, etc.)
  session_type: string;            // The type of the session (Practice, Qualifying, Race, etc.)
  year: number;                    // The year the event takes place
  }
