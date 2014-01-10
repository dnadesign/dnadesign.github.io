.PHONY: launch

all:
	@echo "Available commands:"
	@grep "^[^#[:space:]].*:$$" Makefile

setup:
	sudo gem install jekyll

launch:
	@jekyll serve --watch