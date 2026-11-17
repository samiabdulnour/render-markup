# Render Markup

A small browser tool for marking up architectural renders: clean pill callouts with leader lines, freehand and straight-line sketching, and a full-resolution PNG export.

**Use it:** https://samiabdulnour.github.io/render-markup/

Everything runs in your browser. Images never leave your computer. The optional grammar check sends only the note text to [LanguageTool](https://languagetool.org).

## How it works

- **Open** a render (button, drag and drop, or paste with Ctrl/Cmd+V). It starts on a blank white canvas showing a drop placeholder; drop a render onto it, or just start marking up the blank canvas and the placeholder gets out of the way.
- **Mouse:** the left button draws; the wheel button (middle click) adds a note; dragging with the right button erases. A plain right-click opens a pop-up menu. Pills and their dots can be dragged with the left or wheel button.
- **Right-click menu:** on a note it offers Edit text, the four colours, Make vertical / horizontal and Delete; if the note is part of a selection, colour, orientation and Delete apply to all of it. Elsewhere it offers Add note here, Delete this line (when a drawn line is under the pointer), Undo, Redo and Clear drawing. On a laptop trackpad a two-finger tap opens it, so Add note here works without a wheel button.
- **Eraser:** rubs out only the ink it passes over, so a line can be trimmed or cut in two. It also removes any note whose pill it touches; the leader and dot do not count, so a sketch around a dot can be rubbed out without losing the note. Undo brings everything back. Hold Shift while dragging with the right button for a straight eraser, which snaps to horizontal, vertical and 45° like the straight pen. The Eraser size slider in the pen panel sets how wide it is.
- **Draw / Notes switch:** at the top of the side panel; it chooses what a left click does and starts on Draw. On a laptop or touch screen with no wheel button, switch to Notes (or press N) and place notes with a normal click.
- **Notes:** press on the spot you want to describe and drag out to where the note should sit. A plain click places it automatically. Type the text in the side panel; the pill resizes itself.
- **Selecting several notes:** in the notes list, Shift-click selects everything between the note you clicked last and this one; Ctrl/Cmd-click adds or removes a single note. Colour, orientation, text size and Delete then apply to all of them, and dragging one selected pill moves them all.
- **Pill colours:** black, white, red or green. Horizontal by default, vertical optional. Text size is adjustable per note. Long notes wrap on their own; press Enter in the text box for a line break exactly where you want one.
- **Draw:** freehand pen in the same four colours. Hold Shift for a straight line, which snaps to horizontal, vertical and 45°.
- **Check grammar:** proofreads every note (Australian English). Review each suggestion before it applies; names and street names start unticked.
- **Export PNG:** saves at the image's full resolution as `<name>_markup.png`.

## Shortcuts

| Key | Action |
| --- | --- |
| Left button | Draw (or add notes, when the switch is on Notes) |
| Right button, dragged | Erase drawing and notes |
| Right-click | Pop-up menu |
| Shift + right button, dragged | Erase in a straight line |
| Wheel button, Ctrl+click | Add a note |
| D / N | Left click draws / left click adds notes |
| Ctrl/Cmd+Z | Undo |
| Ctrl/Cmd+Shift+Z, Ctrl+Y | Redo |
| Shift+click in the notes list | Select a range of notes |
| Ctrl/Cmd+click in the notes list | Add or remove one note from the selection |
| Delete / Backspace | Delete the selected note or notes |
| Esc | Deselect |
| Shift (while drawing) | Straight line |

## Hosting

A single static `index.html` with no build step, served by GitHub Pages from the `main` branch root.
