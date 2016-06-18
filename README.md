# barcoder
Creates barcodes either from user input or a barcode scanner. The primary purpose is to encode printer commands such as EPL commands into a 2D barcode; online barcode generators aren't sufficient for this since EPL commands must be separated by a line feed(LF). This program converts all line endings to LF behind the scene and all other text inputs can be encoded into a 2D barcode.

# Build
To build the app, run electron-packager for the target platform and arch. For example,

```sh
electron-packager ./ appName --platform=win32 --arch=x64
```

Then you can just run the exe file in the appName folder.
