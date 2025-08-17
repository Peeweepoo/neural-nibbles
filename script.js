// script.js
// This file contains the logic for the simple beat sequencer and melody keyboard.

// Configuration for our instruments. Each entry has a human‑readable label and a URL
// pointing to a drum sample hosted on the Tone.js website. You can swap these
// URLs for your own sounds if you wish.
const instruments = [
  { name: 'kick', label: 'Kick', url: 'https://tonejs.github.io/audio/drum-samples/breakbeat808/kick.wav' },
  { name: 'snare', label: 'Snare', url: 'https://tonejs.github.io/audio/drum-samples/breakbeat808/snare.wav' },
  { name: 'hihat', label: 'Hi‑Hat', url: 'https://tonejs.github.io/audio/drum-samples/breakbeat808/hh_closed.wav' },
  { name: 'clap', label: 'Clap', url: 'https://tonejs.github.io/audio/drum-samples/breakbeat808/clap.wav' },
];

// Number of steps in the sequencer (8 steps = two beats of 16th notes at 4/4 time).
const steps = 8;

// A two‑dimensional array representing which steps are active for each instrument.
// Each row corresponds to an instrument, each column to a step.
const pattern = instruments.map(() => Array(steps).fill(false));

// Player objects for each instrument will be stored here after loading.
const players = {};

// Tone.js synthesizer for the piano keyboard.
const synth = new Tone.Synth({
  oscillator: { type: 'triangle' },
  envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 }
}).toDestination();

// Notes for the keyboard. These are common white keys spanning one octave.
const keyboardNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

// Entry point once the DOM has finished loading.
async function init() {
  // Preload drum samples into Tone.Player objects.
  instruments.forEach((inst) => {
    players[inst.name] = new Tone.Player(inst.url).toDestination();
  });

  // Build the sequencer grid in the DOM.
  buildSequencerGrid();
  // Set up control handlers for play/stop and tempo.
  setupControls();
  // Build the melody keyboard.
  buildKeyboard();
}

// Dynamically create the sequencer grid based on the instruments and steps.
function buildSequencerGrid() {
  const gridEl = document.getElementById('grid');
  instruments.forEach((inst, rowIndex) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'row';

    // Label for the instrument (e.g. "Kick", "Snare").
    const labelEl = document.createElement('div');
    labelEl.className = 'label';
    labelEl.textContent = inst.label;
    rowEl.appendChild(labelEl);

    // Create each step cell for this row.
    for (let step = 0; step < steps; step++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = rowIndex;
      cell.dataset.step = step;

      // Toggle active state on click.
      cell.addEventListener('click', () => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.step);
        pattern[row][col] = !pattern[row][col];
        cell.classList.toggle('active', pattern[row][col]);
      });

      rowEl.appendChild(cell);
    }
    gridEl.appendChild(rowEl);
  });
}

// Set up the play/stop buttons and tempo slider.
function setupControls() {
  const playBtn = document.getElementById('play');
  const stopBtn = document.getElementById('stop');
  const tempoSlider = document.getElementById('tempo');
  const tempoValue = document.getElementById('tempo-value');

  // Highlight the current step at each interval and trigger samples.
  let currentIndex = 0;
  Tone.Transport.scheduleRepeat((time) => {
    highlightStep(currentIndex);
    instruments.forEach((inst, row) => {
      if (pattern[row][currentIndex]) {
        players[inst.name].start(time);
      }
    });
    currentIndex = (currentIndex + 1) % steps;
  }, '16n');

  // Start playback: initialize the audio context (Tone.start), reset the index and update buttons.
  playBtn.addEventListener('click', async () => {
    await Tone.start();
    currentIndex = 0;
    Tone.Transport.start();
    playBtn.disabled = true;
    stopBtn.disabled = false;
  });

  // Stop playback and reset highlights.
  stopBtn.addEventListener('click', () => {
    Tone.Transport.stop();
    currentIndex = 0;
    clearStepHighlight();
    playBtn.disabled = false;
    stopBtn.disabled = true;
  });

  // Update tempo when slider changes.
  tempoSlider.addEventListener('input', () => {
    const bpm = parseInt(tempoSlider.value);
    Tone.Transport.bpm.value = bpm;
    tempoValue.textContent = bpm;
  });
}

// Create the on‑screen keyboard and attach click handlers.
function buildKeyboard() {
  const pianoEl = document.getElementById('piano');
  keyboardNotes.forEach((note) => {
    const keyEl = document.createElement('div');
    keyEl.className = 'key';
    keyEl.textContent = note.replace(/\d/, ''); // display only the note letter
    // Use mousedown to trigger attack; Chrome requires user gesture to start audio.
    keyEl.addEventListener('mousedown', async () => {
      await Tone.start();
      synth.triggerAttackRelease(note, '8n');
    });
    pianoEl.appendChild(keyEl);
  });
}

// Highlight the current step across all rows.
function highlightStep(step) {
  clearStepHighlight();
  const cells = document.querySelectorAll(`.cell[data-step="${step}"]`);
  cells.forEach((cell) => {
    cell.classList.add('current');
  });
}

// Remove the highlight from any previously active step.
function clearStepHighlight() {
  document.querySelectorAll('.cell.current').forEach((cell) => {
    cell.classList.remove('current');
  });
}

// Kick off our initialization after the DOM is ready.
window.addEventListener('DOMContentLoaded', init);