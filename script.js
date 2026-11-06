const $ = (selector) => document.querySelector(selector);

function formatDecimal(value) {
  if (Number.isInteger(value)) return value.toString();
  return Number(value.toFixed(3)).toString();
}
function parseFractionInput(input) {
  const match = input.trim().match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (!match) return null;
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (denominator === 0) return null;
  return { numerator, denominator };
}
function convertFromFraction(fraction) {
  const decimal = fraction.numerator / fraction.denominator;
  const percent = decimal * 100;
  return { decimal, percent };
}
function setEquivalentDisplay(fractionValue, decimalValue, percentValue) {
  const fractionText = `${fractionValue.numerator}/${fractionValue.denominator}`;
  const decimalText = formatDecimal(decimalValue);
  const percentText = `${formatDecimal(percentValue)}%`;
  $('#equivalent-summary').textContent = `${fractionText} = ${decimalText} = ${percentText}`;
  $('.fraction-piece').forEach ? null : null;
}
function normaliseFraction(numerator, denominator) {
  if (denominator < 0) {
    numerator *= -1;
    denominator *= -1;
  }
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}
function updateConversions() {
  const fractionInput = $('#fraction-input').value.trim();
  const decimalInput = Number($('#decimal-input').value);
  const percentInput = Number($('#percent-input').value);

  const fraction = parseFractionInput(fractionInput);
  const hasFraction = fraction !== null;
  const hasDecimal = !Number.isNaN(decimalInput);
  const hasPercent = !Number.isNaN(percentInput);

  let numerator = 1;
  let denominator = 2;
  let decimal = 0.5;
  let percent = 50;

  if (hasFraction) {
    const value = convertFromFraction(fraction);
    decimal = value.decimal;
    percent = value.percent;
    numerator = fraction.numerator;
    denominator = fraction.denominator;
  } else if (hasDecimal) {
    decimal = decimalInput;
    percent = decimal * 100;
    const normalized = normaliseFraction(Math.round(decimal * 100), 100);
    numerator = normalized.numerator;
    denominator = normalized.denominator;
  } else if (hasPercent) {
    percent = percentInput;
    decimal = percent / 100;
    const normalized = normaliseFraction(Math.round(decimal * 100), 100);
    numerator = normalized.numerator;
    denominator = normalized.denominator;
  }

  const safeFraction = normaliseFraction(numerator, denominator);
  const finalFraction = `${safeFraction.numerator}/${safeFraction.denominator}`;
  const finalDecimal = formatDecimal(decimal);
  const finalPercent = `${formatDecimal(percent)}%`;
  $('#fraction-input').value = finalFraction;
  $('#decimal-input').value = finalDecimal;
  $('#percent-input').value = formatDecimal(percent);
  $('#equivalent-summary').textContent = `${finalFraction} = ${finalDecimal} = ${finalPercent}`;

  const filledCount = Math.min(4, Math.max(1, Math.round(Math.abs(decimal) * 4)));
  const pieces = document.querySelectorAll('.fraction-piece');
  pieces.forEach((piece, index) => piece.classList.toggle('filled', index < filledCount));
  if (percent < 0 || percent > 100) {
    $('#equivalent-summary').textContent = 'Values should be between 0 and 100%.';
  }
}
$('#fraction-input').addEventListener('change', updateConversions);
$('#decimal-input').addEventListener('input', () => {
  const value = Number($('#decimal-input').value);
  if (!Number.isNaN(value)) {
    $('#fraction-input').value = `${normaliseFraction(Math.round(value * 100), 100).numerator}/${normaliseFraction(Math.round(value * 100), 100).denominator}`;
    $('#percent-input').value = formatDecimal(value * 100);
    updateConversions();
  }
});
$('#percent-input').addEventListener('input', () => {
  const value = Number($('#percent-input').value);
  if (!Number.isNaN(value)) {
    const decimal = value / 100;
    const fraction = normaliseFraction(Math.round(decimal * 100), 100);
    $('#fraction-input').value = `${fraction.numerator}/${fraction.denominator}`;
    $('#decimal-input').value = formatDecimal(decimal);
    updateConversions();
  }
});
$('#share-fraction').addEventListener('click', () => {
  const fraction = parseFractionInput($('#fraction-input').value);
  if (!fraction) return;
  const value = convertFromFraction(fraction);
  $('#decimal-input').value = formatDecimal(value.decimal);
  $('#percent-input').value = formatDecimal(value.percent);
  updateConversions();
});
$('#share-decimal').addEventListener('click', () => {
  const decimal = Number($('#decimal-input').value);
  if (Number.isNaN(decimal)) return;
  const fraction = normaliseFraction(Math.round(decimal * 100), 100);
  $('#fraction-input').value = `${fraction.numerator}/${fraction.denominator}`;
  $('#percent-input').value = formatDecimal(decimal * 100);
  updateConversions();
});
$('#share-percent').addEventListener('click', () => {
  const percent = Number($('#percent-input').value);
  if (Number.isNaN(percent)) return;
  const decimal = percent / 100;
  const fraction = normaliseFraction(Math.round(decimal * 100), 100);
  $('#fraction-input').value = `${fraction.numerator}/${fraction.denominator}`;
  $('#decimal-input').value = formatDecimal(decimal);
  updateConversions();
});

function updatePercentage() {
  const percent = Number($('#percent-slider').value);
  const amount = Number($('#amount-input').value);
  const result = (percent / 100) * amount;
  $('#percent-result').textContent = formatDecimal(result);
  $('#percent-question').textContent = `Find ${percent}% of ${amount}`;
  $('#percent-method').textContent = `${percent}% = ${percent}/100 = ${formatDecimal(percent / 100)}, so ${formatDecimal(percent / 100)} × ${amount} = ${formatDecimal(result)}`;
}
$('#percent-slider').addEventListener('input', updatePercentage);
$('#amount-input').addEventListener('input', updatePercentage);
updatePercentage();
updateConversions();

const questions = [
  { text: 'Which fraction is equivalent to 0.5?', options: ['1/3', '1/2', '3/4', '2/3'], answer: 1, explanation: '0.5 means half, which is 1/2.' },
  { text: 'What is 25% as a decimal?', options: ['0.25', '2.5', '0.025', '25'], answer: 0, explanation: 'Percent means “out of 100,” so 25% = 25/100 = 0.25.' },
  { text: 'What is 30% of 60?', options: ['12', '18', '20', '30'], answer: 1, explanation: '30% = 0.3, and 0.3 × 60 = 18.' },
  { text: 'Which is greater: 0.75 or 70%?', options: ['0.75 is less', 'They are equal', '0.75 is greater', 'Cannot compare'], answer: 2, explanation: '0.75 = 75%, and 75% > 70%.' }
];
let questionIndex = 0; let selectedAnswer = null; let score = 0; let answered = false;
const answers = $('#answers'); const action = $('#quiz-action');
function renderQuestion() {
  const item = questions[questionIndex];
  $('#quiz-count').textContent = `QUESTION ${questionIndex + 1} OF ${questions.length}`;
  $('#progress-fill').style.width = `${(questionIndex + 1) / questions.length * 100}%`;
  $('#question').textContent = item.text;
  $('#feedback').textContent = ''; $('#feedback').className = 'feedback';
  $('#score').textContent = `Score: ${score}`;
  answers.replaceChildren(); selectedAnswer = null; answered = false;
  item.options.forEach((text, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'answer'; button.textContent = text;
    button.addEventListener('click', () => {
      if (answered) return;
      selectedAnswer = index;
      answers.querySelectorAll('button').forEach((choice) => choice.classList.toggle('selected', choice === button));
      action.disabled = false; action.textContent = 'Check answer';
    });
    answers.append(button);
  });
  action.disabled = true; action.textContent = 'Check answer'; action.dataset.retry = 'false';
}
action.addEventListener('click', () => {
  if (action.dataset.retry === 'true') { questionIndex = 0; score = 0; renderQuestion(); return; }
  if (!answered) {
    if (selectedAnswer === null) return;
    answered = true; const item = questions[questionIndex]; const correct = selectedAnswer === item.answer;
    if (correct) score++;
    answers.querySelectorAll('button').forEach((button, index) => { button.disabled = true; if (index === item.answer) button.classList.add('correct'); else if (index === selectedAnswer) button.classList.add('incorrect'); });
    $('#feedback').textContent = `${correct ? 'Correct!' : 'Not quite.'} ${item.explanation}`;
    $('#feedback').classList.add(correct ? 'good' : 'bad'); $('#score').textContent = `Score: ${score}`;
    action.textContent = questionIndex === questions.length - 1 ? 'See results' : 'Next question';
  } else if (questionIndex < questions.length - 1) { questionIndex++; renderQuestion(); }
  else {
    $('#quiz-count').textContent = 'QUIZ COMPLETE'; $('#progress-fill').style.width = '100%';
    $('#question').textContent = score === questions.length ? 'Fantastic work—you’ve got this!' : score >= 3 ? 'Great job—you’re strong in number sense!' : 'Good try! Try the activities again and have another go.';
    answers.replaceChildren(); $('#feedback').textContent = `You scored ${score} out of ${questions.length}.`; $('#feedback').className = 'feedback good';
    action.textContent = 'Try again'; action.disabled = false; action.dataset.retry = 'true';
  }
});
renderQuestion();
