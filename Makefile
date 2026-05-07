.PHONY: install dev build start lint lint-arch lint-quality harness-verify

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

start:
	pnpm start

lint:
	pnpm lint

lint-arch:
	pnpm lint:deps

lint-quality:
	pnpm lint:quality

harness-verify:
	pnpm harness:verify
