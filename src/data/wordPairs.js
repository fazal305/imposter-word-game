// Curated word-pair database. Every pair is deliberately related so that
// both the Agent word and the Imposter word support overlapping, plausible
// clues — an Imposter should be able to bluff, and Agents should have to
// listen carefully rather than spot an instant giveaway.
//
// difficulty roughly reflects how close the two words are conceptually:
//   easy   — clearly related, generous overlap in clues
//   medium — related but distinct enough that careless clues expose people
//   hard   — subtle relationship, easy to accidentally give the Imposter away

export const CATEGORIES = [
  {
    id: 'food',
    label: 'Food',
    pairs: [
      { words: ['Apple', 'Pear'], difficulty: 'easy' },
      { words: ['Coffee', 'Tea'], difficulty: 'easy' },
      { words: ['Pizza', 'Burger'], difficulty: 'easy' },
      { words: ['Pancake', 'Waffle'], difficulty: 'easy' },
      { words: ['Butter', 'Margarine'], difficulty: 'medium' },
      { words: ['Taco', 'Burrito'], difficulty: 'medium' },
      { words: ['Cake', 'Pie'], difficulty: 'medium' },
      { words: ['Soup', 'Stew'], difficulty: 'hard' },
      { words: ['Ketchup', 'Mustard'], difficulty: 'medium' },
      { words: ['Noodles', 'Rice'], difficulty: 'medium' },
      { words: ['Chocolate', 'Caramel'], difficulty: 'medium' },
      { words: ['Lemonade', 'Iced Tea'], difficulty: 'hard' },
    ],
  },
  {
    id: 'animals',
    label: 'Animals',
    pairs: [
      { words: ['Cat', 'Dog'], difficulty: 'easy' },
      { words: ['Lion', 'Tiger'], difficulty: 'easy' },
      { words: ['Horse', 'Donkey'], difficulty: 'medium' },
      { words: ['Frog', 'Toad'], difficulty: 'hard' },
      { words: ['Eagle', 'Hawk'], difficulty: 'hard' },
      { words: ['Wolf', 'Fox'], difficulty: 'medium' },
      { words: ['Dolphin', 'Shark'], difficulty: 'medium' },
      { words: ['Rabbit', 'Hare'], difficulty: 'hard' },
      { words: ['Crocodile', 'Alligator'], difficulty: 'hard' },
      { words: ['Butterfly', 'Moth'], difficulty: 'hard' },
      { words: ['Penguin', 'Puffin'], difficulty: 'hard' },
      { words: ['Camel', 'Llama'], difficulty: 'medium' },
    ],
  },
  {
    id: 'technology',
    label: 'Technology',
    pairs: [
      { words: ['Laptop', 'Tablet'], difficulty: 'easy' },
      { words: ['Phone', 'Smartwatch'], difficulty: 'medium' },
      { words: ['Keyboard', 'Mouse'], difficulty: 'medium' },
      { words: ['WiFi', 'Bluetooth'], difficulty: 'medium' },
      { words: ['Instagram', 'TikTok'], difficulty: 'easy' },
      { words: ['Email', 'Text Message'], difficulty: 'medium' },
      { words: ['Printer', 'Scanner'], difficulty: 'hard' },
      { words: ['Charger', 'Power Bank'], difficulty: 'hard' },
      { words: ['Headphones', 'Earbuds'], difficulty: 'hard' },
      { words: ['Router', 'Modem'], difficulty: 'hard' },
    ],
  },
  {
    id: 'transportation',
    label: 'Transportation',
    pairs: [
      { words: ['Airplane', 'Train'], difficulty: 'easy' },
      { words: ['Car', 'Motorcycle'], difficulty: 'easy' },
      { words: ['Bicycle', 'Scooter'], difficulty: 'medium' },
      { words: ['Bus', 'Van'], difficulty: 'medium' },
      { words: ['Ship', 'Ferry'], difficulty: 'hard' },
      { words: ['Subway', 'Tram'], difficulty: 'hard' },
      { words: ['Taxi', 'Rideshare'], difficulty: 'medium' },
      { words: ['Helicopter', 'Drone'], difficulty: 'medium' },
    ],
  },
  {
    id: 'places',
    label: 'Places',
    pairs: [
      { words: ['Beach', 'Lake'], difficulty: 'medium' },
      { words: ['Mountain', 'Hill'], difficulty: 'hard' },
      { words: ['Library', 'Bookstore'], difficulty: 'medium' },
      { words: ['Museum', 'Gallery'], difficulty: 'hard' },
      { words: ['Airport', 'Train Station'], difficulty: 'medium' },
      { words: ['Park', 'Garden'], difficulty: 'hard' },
      { words: ['Mall', 'Market'], difficulty: 'medium' },
      { words: ['Stadium', 'Arena'], difficulty: 'hard' },
      { words: ['Desert', 'Savanna'], difficulty: 'hard' },
      { words: ['Castle', 'Palace'], difficulty: 'hard' },
    ],
  },
  {
    id: 'professions',
    label: 'Professions',
    pairs: [
      { words: ['Doctor', 'Nurse'], difficulty: 'easy' },
      { words: ['Teacher', 'Professor'], difficulty: 'medium' },
      { words: ['Police Officer', 'Security Guard'], difficulty: 'medium' },
      { words: ['Chef', 'Baker'], difficulty: 'medium' },
      { words: ['Pilot', 'Flight Attendant'], difficulty: 'medium' },
      { words: ['Lawyer', 'Judge'], difficulty: 'medium' },
      { words: ['Firefighter', 'Paramedic'], difficulty: 'hard' },
      { words: ['Architect', 'Engineer'], difficulty: 'hard' },
    ],
  },
  {
    id: 'sports',
    label: 'Sports',
    pairs: [
      { words: ['Football', 'Basketball'], difficulty: 'easy' },
      { words: ['Tennis', 'Badminton'], difficulty: 'medium' },
      { words: ['Swimming', 'Diving'], difficulty: 'hard' },
      { words: ['Cricket', 'Baseball'], difficulty: 'medium' },
      { words: ['Boxing', 'Wrestling'], difficulty: 'medium' },
      { words: ['Golf', 'Mini Golf'], difficulty: 'hard' },
      { words: ['Skiing', 'Snowboarding'], difficulty: 'hard' },
      { words: ['Volleyball', 'Handball'], difficulty: 'hard' },
    ],
  },
  {
    id: 'nature',
    label: 'Nature',
    pairs: [
      { words: ['Rain', 'Snow'], difficulty: 'medium' },
      { words: ['River', 'Stream'], difficulty: 'hard' },
      { words: ['Forest', 'Jungle'], difficulty: 'medium' },
      { words: ['Volcano', 'Earthquake'], difficulty: 'hard' },
      { words: ['Sun', 'Moon'], difficulty: 'easy' },
      { words: ['Storm', 'Hurricane'], difficulty: 'medium' },
      { words: ['Flower', 'Weed'], difficulty: 'hard' },
      { words: ['Ocean', 'Sea'], difficulty: 'hard' },
    ],
  },
  {
    id: 'everyday-objects',
    label: 'Everyday Objects',
    pairs: [
      { words: ['Umbrella', 'Raincoat'], difficulty: 'medium' },
      { words: ['Pillow', 'Blanket'], difficulty: 'medium' },
      { words: ['Wallet', 'Purse'], difficulty: 'medium' },
      { words: ['Candle', 'Lamp'], difficulty: 'hard' },
      { words: ['Mirror', 'Window'], difficulty: 'hard' },
      { words: ['Broom', 'Vacuum'], difficulty: 'medium' },
      { words: ['Scissors', 'Knife'], difficulty: 'medium' },
      { words: ['Backpack', 'Suitcase'], difficulty: 'medium' },
    ],
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    pairs: [
      { words: ['Movie', 'TV Show'], difficulty: 'easy' },
      { words: ['Concert', 'Festival'], difficulty: 'medium' },
      { words: ['Video Game', 'Board Game'], difficulty: 'medium' },
      { words: ['Comedy', 'Drama'], difficulty: 'hard' },
      { words: ['Magician', 'Clown'], difficulty: 'medium' },
      { words: ['Circus', 'Carnival'], difficulty: 'hard' },
      { words: ['Podcast', 'Radio Show'], difficulty: 'hard' },
      { words: ['Karaoke', 'Talent Show'], difficulty: 'hard' },
    ],
  },
  {
    id: 'school',
    label: 'School',
    pairs: [
      { words: ['Pen', 'Pencil'], difficulty: 'easy' },
      { words: ['Notebook', 'Textbook'], difficulty: 'medium' },
      { words: ['Homework', 'Exam'], difficulty: 'medium' },
      { words: ['Classroom', 'Library'], difficulty: 'hard' },
      { words: ['Backpack', 'Locker'], difficulty: 'hard' },
      { words: ['Recess', 'Lunch Break'], difficulty: 'hard' },
      { words: ['Whiteboard', 'Chalkboard'], difficulty: 'hard' },
    ],
  },
  {
    id: 'travel',
    label: 'Travel',
    pairs: [
      { words: ['Passport', 'Visa'], difficulty: 'hard' },
      { words: ['Hotel', 'Hostel'], difficulty: 'medium' },
      { words: ['Suitcase', 'Backpack'], difficulty: 'medium' },
      { words: ['Vacation', 'Road Trip'], difficulty: 'medium' },
      { words: ['Map', 'GPS'], difficulty: 'medium' },
      { words: ['Tour Guide', 'Travel Agent'], difficulty: 'hard' },
      { words: ['Souvenir', 'Postcard'], difficulty: 'hard' },
    ],
  },
]

export const DIFFICULTIES = ['easy', 'medium', 'hard']

export function getCategoryById(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId)
}

/**
 * Returns every pair across categories, optionally filtered.
 * categoryId of 'all' (or falsy) includes every category.
 */
export function getAvailablePairs({ categoryId, difficulty } = {}) {
  const categories =
    !categoryId || categoryId === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((category) => category.id === categoryId)

  const pairs = categories.flatMap((category) =>
    category.pairs.map((pair) => ({ ...pair, categoryId: category.id, categoryLabel: category.label }))
  )

  if (!difficulty || difficulty === 'all') return pairs
  return pairs.filter((pair) => pair.difficulty === difficulty)
}
