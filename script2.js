
const TIMER_SECONDS = 240;

const playIntroBtn = document.getElementById('playIntroBtn');
const introAudio = document.getElementById('introAudio');
const correctAudio = document.getElementById('correctAudio');
const incorrectAudio = document.getElementById('incorrectAudio');
const timeoutAudio = document.getElementById('timeoutAudio');

const correctSounds = [
  'correct1.mp3',
  'correct2.mp3',
  'correct3.mp3',
  'correct4.mp3'
];

const incorrectSounds = [
  'incorrect1.mp3',
  'incorrect2.mp3',
  'incorrect3.mp3',
  'incorrect4.mp3'
];

const welcomeScreen = document.getElementById('welcomeScreen');
const gameScreen = document.getElementById('gameScreen');
const congratsScreen = document.getElementById('congratsScreen');

const startGameBtn = document.getElementById('startGameBtn');

const roomTitle = document.getElementById('roomTitle');
const roomProgress = document.getElementById('roomProgress');
const roomImage = document.getElementById('roomImage');
const timerEl = document.getElementById('timer');
const enterRoomBtn = document.getElementById('enterRoomBtn');
const roomAudio = document.getElementById('roomAudio');
const congratsAudio = document.getElementById('congratsAudio');

const questionType = document.getElementById('questionType');
const questionCounter = document.getElementById('questionCounter');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const hintBtn = document.getElementById('hintBtn');
const explanationBtn = document.getElementById('explanationBtn');
const hintPanel = document.getElementById('hintPanel');
const explanationPanel = document.getElementById('explanationPanel');
const feedback = document.getElementById('feedback');

let currentRoomIndex = 0;
let currentQuestionIndex = 0;
let roomQuestions = [];
let answeredInRoom = 0;
let roomActive = false;
let timeRemaining = TIMER_SECONDS;
let timerId = null;

let lastCorrect = -1;
let lastIncorrect = -1;

let totalWrongAnswers = 0;
let totalHintsUsed = 0;
let roomTimeRecords = [];
let wrongStreak = 0;

let skipNarrationBtn = null;

function focusFirstElement(screen) {
  setTimeout(() => {
    const target = screen.querySelector('button, input, [tabindex]:not([tabindex="-1"])');
    if (target) target.focus();
  }, 50);
}

function playRandomSound(audioElement, soundArray, type) {
  if (!audioElement || !soundArray.length) return;

  let randomIndex = Math.floor(Math.random() * soundArray.length);

  if (type === 'correct') {
    while (soundArray.length > 1 && randomIndex === lastCorrect) {
      randomIndex = Math.floor(Math.random() * soundArray.length);
    }
    lastCorrect = randomIndex;
  }

  if (type === 'incorrect') {
    while (soundArray.length > 1 && randomIndex === lastIncorrect) {
      randomIndex = Math.floor(Math.random() * soundArray.length);
    }
    lastIncorrect = randomIndex;
  }

  audioElement.pause();
  audioElement.currentTime = 0;
  audioElement.src = soundArray[randomIndex] + '?v=' + Date.now();
  audioElement.load();
  audioElement.play().catch(() => {});
}

function showScreen(screen) {
  [welcomeScreen, gameScreen, congratsScreen].forEach(s => {
    s.hidden = true;
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('inert', '');
    s.classList.remove('active');
  });

  screen.hidden = false;
  screen.removeAttribute('aria-hidden');
  screen.removeAttribute('inert');
  screen.classList.add('active');

  focusFirstElement(screen);
}

function stopAudio() {
  [roomAudio, introAudio, congratsAudio, timeoutAudio].forEach(a => {
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
  });
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function resetGame() {
  currentRoomIndex = 0;
  currentQuestionIndex = 0;
  answeredInRoom = 0;
  roomActive = false;
  timeRemaining = TIMER_SECONDS;
  totalWrongAnswers = 0;
  totalHintsUsed = 0;
  roomTimeRecords = [];
  wrongStreak = 0;

  congratsScreen.innerHTML = '';

  stopTimer();
  stopAudio();
  updateRoomDots();
  loadRoom(0);
  showScreen(gameScreen);
}

function loadRoom(index) {
  const room = ESCAPE_ROOMS[index];

  roomQuestions = shuffle(ESCAPE_QUESTIONS.filter(q => q.room === room.id));

  currentQuestionIndex = 0;
  answeredInRoom = 0;
  roomActive = false;
  timeRemaining = TIMER_SECONDS;
  wrongStreak = 0;

  updateTimerDisplay();
  updateRoomDots();

  document.title = `Door ${room.id}: ${room.name} — The DAO Escape Room`;

  roomTitle.textContent = `Door ${room.id}: ${room.name}`;
  roomProgress.textContent =
    `Answer ${room.required} question${room.required === 1 ? '' : 's'} to get through the door.`;

  roomImage.style.opacity = '0';
  setTimeout(() => {
    roomImage.src = room.image;
    roomImage.alt = room.alt;
    roomImage.style.opacity = '1';
  }, 400);

  enterRoomBtn.textContent = 'GET US OUT OF HERE';
  enterRoomBtn.hidden = true;

  answerInput.value = '';
  answerInput.disabled = true;
  submitAnswerBtn.disabled = true;
  hintBtn.disabled = true;
  if (explanationBtn) explanationBtn.disabled = true;

  hintPanel.hidden = true;
  if (explanationPanel) explanationPanel.hidden = true;

  questionType.textContent = '';
  questionCounter.textContent = '';
  questionText.textContent = '';

  feedback.textContent = 'Listen to the room narration. The game will begin automatically.';
  feedback.className = 'feedback warning';

  playRoomNarration(room);
}

function playRoomNarration(room) {
  if (!roomAudio || !room.audio) {
    startRoom();
    return;
  }

  roomAudio.pause();
  roomAudio.currentTime = 0;
  roomAudio.src = room.audio;

  if (roomImage && roomImage.requestFullscreen) {
    roomImage.requestFullscreen().catch(() => {});
  }

  showSkipNarrationBtn();

  roomAudio.play().catch(() => startRoom());

  roomAudio.onended = async () => {
    removeSkipNarrationBtn();

    if (document.fullscreenElement) {
      document.addEventListener('fullscreenchange', function onFsChange() {
        document.removeEventListener('fullscreenchange', onFsChange);
        startRoom();
      }, { once: true });

      document.exitFullscreen().catch(() => startRoom());
    } else {
      startRoom();
    }
  };
}

function showSkipNarrationBtn() {
  removeSkipNarrationBtn();

  skipNarrationBtn = document.createElement('button');
  skipNarrationBtn.textContent = 'Skip narration';
  skipNarrationBtn.className = 'secondary-button skip-narration-btn';
  skipNarrationBtn.setAttribute('aria-label', 'Skip room narration and start the timer now');

  skipNarrationBtn.addEventListener('click', () => {
    roomAudio.pause();
    roomAudio.currentTime = 0;
    roomAudio.onended = null;
    removeSkipNarrationBtn();

    if (document.fullscreenElement) {
      document.addEventListener('fullscreenchange', function onFsChange() {
        document.removeEventListener('fullscreenchange', onFsChange);
        startRoom();
      }, { once: true });

      document.exitFullscreen().catch(() => startRoom());
    } else {
      startRoom();
    }
  });

  const controlsCard = document.querySelector('.controls-card');
  if (controlsCard) controlsCard.appendChild(skipNarrationBtn);
}

function removeSkipNarrationBtn() {
  if (skipNarrationBtn) {
    skipNarrationBtn.remove();
    skipNarrationBtn = null;
  }
}

function renderQuestion(animate = false) {
  const q = roomQuestions[currentQuestionIndex];
  const room = ESCAPE_ROOMS[currentRoomIndex];
  if (!q) return;

  const qaCard = document.querySelector('.qa-card');

  const doRender = () => {
    // questionType.textContent = q.category || q.type || '';

    questionCounter.textContent =
      `Question ${currentQuestionIndex + 1} of ${room.required} needed in this room`;

    questionText.textContent = q.question;

    answerInput.setAttribute('aria-label', `Your answer. Question: ${q.question}`);
    answerInput.setAttribute('aria-describedby', 'questionText');

    hintPanel.hidden = true;
    hintPanel.textContent = q.hint || '';

    if (explanationPanel) {
      explanationPanel.hidden = true;
      explanationPanel.textContent = q.explanation || '';
    }

    wrongStreak = 0;

    feedback.textContent = '';
    feedback.className = 'feedback';

    if (animate && qaCard) {
      qaCard.style.opacity = '1';
    }
  };

  if (animate && qaCard) {
    qaCard.style.opacity = '0';
    qaCard.style.transition = 'opacity 0.25s ease';
    setTimeout(() => {
      doRender();
    }, 250);
  } else {
    doRender();
  }
}

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isAnswerCorrect(answer, keywords) {
  const normalized = normalizeText(answer);
  return keywords.some(keyword => normalized.includes(normalizeText(keyword)));
}

function getProgressMessage(answered, required) {
  if (required === 3) {
    if (answered === 1) return 'Correct. The lock has loosened.';
    if (answered === 2) return 'We are getting close.';
    if (answered === 3) return 'Yes. We are through.';
  }

  if (required === 4) {
    if (answered === 1) return 'Correct. First lock loosened.';
    if (answered === 2) return 'We are making progress.';
    if (answered === 3) return 'One more push.';
    if (answered === 4) return 'Yes. We are through.';
  }

  return 'Correct.';
}

function submitAnswer() {
  const q = roomQuestions[currentQuestionIndex];
  const answer = answerInput.value;
  if (!q) return;

  if (isAnswerCorrect(answer, q.acceptedKeywords)) {
    playRandomSound(correctAudio, correctSounds, 'correct');

    answeredInRoom++;
    wrongStreak = 0;

    const needed = ESCAPE_ROOMS[currentRoomIndex].required;
    feedback.textContent = getProgressMessage(answeredInRoom, needed);
    feedback.className = 'feedback success';

    if (answeredInRoom >= needed) {
      unlockRoom();
      return;
    }

    currentQuestionIndex++;
    answerInput.value = '';
    answerInput.disabled = true;
    submitAnswerBtn.disabled = true;

    setTimeout(() => {
      answerInput.disabled = false;
      submitAnswerBtn.disabled = false;
      renderQuestion(true);
      answerInput.focus();
    }, 1400);

  } else {
    playRandomSound(incorrectAudio, incorrectSounds, 'incorrect');

    totalWrongAnswers++;
    wrongStreak++;

    feedback.textContent = 'Try again.';
    feedback.className = 'feedback error';

    if (wrongStreak >= 2 && hintPanel.hidden) {
      hintPanel.hidden = false;
      totalHintsUsed++;
      feedback.textContent = 'Try again. Hint revealed — press H to toggle.';
    }

    answerInput.value = '';
    answerInput.focus();
  }
}

function unlockRoom() {
  stopTimer();

  const timeTaken = TIMER_SECONDS - timeRemaining;
  roomTimeRecords.push({ id: ESCAPE_ROOMS[currentRoomIndex].id, seconds: timeTaken });

  answerInput.disabled = true;
  submitAnswerBtn.disabled = true;
  hintBtn.disabled = true;
  if (explanationBtn) explanationBtn.disabled = true;

  updateRoomDots(currentRoomIndex);

  if (currentRoomIndex === ESCAPE_ROOMS.length - 1) {
    feedback.textContent = 'Door 6 unlocked. You escaped!';
    feedback.className = 'feedback success';
    setTimeout(showCongrats, 150);
  } else {
    const nextRoom = ESCAPE_ROOMS[currentRoomIndex + 1];
    feedback.textContent = `Door ${ESCAPE_ROOMS[currentRoomIndex].id} unlocked. Moving to Door ${nextRoom.id}…`;
    feedback.className = 'feedback success';

    setTimeout(() => {
      currentRoomIndex++;
      loadRoom(currentRoomIndex);
    }, 900);
  }
}

function updateRoomDots(justCompletedIndex = -1) {
  const dotsEl = document.getElementById('roomDots');
  if (!dotsEl) return;

  dotsEl.innerHTML = '';

  ESCAPE_ROOMS.forEach((room, i) => {
    const item = document.createElement('li');

    item.className = 'room-dot';
    item.setAttribute('role', 'listitem');

    let srText = '';

    if (i < currentRoomIndex || i === justCompletedIndex) {
      item.classList.add('room-dot--done');
      item.innerHTML = '<span aria-hidden="true">✓</span>';
      srText = `Door ${room.id} completed`;

    } else if (i === currentRoomIndex) {
      item.classList.add('room-dot--active');
      item.setAttribute('aria-current', 'step');
      item.innerHTML = `<span aria-hidden="true">${room.id}</span>`;
      srText = `Door ${room.id} current door`;

    } else {
      item.classList.add('room-dot--future');
      item.innerHTML = `<span aria-hidden="true">${room.id}</span>`;
      srText = `Door ${room.id} not yet reached`;
    }

    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = srText;

    item.appendChild(sr);
    dotsEl.appendChild(item);
  });
}

function showCongrats() {
  document.title = 'You escaped! — The DAO Escape Room';
  const totalTime = roomTimeRecords.reduce((sum, r) => sum + r.seconds, 0);
  const mins = Math.floor(totalTime / 60);
  const secs = totalTime % 60;
  const fastestRoom = roomTimeRecords.length
    ? roomTimeRecords.reduce((a, b) => a.seconds < b.seconds ? a : b)
    : null;

  // Render the congrats screen with the image already in the DOM
  congratsScreen.innerHTML = `
    <div class="card congrats-card">
      <h1 id="congratsTitle">Congratulations</h1>
      <img id="congratsImg"
        src="images/congrats.jpg"
        alt="A peaceful oasis garden with flowers, chairs, lake, and sunshine.">
      <p class="lead">Digital Accessibility Office Oasis. This is where we rest.</p>
      <p>You escaped every room.</p>
      <div class="game-stats" aria-label="Your results">
        <div class="stat-grid">
          <div class="stat-item">
            <span class="stat-value">${mins}m ${secs}s</span>
            <span class="stat-label">Total time</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${totalWrongAnswers}</span>
            <span class="stat-label">Wrong answers</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${totalHintsUsed}</span>
            <span class="stat-label">Hints used</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">${fastestRoom ? 'Door ' + fastestRoom.id : '—'}</span>
            <span class="stat-label">Fastest room</span>
          </div>
        </div>
      </div>
      <div class="button-row congrats-buttons">
        <button id="playAgainBtn" class="primary-button">Play Again</button>
      </div>
    </div>
  `;
  showScreen(congratsScreen);

  const congratsImg = document.getElementById('congratsImg');

  // Mirror playRoomNarration: call requestFullscreen on the image, play audio, exit on ended
  if (congratsImg && congratsImg.requestFullscreen) {
    congratsImg.requestFullscreen().catch(() => {});
  }

  if (congratsAudio) {
    congratsAudio.pause();
    congratsAudio.currentTime = 0;
    congratsAudio.play().catch(() => {});

    congratsAudio.onended = () => {
      if (document.fullscreenElement) {
        document.addEventListener('fullscreenchange', function onFsChange() {
          document.removeEventListener('fullscreenchange', onFsChange);
        }, { once: true });
        document.exitFullscreen().catch(() => {});
      }
    };
  }
}

function startRoom() {
  if (roomActive) return;
  roomActive = true;

  removeSkipNarrationBtn();
  enterRoomBtn.hidden = true;

  answerInput.disabled = false;
  submitAnswerBtn.disabled = false;
  hintBtn.disabled = false;
  if (explanationBtn) explanationBtn.disabled = false;

  renderQuestion();

  feedback.textContent = 'The timer has started. Escape through the door.';
  feedback.className = 'feedback warning';

  startTimer();

  setTimeout(() => {
    answerInput.focus();
    answerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 150);
}

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function updateTimerDisplay() {
  timerEl.textContent = formatTime(timeRemaining);
}

function beep(duration = 0.08, frequency = 880, volume = 0.03) {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
    oscillator.onended = () => context.close();
  } catch (err) {}
}

function startTimer() {
  stopTimer();
  updateTimerDisplay();

  timerId = setInterval(() => {
    timeRemaining--;

    if (timeRemaining <= 30) {
      timerEl.classList.add('timer-urgent');
    }

    if (timeRemaining <= 10 && timeRemaining > 0) {
      beep(0.06, 920, 0.04);
    }

    if (timeRemaining <= 0) {
      timeRemaining = 0;
      updateTimerDisplay();
      timerEl.classList.remove('timer-urgent');

      if (timeoutAudio) {
        timeoutAudio.pause();
        timeoutAudio.currentTime = 0;
        timeoutAudio.play().catch(() => {});
      }

      stopTimer();
      roomTimedOut();
      return;
    }

    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  timerEl.classList.remove('timer-urgent');
}

function roomTimedOut() {
  stopTimer();
  roomActive = false;
  timeRemaining = TIMER_SECONDS;

  answerInput.disabled = true;
  submitAnswerBtn.disabled = true;
  hintBtn.disabled = true;
  if (explanationBtn) explanationBtn.disabled = true;

  enterRoomBtn.hidden = false;
  feedback.textContent = 'Time is up. Press GET US OUT OF HERE to restart this room.';
  feedback.className = 'feedback error';

  answerInput.value = '';
  enterRoomBtn.focus();
}

playIntroBtn?.addEventListener('click', () => {
  introAudio.currentTime = 0;
  introAudio.play().catch(() => {});
});

startGameBtn?.addEventListener('click', () => {
  stopAudio();
  resetGame();
});

congratsScreen?.addEventListener('click', e => {
  if (e.target.id === 'playAgainBtn') {
    stopAudio();
    stopTimer();
    resetGame();
  }
});

enterRoomBtn?.addEventListener('click', () => {
  stopTimer();
  if (timeoutAudio) {
    timeoutAudio.pause();
    timeoutAudio.currentTime = 0;
  }
  if (roomAudio) {
    roomAudio.pause();
    roomAudio.currentTime = 0;
  }
  if (!roomActive) startRoom();
});

submitAnswerBtn?.addEventListener('click', submitAnswer);

answerInput?.addEventListener('keydown', e => {
  if (feedback.textContent.startsWith('Try again')) {
    feedback.textContent = '';
    feedback.className = 'feedback';
  }

  if (e.key === 'Enter' && !submitAnswerBtn.disabled) {
    submitAnswer();
  }
});

hintBtn?.addEventListener('click', () => {
  if (hintPanel.hidden) totalHintsUsed++;
  hintPanel.hidden = !hintPanel.hidden;
});

explanationBtn?.addEventListener('click', () => {
  explanationPanel.hidden = !explanationPanel.hidden;
});

updateRoomDots();
showScreen(welcomeScreen);
