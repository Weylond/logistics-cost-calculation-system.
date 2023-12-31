include .env

PWD	= $(shell pwd)
MIGRATE_CONTAINER	= migrate/migrate:v4.16.0
POSTGRES_CONTAINER	= postgres:15.3-alpine3.18
POSTGRES_URL	= postgres://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@127.0.0.1:5432/postgres?sslmode=disable

all: up

up-local-postgres:
	@if [ ! -d ./postgres ]; then \
		mkdir -p ./postgres/data; \
	fi

	docker run \
		-d \
		--rm \
		--name postgres-local-dev \
		--mount type=bind,source="$(PWD)/postgres/data",target="/var/lib/postgresql/data" \
		-p 5432:5432 \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		$(POSTGRES_CONTAINER)
	@sleep 1

# we cant make migrations without postgres container
# so we dont need make container task
make-migrations: up-local-postgres
	docker run \
		--rm \
		--name migrate-util-dev \
		--network host \
		--mount type=bind,source="$(PWD)/migrate",target="/mnt" \
		-it \
		$(MIGRATE_CONTAINER) \
		-path /mnt -database "$(POSTGRES_URL)" up

# plz dont execute)
drop-migrations:
	docker run \
		--rm \
		--name migrate-util-dev \
		--network host \
		--mount type=bind,source="$(PWD)/migrate",target="/migrate" \
		-it \
		$(MIGRATE_CONTAINER) \
		-path /migrate -database "$(POSTGRES_URL)" down

down-local-postgres: 
	docker stop postgres-local-dev

gen-static:
	@if [ -d ./static/ ]; then \
		rm -rf static/; \
	fi

	cd ../frontend; \
		make call
	cp -r ../frontend/dist/ ../infra/static/

prepare:
ifeq (,$(wildcard ./.env))
	$(error .env secret swag is not here, plz get that swag)
endif

	@if [ ! -d ./logs/ ]; then \
		mkdir ./logs/; \
	fi

up: down prepare gen-static make-migrations down-local-postgres
	docker-compose up -d --build

	@echo
	@echo ----------------------------------
	@echo Connect: http:/127.0.0.1/
	@echo ----------------------------------
	@echo for stop exec: make down

down:
	docker-compose down

clean:
	rm -r static
