// Example currentUser structure
export interface User {
    id: number; // Adjust type as per your actual user model
    adminId?: number;
    username: string;
    roles: { name: string }[]; // Adjust as per your actual user model
    // Add other properties as per your actual user model
    created_date: Date;
  }