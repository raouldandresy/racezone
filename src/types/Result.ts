export interface Result {
    date: string;     	//The UTC date and time, in ISO 8601 format.
    driver_number: number;     	//The unique number assigned to an F1 driver (cf. Wikipedia).
    meeting_key: number;     	//The unique identifier for the meeting. Use latest to identify the latest or current meeting.
    position: number;     	//Position of the driver (starts at 1).
    session_key: number;     	//The unique identifier for the session. Use latest to identify the latest or current session.
  }
