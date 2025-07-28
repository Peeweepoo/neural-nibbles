# Neural Nibbles Website

This directory contains a simple prototype of **Neural Nibbles**, a fictional web business that delivers daily micro-challenges. The site is designed to be static so it can be hosted cheaply on platforms like Netlify or GitHub Pages. It demonstrates how you might structure the pages, style them, and implement basic client-side logic for delivering a new puzzle each day and tracking your streaks using the browser’s `localStorage`.

## Files
- "*index.html*" – The home page showing the day’s puzzle, multiple-choice options, a button to reveal the answer, basic score tracking and placeholders for ads.
- "*script.js*" – JavaScript that selects today’s puzzle, handles answer checking, and updates stats in `localStorage`.
- "*style.css*" – Lightweight CSS to give the site a clean, modern look.
- "*blog.html*" – A sample blog page. In a real deployment, you’d fill this with articles about learning, brain health and productivity.
- "*about.html*" – A brief page describing the Neural Nibbles concept.

## Running locally

No backend server is required for this prototype. You can open `index.html` directly in a browser or serve the directory with a simple HTTP server to avoid CORS issues:

```bash
# from within this 'neural_nibbles_site' directory
python3 -m http.server 8000
# then visit http://localhost:8000/index.html in your browser
```

## Customizing puzzles

The list of puzzles lives near the top of **script.js**. Each puzzle is an object containing a `question`, an array of `options`, and the index of the correct answer (`answerIndex`). You can add as many puzzles as you like. The function `getTodayIndex()` deterministically selects a puzzle based on the current date, so all visitors see the same challenge each day.

To reset your personal statistics (streak and total correct answers), clear your browser’s localStorage for this site.

## Deploying

Because this is a static site, you can deploy it on any static hosting platform (GitHub Pages, Netlify, Vercel, AWS S3/CloudFront, etc.). Simply upload the contents of the `neural_nibbles_site` folder.
