// script.js for Beat Maker Studio
// This file contains the core logic for our enhanced beat sequencer and
// melody keyboard. It uses Tone.js synthesizers instead of external
// samples to avoid cross-origin loading issues. The goal is to
// provide a simple interface that enables users to craft sophisticated
// beats and melodies without needing to understand audio engineering.

// Define the drum instruments with human-readable labels. We omit
// URLs because sounds are synthesized.
const instruments = [
  { name: 'kick', label: 'Kick' },
  { name: 'snare', label: 'Snare' },
  { name: 'hihat', label: 'Hi-Hat' },
  { name: 'clap', label: 'Clap' },
];

// Set the number of steps in our sequencer grid. Sixteen steps give
// a comfortable loop length (one bar of sixteenth notes in 4/4).
const steps = 16;

// Create a 2D array to track which pads are active. Each row
// corresponds to an instrument, each column to a step.
const pattern = instruments.map(() => Array(steps).fill(false));

// Hold Tone.js synthesizers for each drum instrument. Synths are
// configured to approximate familiar drum sounds. Using synths
// instead of sample files ensures the sequencer works over HTTP/HTTPS
// without CORS problems.
const drumSynths = {};

// PolySynth for the melody keyboard. Supports multiple notes at once.
const synth = new Tone.PolySynth().toDestination();

// Notes for the on-screen keyboard (two octaves C4–C6)
const keyboardNotes = [
  'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',
  'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5',
  'C6'
];

// Initialize the application once the DOM is loaded. Create drum
// synths, hide the loading overlay, and build the UI.
async function init() {
  const loadingOverlay = document.getElementById('loading');
  if (loadingOverlay) loadingOverlay.classList.remove('hidden');

  // Instantiate drum synthesizers with settings tuned for each sound.
  drumSynths.kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 3,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
  }).toDestination();
  drumSynths.snare = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
  }).toDestination();
  drumSynths.hihat = new Tone.MetalSynth({
    frequency: 450,
    envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 5000,
    octaves: 1.5,
  }).toDestination();
  drumSynths.clap = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.25, sustain: 0 },
  }).toDestination();

  // Hide the loading overlay now that synthesizers are ready.
  if (loadingOverlay) loadingOverlay.classList.add('hidden');

  buildSequencerGrid();
  setupControls();
  buildKeyboard();
}

// Build the sequencer grid: rows for instruments, columns for steps.
function buildSequencerGrid() {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';
  instruments.forEach((inst, rowIndex) => {
    // Create row container
    const rowEl = document.createElement('div');
    rowEl.className = 'row';
    // Instrument label
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
      cell.addEventListener('click', () => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.step);
        pattern[r][c] = !pattern[r][c];
        cell.classList.toggle('active', pattern[r][c]);
      });
      rowEl.appendChild(cell);
    }
    gridEl.appendChild(rowEl);
  });
}

// Set up the play/stop controls and tempo slider. Schedule the
// Transport to step through the pattern and trigger drums when active.
function setupControls() {
  const playBtn = document.getElementById('play');
  const stopBtn = document.getElementById('stop');
  const tempoSlider = document.getElementById('tempo');
  const tempoValue = document.getElementById('tempo-value');

  let currentStep = 0;
  Tone.Transport.scheduleRepeat((time) => {
    highlightStep(currentStep);
    instruments.forEach((inst, rowIndex) => {
      if (pattern[rowIndex][currentStep]) {
        triggerDrum(inst.name, time);
      }
    });
    currentStep = (currentStep + 1) % steps;
  }, '16n');

  playBtn.addEventListener('click', async () => {
    await Tone.start();
    currentStep = 0;
    Tone.Transport.start();
    playBtn.disabled = true;
    stopBtn.disabled = false;
  });

  stopBtn.addEventListener('click', () => {
    Tone.Transport.stop();
    currentStep = 0;
    clearStepHighlight();
    playBtn.disabled = false;
    stopBtn.disabled = true;
  });

  tempoSlider.addEventListener('input', () => {
    const bpm = parseInt(tempoSlider.value);
    Tone.Transport.bpm.value = bpm;
    tempoValue.textContent = bpm;
  });
}

// Trigger a drum sound at the scheduled transport time.
function triggerDrum(name, time) {
  switch (name) {
    case 'kick':
      drumSynths.kick.triggerAttackRelease('C1', '16n', time);
      break;
    case 'snare':
      // NoiseSynth: first param is duration
      drumSynths.snare.triggerAttackRelease('16n', time);
      break;
    case 'hihat':
      drumSynths.hihat.triggerAttackRelease('C4', '16n', time);
      break;
    case 'clap':
      drumSynths.clap.triggerAttackRelease('16n', time);
      break;
    default:
      break;
  }
}

// 
