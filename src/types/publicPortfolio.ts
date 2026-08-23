export type PublicProfile = {
  fullName: string;

  headlineEn: string | null;
  headlineKm: string | null;

  shortBioEn: string | null;
  shortBioKm: string | null;

  bioEn: string | null;
  bioKm: string | null;

  currentRoleEn: string | null;
  currentRoleKm: string | null;

  currentFocusEn: string | null;
  currentFocusKm: string | null;

  yearsExperience: number;

  email: string | null;
  phone: string | null;
  telegram: string | null;

  github: string | null;

  /*
   * GitHub contribution screenshot
   */
  githubUsername: string | null;
  githubContributionImage: string | null;

  linkedin: string | null;

  facebook: string | null;
  instagram: string | null;
  youtube: string | null;

  locationEn: string | null;
  locationKm: string | null;

  profileImage: string | null;
  badgeImage: string | null;
  cvFile: string | null;

  showTeachingSection: boolean;
};

export type PublicActivity = {
  id: number;

  slug: string;

  type: string;

  titleEn: string;
  titleKm: string | null;

  summaryEn: string | null;
  summaryKm: string | null;

  descriptionEn: string | null;
  descriptionKm: string | null;

  activityDate: string;
  endDate: string | null;

  datePrecision: string;

  isCurrent: boolean;

  coverImage: string | null;

  locationEn: string | null;
  locationKm: string | null;

  organizationEn: string | null;
  organizationKm: string | null;

  externalUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;

  credentialId: string | null;

  technologies: string | null;

  featured: boolean;

  likeCount: number;
  commentCount: number;

  comments: Array<{
    id: number;
    name: string;
    message: string;
    createdAt: string;
  }>;
};

export type PublicSkill = {
  id: number;

  name: string;

  categoryEn: string | null;
  categoryKm: string | null;

  level: string;

  icon: string | null;

  /*
   * NEW
   *
   * true = large Core Skill card
   * false = Additional Expertise
   */
  isCore: boolean;
};

export type PublicTool = {
  id: number;

  name: string;

  category: string;

  icon: string | null;

  url: string | null;
};
