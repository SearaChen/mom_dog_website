// Business details used across the site. Edit them here, in one place.
export const site = {
  name: 'Mama Paws',
  tagline: "Your dog's home away from home",
  description:
    "Family-home dog boarding, daycare and drop-in visits in Milton, Ontario. One family's dogs at a time.",
  ownerName: 'Weiping',
  partnerName: 'Kevin',
  town: 'Milton, Ontario',
  phoneDisplay: '(555) 555-5555', // TODO: real phone number
  phoneLink: '+15555555555', // TODO: same number, digits only
  email: 'hello@example.com', // TODO: real email
  // Time zone the booking calendar is kept in, so days line up for every visitor.
  timeZone: 'America/Toronto',
  // ID of the Google Sheet holding the price table (the long code in the sheet's
  // address, between /d/ and /edit). The sheet must be shared as
  // "Anyone with the link can view". Leave empty to show placeholder prices.
  pricesSheetId: '',
  // Weiping's Rover profile, where the reviews on this site come from.
  roverUrl: 'https://www.rover.com/members/weiping-c-love-and-care-for-your-dog/',
};

// Sections in page order. The header nav is built from this list.
export const nav = [
  { href: '#about', label: 'About us' },
  { href: '#services', label: 'Services' },
  { href: '#prices', label: 'Prices' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#good-to-know', label: 'Good to know' },
];
