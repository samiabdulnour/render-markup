# Render Markup

A small browser tool for marking up architectural renders: clean pill callouts with leader lines, freehand and straight-line sketching, and a full-resolution PNG export.

**Use it:** https://samiabdulnour.github.io/render-markup/

Everything runs in your browser. Images never leave your computer. The optional grammar check sends only the note text to [LanguageTool](https://languagetool.org).

## How it works

- **Open** a render (button, drag and drop, or paste with Ctrl/Cmd+V). It starts on a blank white canvas showing a drop placeholder; drop a render onto it, or just start marking up the blank canvas and the placeholder gets out of the way.
- **Mouse:** the left button draws; the wheel button (middle click) adds a note; dragging with the right button erases. With the switch on Notes the first two swap: the left button adds notes and the wheel button draws. A plain right-click opens a pop-up menu. Pills and their dots can be dragged with the left or wheel button.
- **Right-click menu:** on a note it offers Edit text, the four colours, the four shapes, Make vertical / horizontal and Delete; if the note is part of a selection, colour, shape, orientation and Delete apply to all of it. Elsewhere it offers Add note here, Delete this line (when a drawn line is under the pointer), Select all notes, Undo, Redo, Clear drawing and Save image. On a laptop trackpad a two-finger tap opens it, so Add note here works without a wheel button.
- **Eraser:** rubs out only the ink it passes over, so a line can be trimmed or cut in two. It also removes any note whose pill it touches; the leader and dot do not count, so a sketch around a dot can be rubbed out without losing the note. Undo brings everything back. Hold Shift while dragging with the right button for a straight eraser, which snaps to horizontal, vertical and 45° like the straight pen. The Eraser size slider in the pen panel sets how wide it is.
- **Zoom:** hold Ctrl (Cmd on a Mac) and turn the mouse wheel to zoom in and out at the pointer; a trackpad pinch does the same. When zoomed in, the wheel scrolls up and down, Shift + wheel scrolls sideways, and holding Space lets you drag the image with the left button. The read-out in the top-right corner of the image shows the scale; click it, or press 0, to fit the image again. Zoom only changes the view: the export is always the full image.
- **Draw / Notes switch:** at the top of the side panel; it chooses what a left click does, starts on Draw, and gives the wheel button the other job. On a laptop or touch screen with no wheel button, switch to Notes (or press N) to place notes with a normal click, and back to Draw (D) to sketch.
- **Notes:** press on the spot you want to describe and drag out to where the note should sit. A plain click places it automatically. Type the text in the side panel; the pill resizes itself.
- **Selecting several notes:** in the notes list, Shift-click selects everything between the note you clicked last and this one; Ctrl/Cmd-click adds or removes a single note; Ctrl/Cmd+A selects every note. Colour, shape, orientation, text size and Delete then apply to all of them, and dragging one selected pill moves them all.
- **Note shapes:** pill, rectangle, rectangle with rounded corners, or circle. A circle suits short labels such as a number or a letter. New notes take the shape, colour, size and orientation of the note selected last, even after it has been deselected.
- **Note colours:** black, white, red or green. Horizontal by default, vertical optional. One Text size slider sets the size of the selected note or notes; to resize every note, select them all with Ctrl/Cmd+A first. Long notes wrap on their own; press Enter in the text box for a line break exactly where you want one.
- **Draw:** freehand pen in the same four colours. Hold Shift for a straight line, which snaps to horizontal, vertical and 45°.
- **Check grammar:** proofreads every note (Australian English). Review each suggestion before it applies; names and street names start unticked.
- **Export PNG:** saves at the image's full resolution as `<name>_markup.png`. Save image in the right-click menu and Ctrl/Cmd+S do the same.

## Shortcuts

| Key | Action |
| --- | --- |
| Left button | Draw (add a note, when the switch is on Notes) |
| Right button, dragged | Erase drawing and notes |
| Right-click | Pop-up menu |
| Shift + right button, dragged | Erase in a straight line |
| Wheel button, Ctrl+click | Add a note (draw, when the switch is on Notes) |
| D / N | Switch to Draw / Notes, which swaps the left and wheel buttons |
| Ctrl/Cmd+Z | Undo |
| Ctrl/Cmd+Shift+Z, Ctrl+Y | Redo |
| Shift+click in the notes list | Select a range of notes |
| Ctrl/Cmd+click in the notes list | Add or remove one note from the selection |
| Ctrl/Cmd+A | Select all notes |
| Ctrl/Cmd+S | Save the marked-up image |
| Ctrl/Cmd + wheel, or pinch | Zoom in and out at the pointer |
| Wheel / Shift + wheel | Scroll up-down / sideways, when zoomed in |
| Space + drag | Drag the image, when zoomed in |
| 0 | Fit the image |
| Delete / Backspace | Delete the selected note or notes |
| Esc | Deselect |
| Shift (while drawing) | Straight line |

## Hosting

A single static `index.html` with no build step, served by GitHub Pages from the `main` branch root.
