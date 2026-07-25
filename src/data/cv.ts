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

export interface CvFact {
  value: string;
  label: string;
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
  stack: string[];
}

export interface CvTeaching {
  institution: string;
  role: string;
  period: string;
  detail: string;
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
  facts: CvFact[];
  skills: CvSkillGroup[];
  work: CvJob[];
  teaching: CvTeaching[];
  education: CvEducation[];
  languages: CvLanguage[];
}

export const cv: Cv = data;
