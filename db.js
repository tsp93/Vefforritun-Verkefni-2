const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function insert(data) {
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'INSERT INTO applications(name, email, phone, text, job) VALUES($1, $2, $3, $4, $5)';
  const values = [data.name, data.email, data.phone, data.text, data.job];

  try {
    await client.query(query, values);
  } catch (err) {
    console.error('Error inserting data');
    throw err;
  } finally {
    await client.end();
  }
}

async function fetch() {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM applications ORDER BY id');

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error selecting form data');
    throw err;
  } finally {
    await client.end();
  }
}

async function update(id) {
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'UPDATE applications SET processed=true, updated=current_timestamp WHERE id=$1';
  const values = [id];

  try {
    await client.query(query, values);
    return;
  } catch (err) {
    console.error('Error updating data');
    throw err;
  } finally {
    await client.end();
  }
}

async function remove(id) {
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'DELETE FROM applications WHERE id=$1';
  const values = [id];

  try {
    await client.query(query, values);
    return;
  } catch (err) {
    console.error('Error deleting data');
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  insert,
  fetch,
  update,
  remove,
};