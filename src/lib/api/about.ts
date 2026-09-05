export interface AboutOffering {
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
}

export interface AboutImpact {
  label: string;
  labelAr: string;
  value: string;
  valueAr: string;
}

export interface AboutContent {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  browseSession: string;
  browseSessionAr: string;
  contactSupport: string;
  contactSupportAr: string;
  heroImage: string;
  heroImageAlt: string;

  ourStory: string;
  ourStoryAr: string;
  ourStoryText: string;
  ourStoryTextAr: string;

  ourMission: string;
  ourMissionAr: string;
  ourMissionText: string;
  ourMissionTextAr: string;

  ourVision: string;
  ourVisionAr: string;
  ourVisionText: string;
  ourVisionTextAr: string;

  ourObjective: string;
  ourObjectiveAr: string;
  ourObjectiveText: string;
  ourObjectiveTextAr: string;
  objectives: string[];

  whatWeOffer: string;
  whatWeOfferAr: string;
  whatWeOfferText: string;
  whatWeOfferTextAr: string;
  offerings: AboutOffering[];

  ourImpact: string;
  ourImpactAr: string;
  ourImpactText: string;
  ourImpactTextAr: string;
  impact: AboutImpact[];

  whyChoose: string;
  whyChooseAr: string;
  whyChooseText: string;
  whyChooseTextAr: string;
  whyValues: string[];

  coreValues: string;
  coreValuesAr: string;
  coreValuesText: string;
  coreValuesTextAr: string;
  coreValueList: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const res = await fetch(`${API_URL}/about`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as AboutContent;
  } catch (e) {
    console.warn('[about] Failed to load about content:', e);
    return null;
  }
}
