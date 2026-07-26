export interface Opportunity {
  id: string;
  title: string;
  type: string;
  org: string;
  field: string[];
  degreeLevel: string[];
  minCgpa: number;
  location: string;
  deadlineMonth: string;
  amount: string;
  description: string;
  url: string;
  tags: string[];
}

export interface StudentProfile {
  cgpa: number;
  degreeLevel: string;
  field: string;
  interests: string;
  locationPref: string;
}

export interface MatchResult {
  id: string;
  score: number;
  reasoning: string;
}

export interface MatchResponse {
  matches: MatchResult[];
  letter: {
    opportunityId: string;
    paragraph: string;
  };
}
