#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER qpadmin;
    CREATE DATABASE arpb;
    GRANT ALL PRIVILEGES ON DATABASE arpb TO qpadmin;
	ALTER ROLE qpadmin WITH PASSWORD 'Password';
EOSQL