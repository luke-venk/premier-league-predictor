#!/bin/zsh
DATABASE="premier_league"

dropdb --if-exists "$DATABASE"
createdb "$DATABASE"
psql -d "$DATABASE" -f ./init_schema.sql