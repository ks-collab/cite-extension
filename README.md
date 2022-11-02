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

## Contact

If you have any questions about this extension you can email us at [help@petal.org](mailto:help@petal.org).
