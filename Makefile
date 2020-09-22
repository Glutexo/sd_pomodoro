all: meta/manifest.json locales/en.json resources/icon.svg source/code.html

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

source/code.html: build
	cp source/main.html build/main.html

clean:
	rm build/icon.png
	rm build/icon@2x.png
