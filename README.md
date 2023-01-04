# Petal Cite Browser Extension

## Building

1. `git clone --recursive https://github.com/ks-collab/cite-extension.git`
1. `cd cite-extension`
1. `yarn install`
1. `yarn build`

The build are built in `build/`.

## Running from the build directory

### Chrome

1. Go to chrome://extensions/
1. Enable "Developer Mode".
1. Click "Load unpacked extension…" and select the `build` directory.

### Firefox

1. Go to about:debugging
1. Click "Load Temporary Add-on" and select the `build/manifest.json` file.

### Safari
1. Make sure you have Safari 14 and Xcode 12 installed
1. In the terminal, convert the extension to be Safari compatibale 
`xcrun safari-web-extension-converter <your build folder>`
1. Click Run to launch the extension
1. Safari will be opened
   1. Safari -> preferences -> enable development menu
   1. Safari -> develop menu -> click allow unsigned extension (need to do this every time safari is restarted)
   1. Safari -> preferences -> extensions tab -> click the extension
   1. open an website on Safari, click the icon near the address bar, and allow the access

## Automatic rebuilding/reloading

### Chrome on MacOS

1. `brew install chrome-cli`
1. `npm install -g gulp`
1. `cd` to project root
1. `yarn install`
1. `yarn build`
1. `gulp watch-chrome`

As files are changed, the extension will be rebuilt automatically and Chrome will reload the extension.

### Firefox

1. Get and install the [Mozilla web-ext tool](https://github.com/mozilla/web-ext)
1. `cd` to project root
1. `yarn install`
1. `yarn build`
1. `gulp watch`
1. `./scripts/run_xpi` (in a different terminal window)

As files are changed, the extension will be rebuilt automatically and Firefox will reload the extension.

### Others

1. `cd` to project root
1. `npm install`
1. `yarn build`
1. `gulp watch`

As files are changed, the extension will be rebuilt automatically. You will need to manually reload the extension
in the browser being developed for.

## Developing
### Technologies
###### Chrome/Firefox Browser Extension Framework
The functionality exposed on Chrome and Firefox is provided by the Chrome extension framework,
which has also been adopted by Firefox. See [Chrome Extension docs](https://developer.chrome.com/extensions)
and [Firefox Extension docs](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) for more information.

###### Safari extension converter
Safari version was converted from Chrome/Firefox version by using `safari-web-extension-converter` provided by Apple. See [Converting a web extension for Safari](https://developer.apple.com/documentation/safariservices/safari_web_extensions/converting_a_web_extension_for_safari) for more details.


## Contact

If you have any questions about this extension you can email us at [help@petal.org](mailto:help@petal.org).
