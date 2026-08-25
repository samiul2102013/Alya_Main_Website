const u = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

/**
 * Curated, relevant image pools so that each section and card uses distinct,
 * thematically-appropriate imagery instead of a single repeated fallback.
 */

// Consultation hero — a warm, professional counseling session.
export const CONSULTATION_HERO_IMAGE = u('photo-1551836022-d5d88e9218df', 900);

// Consultation session cards — counseling, guidance and consulting scenes.
export const CONSULTATION_IMAGES = [
  u('photo-1573497019940-1c28c88b4f3e', 800),
  u('photo-1516574187841-cb9cc2ca948b', 800),
  u('photo-1521791136064-7986c2920216', 800),
  u('photo-1556155092-490a1ba16284', 800),
  u('photo-1544717297-fa95b6ee9643', 800),
  u('photo-1543269865-cbf427effbad', 800),
  u('photo-1559027615-cd4628902d4a', 800),
  u('photo-1556761175-b413da4baf72', 800),
];

// News + shorts articles/videos — family, community and couple imagery.
export const NEWS_IMAGES = [
  u('photo-1573497019940-1c28c88b4f3e', 800),
  u('photo-1511795409834-ef04bbd61622', 800),
  u('photo-1512917774080-9991f1c4c750', 800),
  u('photo-1486406146926-c627a92ad1ab', 800),
  u('photo-1559027615-cd4628902d4a', 800),
  u('photo-1522881451255-f59ad836fdfb', 800),
  u('photo-1531497865144-0464ef8fb9a9', 800),
  u('photo-1489515217757-5fd1be406fef', 800),
];

// Short-video cards (library + featured).
export const SHORT_IMAGES = [
  u('photo-1511285560929-80b456fea0bc', 600),
  u('photo-1516589178581-6cd7833ae3b2', 600),
  u('photo-1529636798458-92182e662485', 600),
  u('photo-1573496359142-b8d87734a5a2', 600),
  u('photo-1529156069898-49953e39b3ac', 600),
  u('photo-1522071820081-009f0129c71c', 600),
];

// Shorts hero — calm, modern family / togetherness.
export const SHORTS_HERO_IMAGE = u('photo-1529156069898-49953e39b3ac', 900);

// Emirates — relevant, place-based imagery (ordered: Abu Dhabi, Dubai, Sharjah,
// Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah).
export const EMIRATES_IMAGES = [
  u('photo-1512453979798-5ea266f8880c', 900),
  u('photo-1518684079-3c830dcef090', 900),
  u('photo-1584551246679-0daf3d275d0f', 900),
  u('photo-1465414829459-d228b58caf6e', 900),
  u('photo-1528702748617-c64d49f918af', 900),
  u('photo-1571896349842-33c89424de2d', 900),
  u('photo-1587474260584-136574528ed5', 900),
];

// Emirates hero — a broad, recognizable UAE skyline.
export const EMIRATES_HERO_IMAGE = u('photo-1512453979798-5ea266f8880c', 1200);

// News hero — editorial / community journalism relevant to families.
export const NEWS_HERO_IMAGE = u('photo-1495020689067-958852a7765e', 1200);
