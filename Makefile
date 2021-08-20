BUILD_DIR = build
LOCALES_DIR = locales
META_DIR = meta
RESOURCES_DIR = resources
SOURCE_DIR = source
DIST_DIR = $(HOME)/Library/Application Support/com.elgato.StreamDeck/Plugins/com.Glutexo.Pomodoro.sdPlugin

mkdir = mkdir -p "$(@D)"

.PHONY: build
build: $(BUILD_DIR)/en.json $(BUILD_DIR)/manifest.json $(BUILD_DIR)/icon.png $(BUILD_DIR)/icon@2x.png\
	$(BUILD_DIR)/events.js $(BUILD_DIR)/main.html $(BUILD_DIR)/main.js $(BUILD_DIR)/web_socket.js

.PHONY: clean
clean:
	rm "$(BUILD_DIR)"/*

.PHONY: dist
dist: build
	mkdir -p "$(DIST_DIR)"
	cp "$(BUILD_DIR)"/* "$(DIST_DIR)"

.PHONY: link
link: build
	ln -s "$(abspath $(BUILD_DIR))" "$(DIST_DIR)"

.PHONY: rmdist
rmdist:
	rm -rf "$(DIST_DIR)"

$(BUILD_DIR)/en.json: $(LOCALES_DIR)/en.json
	$(mkdir)
	cp "$?" "$@"

$(BUILD_DIR)/manifest.json: $(META_DIR)/manifest.json
	$(mkdir)
	cp "$?" "$@"

$(BUILD_DIR)/icon.png: $(RESOURCES_DIR)/icon.svg
	$(mkdir)
	convert "$?" -resize 72x72 "$@"

$(BUILD_DIR)/icon@2x.png: $(RESOURCES_DIR)/icon.svg
	$(mkdir)
	convert "$?" -resize 144x144 "$@"

$(BUILD_DIR)/events.js: $(SOURCE_DIR)/events.js
	$(mkdir)
	cp "$?" "$@"

$(BUILD_DIR)/main.html: $(SOURCE_DIR)/main.html
	$(mkdir)
	cp "$?" "$@"

$(BUILD_DIR)/main.js: $(SOURCE_DIR)/main.js
	$(mkdir)
	cp "$?" "$@"

$(BUILD_DIR)/web_socket.js: $(SOURCE_DIR)/web_socket.js
	$(mkdir)
	cp "$?" "$@"
