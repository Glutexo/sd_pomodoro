all: meta/manifest.json locales/en.json resources/icon.svg source/main.html source/main.js source/web_socket.js

.PHONY: build
build:
	mkdir -p build

locales/en.json: build
	cp locales/en.json build/en.json

meta/manifest.json: build
	cp meta/manifest.json build/manifest.json

resources/icon.svg: build
	convert resources/icon.svg -resize 72x72 build/icon.png
	convert resources/icon.svg -resize 144x144 build/icon@2x.png

source/main.html: build
	cp source/main.html build/main.html

source/main.js: build
	cp source/main.js build/main.js

source/web_socket.js: build
	cp source/web_socket.js build/web_socket.js

clean:
	rm build/icon.png
	rm build/icon@2x.png
