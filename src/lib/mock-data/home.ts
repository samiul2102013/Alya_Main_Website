import { HomeContent } from '@/types/home';

export const homeContent: HomeContent = {
  hero: {
    eyebrow: 'Supporting stronger families across the UAE',
    title: 'Building Stronger \nFamilies Through \nTrusted Marriage \nSupport',
    subtitle:
      'Alia is the official platform dedicated to guiding, supporting, and enriching marriage through government programs, expert consultation, and community initiatives.',
    ctaPrimaryLabel: 'Explore Initiatives',
    ctaPrimaryHref: '#initiatives',
    ctaSecondaryLabel: 'Find Support',
    ctaSecondaryHref: '#consultation',
    image: {
      src: '/Static/Home/Hero/Emirati couple looking at UAE skyline.png',
      alt: 'Emirati couple looking at UAE skyline',
    },
  },
  stats: [
    {
      id: 'stat-1',
      iconName: 'HeartHandshake',
      stat: '25,000+',
      title: 'Couples Supported',
      subtitle: 'Government processed applications',
    },
    {
      id: 'stat-2',
      iconName: 'Landmark',
      stat: '120+',
      title: 'Government Initiatives',
      subtitle: 'Active marriage support funds',
    },
    {
      id: 'stat-3',
      iconName: 'Users',
      stat: '98%',
      title: 'Satisfaction Rate',
      subtitle: 'Post-consultation feedback',
    },
    {
      id: 'stat-4',
      iconName: 'MapPin',
      stat: '7 Emirates',
      title: 'Nationwide Coverage',
      subtitle: 'Support centers across UAE',
    },
  ],
  marriageShorts: [
    {
      id: 'short-1',
      title: 'Pre-Marital Financial Planning Tips',
      category: 'Financial Guidance',
      duration: '2:45 min',
      date: 'May 12, 2026',
      image: {
        src: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
        alt: 'Financial Planning Reel',
      },
    },
    {
      id: 'short-2',
      title: 'Understanding Emirati Family Law',
      category: 'Legal Advice',
      duration: '3:10 min',
      date: 'June 04, 2026',
      image: {
        src: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=600&auto=format&fit=crop',
        alt: 'Legal Advice Reel',
      },
    },
    {
      id: 'short-3',
      title: 'Keys to a Harmonious First Year',
      category: 'Psychology',
      duration: '4:15 min',
      date: 'June 18, 2026',
      image: {
        src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
        alt: 'Psychology & Harmony Reel',
      },
    },
    {
      id: 'short-4',
      title: 'Housing Grant Application Walkthrough',
      category: 'Government Grant',
      duration: '1:50 min',
      date: 'July 02, 2026',
      image: {
        src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop',
        alt: 'Housing Grant Reel',
      },
    },
  ],
  latestNews: [
    {
      id: 'news-1',
      tag: 'Policy Update',
      date: 'July 20, 2026',
      title: 'UAE Ministry Launches Expanded Housing Subsidy for New Couples',
      excerpt:
        'New legislative amendments increase wedding grant allocations and subsidised housing loans for national couples across all emirates.',
      image: {
        src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
        alt: 'Ministry Housing Subsidy News',
      },
    },
    {
      id: 'news-2',
      tag: 'Initiative',
      date: 'July 15, 2026',
      title: 'Annual Mass Wedding Registration Now Open for Abu Dhabi & Dubai',
      excerpt:
        'Over 500 Emirati couples expected to participate in the joint community wedding celebration held under royal patronage this fall.',
      image: {
        src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
        alt: 'Mass Wedding Registration News',
      },
    },
    {
      id: 'news-3',
      tag: 'Counseling',
      date: 'July 10, 2026',
      title: 'Digital Counseling Portal Achieves 24/7 Assistance Integration',
      excerpt:
        'Couples can now schedule instant, confidential video sessions with certified Emirati family counselors through the Alia digital portal.',
      image: {
        src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
        alt: 'Digital Counseling Portal News',
      },
    },
  ],
  initiatives: [
    {
      id: 'init-1',
      badge: 'Registration Open',
      title: 'Mawaddah National Family Preparedness Program',
      description:
        'A comprehensive 4-week interactive workshop series covering effective communication, emotional intelligence, conflict resolution, and financial budgeting for engaged couples.',
      details: 'Starts Aug 15 • Virtual & In-Person across Abu Dhabi & Dubai',
      ctaLabel: 'Learn More & Register',
      ctaHref: '#register',
      image: {
        src: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?q=80&w=800&auto=format&fit=crop',
        alt: 'Mawaddah Program Workshop',
      },
    },
    {
      id: 'init-2',
      badge: 'Government Supported',
      title: 'Al Thaker Marriage Grant & Housing Relief 2026',
      description:
        'Official government financial relief program providing non-refundable grants up to AED 70,000 alongside subsidized residential land plots for eligible Emirati citizens.',
      details: 'Application Window Open • Eligible Nationwide',
      ctaLabel: 'Check Grant Eligibility',
      ctaHref: '#eligibility',
      image: {
        src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
        alt: 'Al Thaker Grant Relief',
      },
    },
  ],
  consultations: [
    {
      id: 'cons-1',
      title: 'Effective Communication in Early Marriage',
      name: 'Dr. Fatima Al Mansouri',
      date: 'October 15, 2026',
      time: '10:00 AM - 11:30 AM',
      seats: '15 Seats Free',
      image: {
        src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
        alt: 'Dr. Fatima Al Mansouri',
      },
      ctaLabel: 'Book Now',
      ctaHref: '/consultation/details',
    },
    {
      id: 'cons-2',
      title: 'Financial Planning for Newlyweds',
      name: 'Ahmed Al Hashimi',
      date: 'October 22, 2026',
      time: '2:00 PM - 3:30 PM',
      seats: '12 Seats Free',
      image: {
        src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop',
        alt: 'Ahmed Al Hashimi',
      },
      ctaLabel: 'Book Now',
      ctaHref: '/consultation/details',
    },
  ],
  emirates: [
    {
      id: 'em-1',
      name: 'Abu Dhabi',
      title: 'Abu Dhabi Family Development Foundation Hub',
      centerCount: '12 Support Centers • 3 Event Halls',
      isFeatured: true,
      image: {
        src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop',
        alt: 'Abu Dhabi Support Center',
      },
    },
    {
      id: 'em-2',
      name: 'Dubai',
      title: 'Dubai Community Development Council',
      centerCount: '8 Specialized Centers',
      isFeatured: false,
      image: {
        src: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=600&auto=format&fit=crop',
        alt: 'Dubai Support Center',
      },
    },
    {
      id: 'em-3',
      name: 'Sharjah',
      title: 'Sharjah Family Affairs Supreme Council',
      centerCount: '6 Heritage Centers',
      isFeatured: false,
      image: {
        src: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=80&w=600&auto=format&fit=crop',
        alt: 'Sharjah Support Center',
      },
    },
    {
      id: 'em-4',
      name: 'Ajman',
      title: 'Ajman Family Support and Marriage Guidance Center',
      centerCount: '5 Community Outposts',
      isFeatured: false,
      image: {
        src: 'https://images.unsplash.com/photo-1465414829459-d228b58caf6e?q=80&w=600&auto=format&fit=crop',
        alt: 'Ajman Support Center',
      },
    },
    {
      id: 'em-5',
      name: 'Umm Al Quwain',
      title: 'Umm Al Quwain Family Services Coordination Hub',
      centerCount: '3 Local Support Offices',
      isFeatured: false,
      image: {
        src: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?q=80&w=600&auto=format&fit=crop',
        alt: 'Umm Al Quwain Support Center',
      },
    },
    {
      id: 'em-6',
      name: 'Ras Al Khaimah',
      title: 'Ras Al Khaimah Family Wellbeing Council',
      centerCount: '4 Regional Offices',
      isFeatured: false,
      image: {
        src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
        alt: 'Ras Al Khaimah Support Center',
      },
    },
    {
      id: 'em-7',
      name: 'Fujairah',
      title: 'Fujairah Community Marriage Support Center',
      centerCount: '4 Coastal Support Units',
      isFeatured: false,
      image: {
        src: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop',
        alt: 'Fujairah Support Center',
      },
    },
  ],
  cta: {
    title: 'Start Your Journey Toward a Stronger Family',
    subtitle:
      'Join thousands of Emirati couples building lasting, happy futures with official government guidance, financial grants, and lifelong support.',
    ctaLabel: 'Get Started Now',
    ctaHref: '#contact',
  },
};
