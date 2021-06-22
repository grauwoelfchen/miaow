# setup {{{
setup: # Install node dev modules
	@npm install
.PHONY: setup
# }}}

# vet {{{
vet\:check: # Check errors using tsc [synonym: check]
	@npx tsc --strict --pretty
.PHONY: vet\:check

check: vet\:check
.PHONY: check

vet\:lint: # Check coding style for TypScript [synonym: lint]
	@npm run lint
.PHONY: vet\:lint

lint: vet\:lint
.PHONY: lint

vet\:all: vet\:check vet\:lint # Check code with all vet:xxx
.PHONY: vet\:all

vet: vet\:all # Alias of vet:all
.PHONY: vet
# }}}

# test {{{
test:
	@echo "TODO"
.PHONY: test
# }}}

# build {{{
build\:debug: # Build in development mode [synonym: build]
	npm run build:debug
.PHONY: build\:debug

build\:release: # Build in production mode
	npm run build:release
.PHONY: build\:release

build: build\:debug
.PHONY: build
# }}}

# utility {{{
watch\:build: # Start a process for building
	@npm run watch:build
.PHONY: watch\:build

watch\:check: # Start a process for checking by using tsc
	@npx tsc --strict --pretty --watch
.PHONY: watch\:check

watch\:lint: # Start a process for linting with onchange
	@npm run watch:lint
.PHONY: watch\:lint

watch: watch\:build # Alias of watch:build
.PHONY: watch

clean: # Remove built artifacts
	@rm -fr dst/{css,js}
.PHONY: clean

help: # Display this message
	@grep --extended-regexp '^[0-9a-z\:\\\%]+: ' $(firstword $(MAKEFILE_LIST)) | \
		grep --extended-regexp ' # ' | \
		sed --expression='s/\([a-z0-9\-\:\ ]*\): \([a-z0-9\-\:\ ]*\) #/\1: #/g' | \
		tr --delete \\\\ | \
		awk 'BEGIN {FS = ": # "}; \
			{printf "\033[38;05;026m%-18s\033[0m %s\n", $$1, $$2}' | \
		sort
.PHONY: help
# }}}

.DEFAULT_GOAL = build
default: build
