
const operations = CASES.map(c => ({
  updateOne: {
    filter: { _id: c.id },
    update: {
      $set: {
        ...c,
        caseId: c.id,
        updatedAt: new Date()
      },
      $setOnInsert: {
        createdAt: new Date()
      }
    },
    upsert: true
  }
}));

if (operations.length) {
  await collections.cases.bulkWrite(operations, {
    ordered: true
  });
}
