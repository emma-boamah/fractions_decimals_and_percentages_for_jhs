# Fractions, Decimals and Percentages for JHS

An interactive browser-based learning tool for Junior High School learners exploring equivalent forms of numbers.

## Activities

- **Conversion explorer:** type or adjust values to see how a fraction, decimal, and percentage represent the same value.
- **Percentage-of-a-number practice:** adjust percentage and amount, then calculate the result with a worked explanation.
- **Practice quiz:** four questions with immediate feedback, scoring, and a retry option.
- Responsive design with no build process or dependencies.

## Run locally

Open `index.html` in a current browser, or start a static server:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

In the repository, go to **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, and save. GitHub Pages will show the published URL when deployment completes.

## Topics covered

- Equivalent fractions, decimals, and percentages
- Converting between the three forms
- Finding a percentage of an amount
- Quick comparisons such as 0.75 vs 70%

## Files

- `index.html` — activities and app structure
- `styles.css` — responsive visual design
- `script.js` — conversion logic, percentage calculator, and practice quiz
