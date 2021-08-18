BUILD_DIR = build
DIST_DIR = $(HOME)/Library/Application Support/com.elgato.StreamDeck/Plugins/com.Glutexo.Pomodoro.sdPlugin

.PHONY: all
all: meta/manifest.json locales/en.json resources/icon.svg source/main.html source/main.js source/web_socket.js

.PHONY: build
build:
	mkdir -p "$(BUILD_DIR)"

.PHONY: clean
clean:
	rm $(BUILD_DIR)/*

.PHONY: dist
dist: all
	mkdir -p "$(DIST_DIR)"
	cp "$(BUILD_DIR)"/* "$(DIST_DIR)"


locales/en.json: build
	cp $@ $(BUILD_DIR)/en.json

meta/manifest.json: build
	cp $@ $(BUILD_DIR)/manifest.json

resources/icon.svg: build
	convert $@ -resize 72x72 $(BUILD_DIR)/icon.png
	convert $@ -resize 144x144 $(BUILD_DIR)/icon@2x.png

source/main.html: build
	cp $@ $(BUILD_DIR)/main.html

source/main.js: build
	cp $@ $(BUILD_DIR)/main.js

source/web_socket.js: build
	cp $@ $(BUILD_DIR)/web_socket.js
