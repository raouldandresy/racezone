export interface IntervalData {
    date: string; // The UTC date and time in ISO 8601 format
    driver_number: number; // The unique number assigned to an F1 driver
    gap_to_leader: number | null; // The time gap to the race leader in seconds, +1 LAP if lapped, or null for the race leader
    interval: number | null; // The time gap to the car ahead in seconds, +1 LAP if lapped, or null for the race leader
    meeting_key: string; // The unique identifier for the meeting
    session_key: string; // The unique identifier for the session
  }
