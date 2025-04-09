export interface Driver {
    broadcast_name: string;      // The driver's name, as displayed on TV
    country_code: string;        // Country code (e.g., 'GB' for Great Britain)
    driver_number: number;       // Unique number assigned to the F1 driver
    first_name: string;          // Driver's first name
    full_name: string;           // Driver's full name
    headshot_url: string;        // URL of the driver's face photo
    last_name: string;           // Driver's last name
    meeting_key: number;         // Unique identifier for the meeting (e.g., 'latest')
    name_acronym: string;        // Three-letter acronym of the driver's name
    session_key: number;         // Unique identifier for the session (e.g., 'latest')
    team_colour: string;         // Hexadecimal color value of the driver's team
    team_name: string;           // Name of the driver's team
  }
