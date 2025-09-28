export interface JobApplication {
  id?: string;
  position: string;
  company: string;
  dateApplied: string;
  salary?: string;
  location?: string;  
  keySkills: string[];
  dailyResponsibilities: string[];
  companyDescription: string;
  rawText: string;
  status: string;
}