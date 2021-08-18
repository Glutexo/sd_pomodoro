# StreamDeck Pomodoro Timer #

## About ##

…

## Build ##

### Requirements ###

- StreamDeck, naturally
  ```
  $ brew install elgato-stream-deck
  ```
- ImageMagick
  ```
  $ brew install imagemagick
  ```

### Instructions ###

There are several build targets:

- ```
  $ make build
  ```
   to compile everything into a _sdPlugin_ package.
- ```
  $ make dist
  ```
  to copy the package into the StreamDeck plugin library on your system.
- ```
  $ make link
  ```
  to symlink the build directory to the StreamDeck plugin library for easier development. 

## License ##

MIT
