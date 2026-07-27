// Mirrors the ASP.NET Core backend's InvitationDetailDto / UpdateInvitationRequest
// (backend/Numinds.Api/Models/Dtos) field-for-field.

export interface VenueItem {
  name: string;
  address?: string;
  mapUrl?: string;
}

export interface ProgramItem {
  time?: string;
  title: string;
}

export interface ContactItem {
  name: string;
  role?: string;
  phone: string;
}

export interface InvitationDetail {
  id: string;
  status: string;
  editUrl: string;
  templateId?: string | null;
  createdAt: string;
  updatedAt: string;

  language?: string | null;

  occasionType?: string | null;
  isCoupleEvent: boolean;

  eventTitle?: string | null;
  eventTitleFont?: string | null;
  invitationType: "individual" | "couple";
  firstName?: string | null;
  secondName?: string | null;
  namesFont?: string | null;
  useNameImage: boolean;
  eventDateTime?: string | null;
  timezone?: string | null;
  useHijriDate: boolean;
  thankYouText?: string | null;
  thankYouTextColor?: string | null;

  hideFamilyNames: boolean;
  familyName1?: string | null;
  familyName2?: string | null;
  familyNamesFont?: string | null;
  invitationText?: string | null;

  venues: VenueItem[];

  showEventProgram: boolean;
  programItems: ProgramItem[];

  showEventRules: boolean;
  eventRulesText?: string | null;

  showAccommodation: boolean;
  accommodations: VenueItem[];

  galleryImages: string[];

  showPersonalMessage: boolean;
  personalMessageTitle?: string | null;
  personalMessageText?: string | null;
  personalMessageSignature?: string | null;

  contacts: ContactItem[];

  musicUrl?: string | null;
  musicTitle?: string | null;

  enableGifts: boolean;
  giftIban?: string | null;

  hideCameraButton: boolean;
  hideSaveButton: boolean;
  hideCapturedGallery: boolean;

  enableQrEntry: boolean;

  enableRsvp: boolean;
  rsvpShowAttendance: boolean;
  rsvpShowGuestCount: boolean;
  rsvpShowMessage: boolean;
  rsvpShowLiveCount: boolean;
  guestLimit?: number | null;

  generalTextFont?: string | null;
  envelopeNameFont?: string | null;
}

// Every field optional — a step only ever sends the slice it owns.
export type UpdateInvitationPatch = Partial<
  Omit<InvitationDetail, "id" | "status" | "editUrl" | "createdAt" | "updatedAt">
> & { status?: string };
