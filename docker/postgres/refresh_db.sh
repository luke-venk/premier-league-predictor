#!/bin/zsh
#
# Deletes the database if it exists, creates the database, and runs the script
# to create the tables according to the defined schema in `db/init_schema.sql`.
DATABASE="premier_league"

dropdb --if-exists "$DATABASE"
createdb "$DATABASE"
psql -d "$DATABASE" -f ./init_schema.sql