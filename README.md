# Beat Maker Studio

This directory contains an enhanced beat and melody maker that lets you craft full 16‑step drum loops and play melodies across two octaves. The interface stays simple to use but provides enough range to create professional‑sounding sequences.

## Features

* **16‑Step Drum Sequencer** – Four rows (kick, snare, hi‑hat and clap) with sixteen steps per measure allow you to build complex patterns. Toggle cells to activate hits; the step currently being played is highlighted.
* **Tempo Control & Transport** – Adjust BPM from 60–180 with a slider. Dedicated Play and Stop buttons control playback. Samples are preloaded asynchronously, and a loading overlay is shown while preparing.
* **Two‑Octave PolySynth Keyboard** – An on‑screen keyboard covering notes C4 through C6 triggers notes using a polyphonic synthesizer, allowing chords and richer melodies.
* **Responsive and Accessible UI** – A modern dark theme with responsive sizing and clear visual feedback. The layout adapts to smaller screens.
* **No Build Tools Required** – Everything runs in the browser. Tone.js is loaded via CDN; just open `index.html` to start creating.

## Usage

1. Download or clone this folder and open `index.html` in a modern desktop browser (Chrome, Firefox, Edge or Safari).
2. Wait for the “Loading samples…” overlay to disappear—drum samples are preloaded.
3. Click cells in the sequencer grid to toggle hits. Press **Play** to start the loop and **Stop** to halt it. Use the tempo slider to change BPM.
4. Play notes on the on‑screen keyboard to add melodies over your beat. You can play chords and single notes simultaneously.

## Customization

* **Change Samples** – Replace the `url` fields in `script.js` with URLs to your own drum samples.
* **Adjust Steps** – Modify the `steps` constant in `script.js` to change pattern length. Update CSS cell widths accordingly.
* **Styling Tweaks** – Edit `style.css` to customize colors, fonts and sizes.

## Credits

Built with [Tone.js](https://tonejs.github.io/) for audio scheduling and synthesis.