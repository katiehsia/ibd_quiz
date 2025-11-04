// Add as many modules as you want here
export const MODULES = [
  {
    id: "ibd1",
    name: "Intro to IBD",
    sheetId: "1wY34d7sgHzh9XqjLvJYvJFw5xwl9JEN4T8NwQ7OPkS0",

    // ✅ Multiple matching quizzes supported
    matchingSheetIds: [
      "1Al7spqnrOhDfl1ZW4Yhw2jnsZ2pPLMDC8rJDPHVuboo", // triggers after 3rd correct
      "12NMJ1oYuzkUuy7whchci5x1ox3HDgxhTIzl15Ms3fl8", // triggers after 7th correct
    ],
    matchingTriggerPoints: [3, 7],
  },
];
