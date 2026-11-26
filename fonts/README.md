# Fonts served with the page

The typefaces for notes, texts and lengths, and for the interface, are served from here, so the page asks no other
site for anything. All are open fonts under the SIL Open Font License 1.1; each family's licence is in this folder.

| Family | Licence file | Source |
| --- | --- | --- |
| Arimo | `LICENSE-arimo.txt` | [@fontsource/arimo](https://www.npmjs.com/package/@fontsource/arimo), from [googlefonts/arimo](https://github.com/googlefonts/arimo) |
| Open Sans | `LICENSE-open-sans.txt` | [@fontsource/open-sans](https://www.npmjs.com/package/@fontsource/open-sans), from [googlefonts/opensans](https://github.com/googlefonts/opensans) |
| IBM Plex Sans Condensed | `LICENSE-ibm-plex-sans-condensed.txt` | [@fontsource/ibm-plex-sans-condensed](https://www.npmjs.com/package/@fontsource/ibm-plex-sans-condensed), from [IBM/plex](https://github.com/IBM/plex) |
| Roboto | `LICENSE-roboto.txt` | [@fontsource/roboto](https://www.npmjs.com/package/@fontsource/roboto), from [googlefonts/roboto-classic](https://github.com/googlefonts/roboto-classic) |
| IBM Plex Mono | `LICENSE-ibm-plex-mono.txt` | [@fontsource/ibm-plex-mono](https://www.npmjs.com/package/@fontsource/ibm-plex-mono), from [IBM/plex](https://github.com/IBM/plex) |

Each comes in regular, bold, italic and bold italic, cut into the `latin` and `latin-ext` letters (`fonts.css`
says which file holds which letters, so a browser fetches only what a page uses). The files are the WOFF2 files of
the Fontsource packages (version 5), unchanged.

To update them, install the packages with npm somewhere outside this repository and copy the same files over.
