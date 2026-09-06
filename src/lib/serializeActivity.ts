export type SerializedActivityMedia = {
  id: number;

  fileUrl: string;

  type: string;

  captionEn: string | null;

  captionKm: string | null;

  sortOrder: number;
};

type ActivityForSerialization = {
  id: number;
  type: string;

  titleEn: string;
  titleKm: string | null;

  summaryEn: string | null;
  summaryKm: string | null;

  descriptionEn: string | null;
  descriptionKm: string | null;

  activityDate: Date;
  endDate: Date | null;

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
  published: boolean;

  media?: Array<{
    id: number;

    fileUrl: string;

    type: string;

    captionEn: string | null;

    captionKm: string | null;

    sortOrder: number;
  }>;

  sortOrder: number;
};

export type SerializedActivity = {
  id: number;
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
  published: boolean;
  media?: SerializedActivityMedia[];

  sortOrder: number;
};

export function serializeActivities(
  activities: ActivityForSerialization[],
): SerializedActivity[] {
  return activities.map((activity) => ({
    id: activity.id,

    type: activity.type,

    titleEn: activity.titleEn,
    titleKm: activity.titleKm,

    summaryEn: activity.summaryEn,
    summaryKm: activity.summaryKm,

    descriptionEn: activity.descriptionEn,
    descriptionKm: activity.descriptionKm,

    activityDate: activity.activityDate.toISOString(),

    endDate: activity.endDate?.toISOString() ?? null,

    datePrecision: activity.datePrecision,

    isCurrent: activity.isCurrent,

    coverImage: activity.coverImage,

    locationEn: activity.locationEn,

    locationKm: activity.locationKm,

    organizationEn: activity.organizationEn,

    organizationKm: activity.organizationKm,

    externalUrl: activity.externalUrl,

    githubUrl: activity.githubUrl,

    demoUrl: activity.demoUrl,

    credentialId: activity.credentialId,

    technologies: activity.technologies,

    featured: activity.featured,

    published: activity.published,

    media:
      activity.media?.map((media) => ({
        id: media.id,

        fileUrl: media.fileUrl,

        type: media.type,

        captionEn: media.captionEn,

        captionKm: media.captionKm,

        sortOrder: media.sortOrder,
      })) ?? [],

    sortOrder: activity.sortOrder,
  }));
}
