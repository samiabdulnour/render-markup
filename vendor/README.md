# Third-party libraries

These files are copied unchanged from their npm packages so the site can open and export PDFs without loading code from anywhere else. They are only fetched by the browser when a PDF is opened or exported.

| Folder | Package | Version | Licence |
| --- | --- | --- | --- |
| `pdfjs/` | [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) (Mozilla PDF.js), `legacy/build` plus `standard_fonts`, `cmaps`, `iccs` and the image-decoder files from `wasm` | 6.5.438 | Apache-2.0; see `pdfjs/LICENSE` and the licence files inside `standard_fonts`, `cmaps`, `iccs` and `wasm` |
| `pdf-lib/` | [pdf-lib](https://www.npmjs.com/package/pdf-lib), `dist/pdf-lib.min.js` | 1.17.1 | MIT; see `pdf-lib/LICENSE.md` |

To update one, install the new version with npm somewhere outside this repository and copy the same files over.
