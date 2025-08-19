// script.js for Beat Maker Studio
// This file contains the core logic for our enhanced beat sequencer and
// melody keyboard. It leverages Tone.js to handle audio playback and
// scheduling. The goal is to provide a simple interface that enables
// users to craft sophisticated beats and melodies without needing to
// understand the underlying audio implementation.

// Define the drum instruments with human‑readable labels and sample URLs.
const instruments = [
  {
    name: 'kick',
    label: 'Kick',
    url: 'https://tonejs.github.io/audio/drum-samples/breakbeat808/kick.wav',
  },
  {
    name: 'snare',
    label: 'Snare',
    url: 'https://tonejs.github.io/audio/drum-samples/breakbeat808/snare.wav',
  },
  {
    name: 'hihat',
    label: 'Hi‑Hat',
    url: 'https://tonejs.github.io/audio/drum-samples/breakbeat808/hh_closed.wav',
  },
  {
    name: 'clap',
    label: 'Clap',
    url: 'https://tonejs.github.io/audio/drum-samples/breakbeat808/clap.wav',
  },
];

// Set the number of steps in our sequencer grid. Sixteen steps give
// a comfortable length for loops (one bar of sixteenth notes in 4/4).
const steps = 16;

// Create a two‑dimensional array to keep track of which steps are active
// for each instrument. Each row corresponds to an instrument and each
// column corresponds to a step. Initially all cells are inactive.
const pattern = instruments.map(() => Array(steps).fill(false));

// Object to hold the Tone.Player instances for each instrument once
// loaded. We load samples ahead of time to avoid latency during playback.
const players = {};

// PolySynth allows us to play multiple notes simultaneously on the
// keyboard. The default synth in Tone.js is monophonic.
const synth = new Tone.PolySynth().toDestination();

// Define the set of notes available on the on‑screen keyboard. This
// covers two octaves (C4–C6) to give ample melodic range.
const keyboardNotes = [
  'C4',
  'D4',
  'E4',
  'F4',
  'G4',
  'A4',
  'B4',
  'C5',
  'D5',
  'E5',
  'F5',
  'G5',
  'A5',
  'B5',
  'C6',
];

// Entry point called after the DOM has finished loading. This function
// preloads all drum samples, hides the loading overlay, and then
// constructs the sequencer grid, control elements and keyboard.
async function init() {
  const loadingOverlay = document.getElementById('loading');
  // Show the loading overlay while samples load
  loadingOverlay.classList.remove('hidden');

  // Preload each sample via Tone.Player. The .load() method returns
  // a promise that resolves when the audio is ready. We store the
  // player in the players object for later use.
  const loadPromises = instruments.map((inst) => {
    const player = new Tone.Player({ url: inst.url, autostart: false }).toDestination();
    players[inst.name] = player;
    return player.load();
  });
  // Wait until all samples have been loaded
  await Promise.all(loadPromises);

  // Hide the loading overlay once samples are ready
  loadingOverlay.classList.add('hidden');

  // Build the UI components
  buildSequencerGrid();
  setupControls();
  buildKeyboard();
}

// Dynamically build the sequencer grid in the DOM. Each instrument
// corresponds to a row, and each step in that row corresponds to a
// clickable cell that toggles the pattern state.
function buildSequencerGrid() {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';
  instruments.forEach((inst, rowIndex) => {
    // Create row container
    const rowEl = document.createElement('div');
    rowEl.className = 'row';
    // Label for the instrument (e.g., "Kick")
    const labelEl = document.createElement('div');
    labelEl.className = 'label';
    labelEl.textContent = inst.label;
    rowEl.appendChild(labelEl);
    // Create step cells
    for (let step = 0; step < steps; step++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = rowIndex;
      cell.dataset.step = step;
      // Toggle pattern state on click
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

// Set up playback controls and tempo slider. The transport scheduler
// repeatedly advances through the pattern and triggers samples when
// the corresponding cells are active.
function setupControls() {
  const playBtn = document.getElementById('play');
  const stopBtn = document.getElementById('stop');
  const tempoSlider = document.getElementById('tempo');
  const tempoValue = document.getElementById('tempo-value');

  // Schedule the sequence on the Tone.Transport. Use a 16th note
  // interval to step through our 16 cell pattern. The callback is
  // passed a time parameter for sample scheduling.
  let currentStep = 0;
  Tone.Transport.scheduleRepeat((time) => {
    highlightStep(currentStep);
    instruments.forEach((inst, rowIndex) => {
      if (pattern[rowIndex][currentStep]) {
        // Start the sample at the scheduled time. Use .start with
        // relative offset 0 to always trigger from the beginning.
        players[inst.name].start(time);
      }
    });
    currentStep = (currentStep + 1) % steps;
  }, '16n');

  // Start playback
  playBtn.addEventListener('click', async () => {
    await Tone.start();
    currentStep = 0;
    Tone.Transport.start();
    playBtn.disabled = true;
    stopBtn.disabled = false;
  });

  // Stop playback and reset highlights
  stopBtn.addEventListener('click', () => {
    Tone.Transport.stop();
    currentStep = 0;
    clearStepHighlight();
    playBtn.disabled = false;
    stopBtn.disabled = true;
  });

  // Update BPM when the tempo slider changes
  tempoSlider.addEventListener('input', () => {
    const bpm = parseInt(tempoSlider.value);
    Tone.Transport.bpm.value = bpm;
    tempoValue.textContent = bpm;
  });
}

// Build the on‑screen keyboard. Each key triggers a note using
// the PolySynth when pressed. We use mousedown rather than click
// because audio must be initiated from a user gesture to satisfy
// browser autoplay policies.
function buildKeyboard() {
  const pianoEl = document.getElementById('piano');
  pianoEl.innerHTML = '';
  keyboardNotes.forEach((note) => {
    const keyEl = document.createElement('div');
    keyEl.className = 'key';
    keyEl.textContent = note.replace(/\d/, '');
    keyEl.addEventListener('mousedown', async () => {
      await Tone.start();
      synth.triggerAttackRelease(note, '8n');
    });
    pianoEl.appendChild(keyEl);
  });
}

// Highlight the current step across all rows. This visual feedback
// helps users see where the pattern is during playback.
function highlightStep(stepIndex) {
  clearStepHighlight();
  const cells = document.querySelectorAll(`.cell[data-step="${stepIndex}"]`);
  cells.forEach((cell) => cell.classList.add('current'));
}

// Remove highlight from all cells.
function clearStepHighlight() {
  document.querySelectorAll('.cell.current').forEach((cell) => {
    cell.classList.remove('current');
  });
}

// Kick off initialization after the DOM is fully loaded.
window.addEventListener('DOMContentLoaded', init);