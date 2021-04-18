const POSTGRATOR = require('postgrator')
const PG_PARSE = require('pg-connection-string').parse;
const PG_POOL = require('pg').Pool


const postgrator = new POSTGRATOR({
      validateChecksums: true, // Set to false to skip validation,
      newline: 'CRLF', // Force using 'CRLF' (windows) or 'LF' (unix/mac)
      migrationDirectory: path.join(__dirname, 'postgrator'),
      driver: 'pg',
      ssl: { rejectUnauthorized: false },
      CONNECTION_STRING
})

postgrator.on("migration-started", () => console.info("Migration started"));
postgrator.on("migration-finished", () => console.info("Migration finished"));

const executeMigration = async () => {
  const migration = await postgrator
    .migrate()
    .catch((error) => throw new Error (`Migration Failure: ${error}`);

    console.info(`${migration.length} migrations completed`);
}

await executeMigration();

var pg_config = PG_PARSE(CONNECTION_STRING)

// Amend Config to add SSL configuration
pg_config = {
    ...pg_config,
    ssl: {
        rejectUnauthorized: false
    }
}

const db_pool = new PG_POOL(pg_config)

module.exports = { db_pool };
