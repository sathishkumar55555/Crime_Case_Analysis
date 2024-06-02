import { Pool } from 'pg';

import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host:"localhost",
    database:"createDB",
    user:"postgres",
    password:"2113", 
    port:5432,
  },
});

export const query = async (query, values) => {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    throw Error(error.message);
  }
};

export default db;
