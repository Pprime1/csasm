const POSTGRATOR = require('postgrator')
const PG_PARSE = require('pg-connection-string').parse;
const PG_POOL = require('pg').Pool
const path = require('path')

function db(connectionString) {
  return new Promise(resolve => {
    (async function() {
      const postgrator = new POSTGRATOR({
            validateChecksums: true, // Set to false to skip validation,
            newline: 'CRLF', // Force using 'CRLF' (windows) or 'LF' (unix/mac)
            migrationDirectory: path.join(__dirname, '../postgrator'),
            driver: 'pg',
            ssl: { rejectUnauthorized: false },
            connectionString
      })

      postgrator.on("migration-started", () => console.info("Migration started"));
      postgrator.on("migration-finished", () => console.info("Migration finished"));

      const migrationResult = await postgrator
        .migrate()
        .catch((error) => {
            console.error(`Migration Failure: ${error}`);
            process.exit(2);
        });

        console.info(`${migrationResult.length} migrations completed`);
        var pg_config = PG_PARSE(connectionString);

        // Amend Config to add SSL configuration
        pg_config = {
            ...pg_config,
            ssl: {
                rejectUnauthorized: false
            }
        };

        resolve(new PG_POOL(pg_config));
    }());
  });
}

module.exports = { db };
