// Byte‑Sized Brains puzzle logic
// A list of puzzles.  Each puzzle has a question, an array of options and the index
// of the correct option.  You can extend this list with more entries; the
// `getTodayIndex` function will select a puzzle based on the current date.
const puzzles = [
  {
    question: "Which number completes the pattern: 2, 4, 6, ?, 10?",
    options: ["7", "8", "9", "12"],
    answerIndex: 1,
    explanation: "The pattern is even numbers increasing by 2."
  },
  {
    question: "What word becomes shorter when you add two letters to it?",
    options: ["Short", "Tall", "Tiny", "Large"],
    answerIndex: 0,
    explanation: "Adding \"er\" to \"short\" makes \"shorter\"."
  },
  {
    question: "A farmer has 17 sheep and all but 9 die. How many are left?",
    options: ["8", "9", "17", "None"],
    answerIndex: 1,
    explanation: "All but nine die, so nine remain."
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answerIndex: 1,
    explanation: "Mars is often called the Red Planet."
  },
  {
    question: "If you rearrange the letters of 'LISTEN', you get another English word. What is it?",
    options: ["Silent", "Listen", "Inlets", "Tinsel"],
    answerIndex: 0,
    explanation: "'Silent' uses all the letters in 'listen'."
  }
];

// Choose a puzzle index based on today's date.  Converting the date string to
// a number provides a simple deterministic seed so everyone sees the same
// puzzle on a given day.
function getTodayIndex() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const num = parseInt(dateStr, 10);
  return num % puzzles.length;
}

// Load today’s puzzle into the DOM and attach event handlers for the options
// and reveal button.
function loadPuzzle() {
  const idx = getTodayIndex();
  const puzzle = puzzles[idx];
  const questionEl = document.getElementById("puzzle-question");
  const optionsList = document.getElementById("options-list");
  const answerEl = document.getElementById("puzzle-answer");
  const revealButton = document.getElementById("show-answer");

  questionEl.textContent = puzzle.question;
  answerEl.textContent = `Answer: ${puzzle.options[puzzle.answerIndex]} – ${puzzle.explanation}`;
  answerEl.classList.add("hidden");

  // Clear previous options
  optionsList.innerHTML = "";

  // Create list items for each option
  puzzle.options.forEach((option, i) => {
    const li = document.createElement("li");
    li.textContent = option;
    li.className = "option";
    li.dataset.index = i;
    li.addEventListener("click", () => handleAnswer(puzzle, i, li));
    optionsList.appendChild(li);
  });

  // Reveal button shows the answer without affecting stats
  revealButton.onclick = () => {
    answerEl.classList.remove("hidden");
  };
}

// Handle answer selection
function handleAnswer(puzzle, selectedIndex, liElement) {
  // Prevent multiple selections
  const optionsList = document.getElementById("options-list");
  optionsList.querySelectorAll("li").forEach((li) => {
    li.removeEventListener("click", () => {});
    li.classList.add("disabled");
  });

  const answerEl = document.getElementById("puzzle-answer");
  answerEl.classList.remove("hidden");

  if (selectedIndex === puzzle.answerIndex) {
    liElement.classList.add("correct");
    updateScore(true);
  } else {
    liElement.classList.add("incorrect");
    // Highlight the correct answer
    const correctLi = optionsList.children[puzzle.answerIndex];
    correctLi.classList.add("correct");
    updateScore(false);
  }
}

// Update the user's stats stored in localStorage and refresh the scoreboard
function updateScore(correct) {
  const today = new Date().toISOString().slice(0, 10);
  let streak = parseInt(localStorage.getItem("streak") || "0", 10);
  let correctCount = parseInt(localStorage.getItem("correctCount") || "0", 10);
  const lastDate = localStorage.getItem("lastDate");

  if (correct) {
    correctCount += 1;
    // If the user answered correctly on consecutive days, increment the streak
    if (lastDate) {
      const diffDays = Math.floor((new Date(today) - new Date(lastDate)) / 86400000);
      if (diffDays === 1) {
        streak += 1;
      } else if (diffDays === 0) {
        // same day; do not change streak
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }
    localStorage.setItem("lastDate", today);
    localStorage.setItem("streak", streak.toString());
    localStorage.setItem("correctCount", correctCount.toString());
  } else {
    // Incorrect answer resets the streak but still updates lastDate
    localStorage.setItem("lastDate", today);
    localStorage.setItem("streak", "0");
  }
  updateScoreboard();
}

// Refresh the scoreboard display from localStorage
function updateScoreboard() {
  const streak = localStorage.getItem("streak") || "0";
  const correctCount = localStorage.getItem("correctCount") || "0";
  document.getElementById("streak").textContent = streak;
  document.getElementById("correct-count").textContent = correctCount;
}

// Initialize the page once the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  loadPuzzle();
  updateScoreboard();
});