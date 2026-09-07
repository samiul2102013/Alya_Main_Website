export interface ContactContent {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  browseSession: string;
  browseSessionAr: string;
  contactSupport: string;
  contactSupportAr: string;

  sendMessage: string;
  sendMessageAr: string;
  sendMessageSub: string;
  sendMessageSubAr: string;
  fullName: string;
  fullNameAr: string;
  fullNamePlaceholder: string;
  fullNamePlaceholderAr: string;
  emailLabel: string;
  emailLabelAr: string;
  emailPlaceholder: string;
  emailPlaceholderAr: string;
  userType: string;
  userTypeAr: string;
  selectUserType: string;
  selectUserTypeAr: string;
  individual: string;
  individualAr: string;
  couple: string;
  coupleAr: string;
  organization: string;
  organizationAr: string;
  subjectLabel: string;
  subjectLabelAr: string;
  subjectPlaceholder: string;
  subjectPlaceholderAr: string;
  phoneLabel: string;
  phoneLabelAr: string;
  phonePlaceholder: string;
  phonePlaceholderAr: string;
  messageLabel: string;
  messageLabelAr: string;
  messagePlaceholder: string;
  messagePlaceholderAr: string;
  sendButton: string;
  sendButtonAr: string;
  successMessage: string;
  successMessageAr: string;
  sending: string;
  sendingAr: string;
  contactInfo: string;
  contactInfoAr: string;
  officeAddress: string;
  officeAddressAr: string;
  workingHours: string;
  workingHoursAr: string;
  generalInquiries: string;
  generalInquiriesAr: string;
  supportHeading: string;
  supportHeadingAr: string;
  addressLines: string[];
  addressLinesAr: string[];
  hoursLines: string[];
  hoursLinesAr: string[];
  inquiriesLines: string[];
  inquiriesLinesAr: string[];
  supportLines: string[];
  supportLinesAr: string[];
  ourLocation: string;
  ourLocationAr: string;
  ourLocationText: string;
  ourLocationTextAr: string;
  mapTitle: string;
  mapTitleAr: string;
  mapEmbedUrl: string;
  latitude: string;
  longitude: string;

  sectionVisibility?: Record<string, boolean>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function getContactContent(): Promise<ContactContent | null> {
  try {
    const res = await fetch(`${API_URL}/contact`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as ContactContent;
  } catch (e) {
    console.warn('[contact] Failed to load contact content:', e);
    return null;
  }
}
