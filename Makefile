.PHONY: launch

all:
	@echo "Available commands:"
	@grep "^[^#[:space:]].*:$$" Makefile

setup:
	@gem install jekyll

launch:
	@jekyll serve --watch