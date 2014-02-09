.PHONY: launch

all:
	@echo "Available commands:"
	@grep "^[^#[:space:]].*:$$" Makefile

setup:
	npm install
	sudo gem install jekyll

grunt:
	grunt
	
launch:
	@jekyll serve --watch