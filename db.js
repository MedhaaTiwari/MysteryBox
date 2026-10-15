'use strict';

const { MongoClient } = require('mongodb');

let clientPromise;
let databasePromise;

function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured. Set it in your environment before starting the production server.');
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE || 10),
      minPoolSize: 0,
      serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 10000),
      connectTimeoutMS: 10000,
      retryWrites: true
    });
    clientPromise = client.connect().catch(error => {
      clientPromise = undefined;
      throw error;
    });
  }

  return clientPromise;
}

async function getDb() {
  if (!databasePromise) {
    databasePromise = (async () => {
      const client = await getMongoClient();
      const dbName = process.env.MONGODB_DB_NAME || undefined;
      return dbName ? client.db(dbName) : client.db();
    })().catch(error => {
      databasePromise = undefined;
      throw error;
    });
  }
  return databasePromise;
}

async function closeDb() {
  if (clientPromise) {
    const promise = clientPromise;
    clientPromise = undefined;
    databasePromise = undefined;
    try {
      const client = await promise;
      await client.close();
    } catch (error) {
      // A failed connection has nothing left to close.
      if (process.env.NODE_ENV !== 'test') console.error('MongoDB shutdown:', error.message);
    }
  }
}

module.exports = { getDb, getMongoClient, closeDb };
