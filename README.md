# Simple Beat & Melody Maker

This directory contains a simple web application that lets you create drum loops and play melodies directly in your browser. The project is intentionally lightweight and does not rely on any build system—just open `index.html` in a modern browser to get started.

## Features

* **Step Sequencer** – A four‑row sequencer with eight steps per measure. Toggle cells to activate drum hits for kick, snare, hi‑hat and clap samples. Adjust the tempo with the built‑in slider and start/stop playback with the buttons.
* **Melody Keyboard** – An on‑screen keyboard with eight notes (C4–C5). Click keys to play melodies using a simple synth.
* **Responsive Design** – The interface adapts to small screens by resizing the sequencer cells and piano keys.
* **No External Dependencies** – Aside from the Tone.js library loaded via CDN, all code is contained in this folder. You do not need Node.js or a build step to run it.

## Usage

1. Download or clone this repository and navigate into the `beat_maker_site` folder.
2. Open `index.html` in a modern desktop browser (Chrome, Firefox, Edge or Safari). The Web Audio API does not function in some mobile browsers, so for best results use a desktop environment.
3. Click on cells in the sequencer grid to activate or deactivate drum hits. Press **Play** to start the loop and **Stop** to stop it. Adjust the **Tempo** slider to change the speed.
4. Click the keys in the melody section to play notes. Each note triggers a short sound using a simple synthesizer.

## Customization

* **Changing Samples** – If you want to use your own drum samples, update the `url` properties in `script.js` with links to your sound files.
* **Adding/Removing Steps** – Modify the `steps` constant in `script.js` to increase or decrease the number of steps per measure. You’ll also need to adjust the CSS widths accordingly.
* **Styling** – Edit `style.css` to change colors, sizing or typography to better match your brand.

## Credits

This project uses the [Tone.js](https://tonejs.github.io/) library to handle audio synthesis and precise scheduling. Drum samples are pulled from the official Tone.js sample set.