const db = require('../models');
const Users = db.users;

const FoodEntries = db.food_entries;

const Recommendations = db.recommendations;

const FoodEntriesData = [
  {
    // type code here for "images" field

    calorie_count: 53.04,

    fat_content: 94.57,

    protein_content: 52.93,

    carbohydrate_content: 95.05,

    entry_date: new Date('2023-12-07'),

    // type code here for "relation_one" field
  },

  {
    // type code here for "images" field

    calorie_count: 37.37,

    fat_content: 82.86,

    protein_content: 63.99,

    carbohydrate_content: 58.59,

    entry_date: new Date('2024-02-20'),

    // type code here for "relation_one" field
  },

  {
    // type code here for "images" field

    calorie_count: 11.59,

    fat_content: 40.99,

    protein_content: 74.29,

    carbohydrate_content: 27.44,

    entry_date: new Date('2023-07-06'),

    // type code here for "relation_one" field
  },

  {
    // type code here for "images" field

    calorie_count: 78.99,

    fat_content: 99.24,

    protein_content: 91.28,

    carbohydrate_content: 32.77,

    entry_date: new Date('2023-05-30'),

    // type code here for "relation_one" field
  },
];

const RecommendationsData = [
  {
    title: "Goin' hog huntin'",

    description: 'Not if anything to say about it I have',

    // type code here for "relation_many" field
  },

  {
    title: "How 'bout them Cowboys",

    description:
      'Do not assume anything Obi-Wan. Clear your mind must be if you are to discover the real villains behind this plot.',

    // type code here for "relation_many" field
  },

  {
    title: "C'mon Naomi",

    description: 'Difficult to see. Always in motion is the future...',

    // type code here for "relation_many" field
  },

  {
    title: 'That damn diabetes',

    description: 'Already know you that which you need.',

    // type code here for "relation_many" field
  },
];

// Similar logic for "relation_many"

async function associateFoodEntryWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const FoodEntry0 = await FoodEntries.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (FoodEntry0?.setUser) {
    await FoodEntry0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const FoodEntry1 = await FoodEntries.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (FoodEntry1?.setUser) {
    await FoodEntry1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const FoodEntry2 = await FoodEntries.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (FoodEntry2?.setUser) {
    await FoodEntry2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const FoodEntry3 = await FoodEntries.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (FoodEntry3?.setUser) {
    await FoodEntry3.setUser(relatedUser3);
  }
}

// Similar logic for "relation_many"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await FoodEntries.bulkCreate(FoodEntriesData);

    await Recommendations.bulkCreate(RecommendationsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateFoodEntryWithUser(),

      // Similar logic for "relation_many"
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('food_entries', null, {});

    await queryInterface.bulkDelete('recommendations', null, {});
  },
};
