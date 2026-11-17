# Render Markup

A small browser tool for marking up architectural renders: clean pill callouts with leader lines, freehand and straight-line sketching, and a full-resolution PNG export.

**Use it:** https://samiabdulnour.github.io/render-markup/

Everything runs in your browser. Images never leave your computer. The optional grammar check sends only the note text to [LanguageTool](https://languagetool.org).

## How it works

- **Open** a render (button, drag and drop, or paste with Ctrl/Cmd+V). It starts on a blank white canvas.
- **Notes:** press on the spot you want to describe and drag out to where the note should sit. A plain click places it automatically. Type the text in the side panel; the pill resizes itself.
- **Pill colours:** black, white, red or green. Horizontal by default, vertical optional. Text size and line length are adjustable per note.
- **Draw** (press D): freehand pen in the same four colours. Hold Shift for a straight line, which snaps to horizontal, vertical and 45°.
- **Check grammar:** proofreads every note (Australian English). Review each suggestion before it applies; names and street names start unticked.
- **Export PNG:** saves at the image's full resolution as `<name>_markup.png`.

## Shortcuts

| Key | Action |
| --- | --- |
| N / D | Notes tool / Draw tool |
| Ctrl/Cmd+Z | Undo |
| Ctrl/Cmd+Shift+Z, Ctrl+Y | Redo |
| Delete / Backspace | Delete selected note |
| Esc | Deselect |
| Shift (while drawing) | Straight line |

## Hosting

A single static `index.html` with no build step, served by GitHub Pages from the `main` branch root.
