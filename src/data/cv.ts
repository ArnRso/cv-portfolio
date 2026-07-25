import data from './cv.json';

export interface CvBasics {
  name: string;
  label: string;
  tagline: string;
  email: string;
  url: string;
  summary: string;
  location: {
    city: string;
    region: string;
    postalCode: string;
    countryCode: string;
  };
  profiles: { network: string; username: string; url: string }[];
}

export interface CvSkillGroup {
  domain: string;
  keywords: string[];
}

export interface CvJob {
  position: string;
  company: string;
  url?: string;
  location: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  highlights: string[];
}

export interface CvTeaching {
  institution: string;
  role: string;
  period: string;
  detail: string;
}

export interface CvProject {
  name: string;
  url: string;
  description: string;
}

export interface CvEducation {
  area: string;
  institution: string;
  period: string;
}

export interface CvLanguage {
  language: string;
  fluency: string;
}

export interface Cv {
  basics: CvBasics;
  skills: CvSkillGroup[];
  work: CvJob[];
  teaching: CvTeaching[];
  projects: CvProject[];
  projectsNote: string;
  education: CvEducation[];
  languages: CvLanguage[];
}

export const cv: Cv = data;
