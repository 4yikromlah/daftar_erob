export type DivisionType = 'Aeromodeling' | 'Robotics';

export type SubDivisionType =
  // Aeromodeling sub-divisions
  | 'RC Plane (Radio Control)'
  | 'Drone Racing'
  | 'Glider F1A'
  | 'Water Rocket (Roket Air)'
  // Robotics sub-divisions
  | 'Line Follower Robot'
  | 'Battlebot Robot'
  | 'Autonomous Drone Programming'
  | 'Creative IoT Robot';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface RegistrationData {
  id: string;
  nisn: string;
  fullName: string;
  parentName: string;
  kelas: string;
  tempatLahir: string;
  tanggalLahir: string;
  hobi: string;
  citaCita: string;
  email: string;
  whatsapp: string;
  institution: string;
  division: DivisionType;
  subDivision: SubDivisionType;
  experienceLevel: ExperienceLevel;
  motivation: string;
  registrationDate: string;
}

export interface DivisionDetails {
  id: DivisionType;
  title: string;
  description: string;
  icon: string;
  subDivisions: SubDivisionType[];
  color: string;
  glowColor: string;
}

export interface KopConfig {
  orgLogo: string;
  schoolLogo: string;
  kopLine1: string;
  kopLine2: string;
  kopLine3: string;
  kopLine4: string;
}

