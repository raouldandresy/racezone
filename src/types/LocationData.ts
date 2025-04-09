export interface LocationData {
    date: string; // UTC date and time in ISO 8601 format
    driver_number: number; // The unique number assigned to an F1 driver
    meeting_key: string; // The unique identifier for the meeting (use "latest" for the latest meeting)
    session_key: string; // The unique identifier for the session (use "latest" for the latest session)
    x: number; // The 'x' value in a 3D Cartesian coordinate system
    y: number; // The 'y' value in a 3D Cartesian coordinate system
    z: number; // The 'z' value in a 3D Cartesian coordinate system
  }
