MP3.js - a JavaScript MP3 decoder for Aurora.js (not this one!)
================================================

MP3.js is a refactored version of [JSMad](https://github.com/ofmlabs/jsmad) designed to run in the 
[Aurora.js](https://github.com/audiocogs/aurora.js) audio framework.  It supports all of the
features of JSMad and is released under the same GPLv2 license.  The code was reorganized a bit, and now
uses all typed arrays for decoding at better performance.

MP3.js adds support for layer I and II to the existing support for layer III. It also supports free bitrate streams, 
and improves performance thanks to the use of typed arrays.

## Authors

JSMad was originally written by [@nddrylliog](https://twitter.com/nddrylliog), 
[@jensnockert](https://twitter.com/jensnockert), and [@mgeorgi](https://twitter.com/mgeorgi) during a Music Hack Day. The 
refactor for MP3.js was performed by [@devongovett](https://twitter.com/devongovett).

## License

MP3.js follows the same jsmad license. MP3.js is available under the terms of the GNU General Public License, 
Version 2. Please note that under the GPL, there is absolutely no warranty of any kind, to the extent permitted by the law.

## Future

- MPEG 2.5 is not supported.

## NOTE on this

This repo is clone of [https://github.com/audiocogs/mp3.js](https://github.com/audiocogs/mp3.js) but with all connections to Aurora.js removed.