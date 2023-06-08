var currentPressedNotes = []
var currentTargetChord = getRandomChord()

// Check if Web MIDI API is supported
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);
} else {
  alert('Web MIDI API is not supported in your browser.');
}

// MIDI success callback
function onMIDISuccess(midiAccess) {
  // Get the first available MIDI input
  console.log("Success!")
  const inputs = midiAccess.inputs.values();
  for (let input of inputs) {
    input.onmidimessage = getMIDIMessage;
  }
}

// MIDI failure callback
function onMIDIFailure() {
  alert('Failed to access MIDI devices.');
}

// Process MIDI messages
function getMIDIMessage(event) {
  const [status, note, velocity] = event.data;
  const noteName = getNoteName(note);
  // Check if it's a Note On event
  if (status === 144 && velocity > 0) {
    if (!currentPressedNotes.includes(noteName)) {
      currentPressedNotes.push(noteName)
    }
  }
  // Chekc if itś an Note Off event
  else if (status === 128 || velocity == 0) {
    const index = currentPressedNotes.indexOf(noteName)

    currentPressedNotes.splice(index, 1)
  }
  else {
    console.log(status)
  }
  displayCurrentPressedNotes(currentPressedNotes);
}

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
// Convert MIDI note number to note name
function getNoteName(note) {
  const octave = Math.floor(note / 12) - 1;
  const noteName = notes[note % 12];
  return `${noteName}${octave}`;
}

function getRelativeNote(note, deltaHalfSteps) {
  if (deltaHalfSteps < 0)
    return getRelativeNote(note, deltaHalfSteps + 12)
  return notes[(notes.indexOf(note) + deltaHalfSteps) % 12]
}


// Display the pressed notes names
function displayCurrentPressedNotes(currentPressedNotes) {
  const outputElement = document.getElementById('midi-output');
  outputElement.textContent = `Current note: ${currentPressedNotes}`;
  if (isCurrentChordCorrect()) {
    outputElement.classList.add("correct")
    console.log("correct!")
  }
  else if (outputElement.classList.contains('correct')) {
    outputElement.classList.remove("correct")
    getRandomChord()
  }
}

// Get random chord
function getRandomChord() {
  const rootNote = getRandomNote();
  const chordType = getRandomChordType();
  const chordAlterations = getRandomChordAlterations();
  currentTargetChord = { rootNote, chordType, chordAlterations }
  updateTargetChordOnPage(currentTargetChord)
  return currentTargetChord;
}

function getRandomNote() {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
}

function getRandomChordType() {
  // const chordTypes = ['maj', 'min', 'dim', 'aug', 'sus2', 'sus4', '7', 'maj7', 'min7', 'dim7', 'aug7'];
  const chordTypes = ['', 'm', 'o', '7', 'm7', 'o7', 'M7']
  const randomIndex = Math.floor(Math.random() * chordTypes.length);
  return chordTypes[randomIndex];
}

function getRandomChordAlterations() {
  const chordAlterations = ['', 'b5', '#5', 'b9', '#9', '11', 'b13'];
  const randomIndex = Math.floor(Math.random() * chordAlterations.length);
  // return chordAlterations[randomIndex];
  return '';
}

function updateTargetChordOnPage(newChord) {
  const outputElement = document.getElementById('note');
  outputElement.textContent = `${newChord.rootNote}${newChord.chordType}${newChord.chordAlterations}`;
}

function verify(notesToBeChecked, note) {
  const index = notesToBeChecked.indexOf(note)
  if (index >= 0) {
    return true
  }
  return false
}

function isCurrentChordCorrect() {
  const notesToBeChecked = []
  for (var i = 0; i < currentPressedNotes.length; i++) {
    notesToBeChecked.push(currentPressedNotes[i].slice(0, -1))
  }
  console.log(notesToBeChecked)
  // verify root note
  console.log('verify root')
  if (!verify(notesToBeChecked, currentTargetChord.rootNote))
    return false
  'asd'.contains

  // verify 3rd
  console.log('verify 3rd')
  if (currentTargetChord.chordType.includes('m') || currentTargetChord.chordType.includes('o')) {
    if (!verify(notesToBeChecked, getRelativeNote(currentTargetChord.rootNote, 3)))
      return false
  }
  else
    if (!verify(notesToBeChecked, getRelativeNote(currentTargetChord.rootNote, 4)))
      return false

  // verify dimished fifth
  console.log('verify fifth')
  if (currentTargetChord.chordType.includes('o'))
    if (!verify(notesToBeChecked, getRelativeNote(currentTargetChord.rootNote, 6)))
      return false

  // verify major seventh
  console.log('verify M7/7')
  if (currentTargetChord.chordType == 'M7') {
    if (!verify(notesToBeChecked, getRelativeNote(currentTargetChord.rootNote, -1)))
      return false
  }
  else if (currentTargetChord.chordType.includes('7'))
    if (!verify(notesToBeChecked, getRelativeNote(currentTargetChord.rootNote, -2)))
      return false
  console.log('all verified')
  return true
}

// Button click event
const randomButton = document.getElementById('random-button');
randomButton.addEventListener('click', function () {

  console.log(getRandomChord());
});

