
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const scenes = $$('.scene');
  const particleLayer = $('#particle-layer');
  let biteCount = 0, letterTimer = null, typeIndex = 0, audioFallback = null, runawayCount = 0;
  let activeVoice = null;

  const floatingSymbols = ['♡','💖','✨','💫','✧','🌸','💕'];

  function spawnParticle(symbol) {
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = symbol || floatingSymbols[Math.floor(Math.random() * floatingSymbols.length)];
    el.style.left = `${Math.random() * 100}%`;
    el.style.setProperty('--duration', `${8 + Math.random() * 9}s`);
    el.style.setProperty('--size', `${12 + Math.random() * 18}px`);
    particleLayer.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  for (let i = 0; i < 18; i++) setTimeout(() => spawnParticle(), i * 240);
  setInterval(() => {
    if (particleLayer.childElementCount < 26) spawnParticle();
  }, 900);

  function showScene(id) {
    scenes.forEach(scene => scene.classList.remove('active'));
    const target = document.getElementById(id);
    if (!target) return;
    target.classList.remove('active');
    void target.offsetWidth;
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function tryPlay(audio, { loop = false } = {}) {
    if (!audio) return Promise.resolve(false);
    audio.loop = loop;
    const result = audio.play();

    if (result && typeof result.then === 'function') {
      return result.then(() => true).catch(() => false);
    }

    return Promise.resolve(true);
  }

  function stopAudio(audio) {
    if (!audio) return;
    audio.pause();
    try {
      audio.currentTime = 0;
    } catch (_) {}
  }

  function startBackgroundMusic() {
    const music = $('#background-music');
    tryPlay(music, { loop: true });
  }

  function particlesBurst(count = 30, symbols = ['💖','✨','💕','♡']) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'particle burst-particle';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = `${35 + Math.random() * 30}%`;
      el.style.bottom = `${20 + Math.random() * 25}%`;
      el.style.setProperty('--duration', `${1.2 + Math.random() * 1.5}s`);
      el.style.setProperty('--size', `${14 + Math.random() * 20}px`);
      el.style.animationName = 'float-up';
      particleLayer.appendChild(el);
      setTimeout(() => el.remove(), 2900);
    }
  }

  function withAudioCompletion(audio, fallbackMs, callback) {
    if (audioFallback) clearTimeout(audioFallback);
    let fired = false;

    const finish = () => {
      if (fired) return;
      fired = true;
      if (audioFallback) clearTimeout(audioFallback);
      audio.removeEventListener('ended', finish);
      callback();
    };

    audio.addEventListener('ended', finish, { once: true });
    audioFallback = setTimeout(finish, fallbackMs);

    tryPlay(audio).then(played => {
      if (!played) setTimeout(finish, Math.min(1000, fallbackMs));
    });
  }

  // PAGE 1: Open the book and start background music
  $('#open-book').addEventListener('click', () => {
    startBackgroundMusic();
    const book = $('#open-book');
    book.classList.add('opening');
    setTimeout(() => showScene('scene-2'), 720);
  });

  // PAGE 2: Stop background music when moving to PAGE 3
  $('#blow-button').addEventListener('click', () => {
    startBackgroundMusic();
    $('#candle-flame').classList.add('out');
    $('#smoke').classList.remove('hidden');
    $('#wish-copy').textContent = 'Wish sent to the stars… 💫';
    $('#blow-button').disabled = true;
    $('#blow-button').textContent = 'Wish made! 💖';

    particlesBurst(18, ['💨','✨','💖']);

    setTimeout(() => {
      const bgMusic = $('#background-music');
      stopAudio(bgMusic);
      showScene('scene-3');
    }, 1350);
  });

  $('#bite-cake').addEventListener('click', async () => {
    const cake = $('#bite-cake');
    biteCount++;

    const biteSound = $('#bite-audio');
    stopAudio(biteSound);
    await tryPlay(biteSound);

    if (biteCount === 1) {
      cake.classList.add('half');
      $('#bite-subtitle').textContent = 'Mmm… one bite down! 🍰';
      $('#bite-dot-2').classList.add('active-dot');
      particlesBurst(12, ['🍰','✨','♡']);
    } else {
      cake.classList.add('gone');
      $('#bite-subtitle').textContent = 'All gone… but wait, a little surprise! 💝';
      particlesBurst(34, ['💖','✨','💕','💫']);
      setTimeout(() => showScene('scene-4'), 950);
    }
  });

  $('#open-gift').addEventListener('click', () => {
    const gift = $('#open-gift');
    if (gift.dataset.opened === 'true') return;

    gift.dataset.opened = 'true';
    gift.classList.add('opened');
    $('#gift-instruction').textContent = 'For the person who makes my heart sparkle…';

    setTimeout(() => {
      gift.classList.add('hidden');
      $('#ring-reveal').classList.remove('hidden');
      $('#audio-pulse').classList.remove('hidden');

      const ringAudio = $('#ring-audio');

      withAudioCompletion(ringAudio, 3000, () => {
        $('#audio-pulse').classList.add('paused');
        $('#proposal-actions').classList.remove('hidden');
      });
    }, 650);
  });

  const noButton = $('#no-button');

  function moveNoButton(event) {
    if (event) event.preventDefault();

    runawayCount++;
    const container = $('#proposal-actions');
    const box = container.getBoundingClientRect();
    const maxX = Math.max(10, Math.min(window.innerWidth - 110, box.width + 70));
    const x = Math.max(-Math.min(90, box.left), Math.random() * maxX - box.width / 2);
    const y = (Math.random() * 140) - 70;

    noButton.style.position = 'relative';
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
    noButton.style.transform = `rotate(${Math.random() * 14 - 7}deg)`;
    noButton.textContent = runawayCount % 2 ? 'Too slow 😜' : 'Nope! 💨';
  }

  noButton.addEventListener('pointerenter', moveNoButton);
  noButton.addEventListener('pointerdown', moveNoButton);
  noButton.addEventListener('touchstart', moveNoButton, { passive: false });
  noButton.addEventListener('click', event => {
    event.preventDefault();
    moveNoButton(event);
  });

 const letterText = "Meri jaan, ❤️🥹 Pata hai, tu duniya ki saari khushiyan deserve karti hai. 🫶🏻 Tu deserve karti hai ki teri life mein hamesha smile ho, sukoon ho aur tujhe kabhi apni khushi ke liye struggle na karna pade. Kaash main tujhe duniya ki har khushi de pata aur tere saare dukh door kar pata. Tu mere liye bahut special hai, aur main bas tujhe hamesha khush dekhna chahta hoon. 🥹❤️ Kabhi khud ko kam mat samajhna, meri jaan. Tu bahut precious hai aur tu duniya ke saare pyaar aur happiness ki haqdar hai. 💗🧿 I wish teri life hamesha beautiful rahe aur teri har wish poori ho. I love you so much, meri jaan. ❤️🫂";

  function typeLetter() {
    clearInterval(letterTimer);
    typeIndex = 0;
    $('#typed-letter').textContent = '';
    $('#type-cursor').classList.remove('hidden');
    $('#letter-signoff').classList.add('hidden');
    $('#go-button').classList.add('hidden');

    letterTimer = setInterval(() => {
      $('#typed-letter').textContent = letterText.slice(0, typeIndex++);

      if (typeIndex > letterText.length) {
        clearInterval(letterTimer);
        $('#type-cursor').classList.add('hidden');
        $('#letter-signoff').classList.remove('hidden');

        const audio = $('#letter-audio');

        withAudioCompletion(audio, 4500, () => {
          $('#go-button').classList.remove('hidden');
        });
      }
    }, 31);
  }

  $('#yes-button').addEventListener('click', () => {
    stopAudio($('#ring-audio'));
    particlesBurst(65, ['💖','💕','💗','✨','💫','♡']);
    showScene('scene-5');
    typeLetter();
    tryPlay($('#letter-audio'));
  });

  $('#go-button').addEventListener('click', () => showScene('scene-6'));
  $('#secret-choice').addEventListener('click', () => showScene('scene-7-secret'));
  $('#photos-choice').addEventListener('click', () => showScene('scene-7-photos'));

  $('#open-envelope').addEventListener('click', () => {
    const envelope = $('#open-envelope');
    envelope.classList.add('opened');
    particlesBurst(22, ['💌','💖','✨','♡']);

    setTimeout(() => {
      $('#secret-message').classList.remove('hidden');
      envelope.classList.add('hidden');
    }, 600);
  });

  $$('.back-to-choices').forEach(button => {
    button.addEventListener('click', () => showScene('scene-6'));
  });

  $$('.polaroid').forEach(card => card.addEventListener('click', async () => {
    const id = card.dataset.photo;
    const audio = $(`.voice-audio[data-voice="${id}"]`);

    if (activeVoice) stopAudio(activeVoice);
    $$('.polaroid').forEach(item => item.classList.remove('playing'));

    activeVoice = audio;
    card.classList.add('playing');
    $('#voice-status').textContent = `Playing your little message ${id}… 💗`;

    const played = await tryPlay(audio);

    if (!played) {
      card.classList.remove('playing');
      $('#voice-status').textContent = `Add voice${id}.mp3 to the website folder, then tap again ♡`;
      return;
    }

    audio.onended = () => {
      card.classList.remove('playing');
      $('#voice-status').textContent = 'Choose another memory to hear a little message ♡';
      if (activeVoice === audio) activeVoice = null;
    };
  }));

  // If the optional decorative GIF is missing, the hand-drawn candle/cake still works.
  const gif = $('.ambient-gif');
  gif.addEventListener('error', () => gif.remove());

  // Missing image files get a graceful themed placeholder instead of a broken-image icon.
  $$('.polaroid img').forEach(img => img.addEventListener('error', () => {
    img.style.display = 'none';

    const placeholder = document.createElement('div');
    placeholder.className = 'photo-placeholder';
    placeholder.style.cssText = 'aspect-ratio:1/1;display:grid;place-items:center;background:linear-gradient(135deg,#f9d8e6,#fff0d5);font-size:3rem;';
    placeholder.textContent = ['💗','✨','🌸','💌'][Number(img.closest('.polaroid').dataset.photo) - 1];

    img.insertAdjacentElement('afterend', placeholder);
  }));

  // Audio errors are handled without interrupting the story.
  $$('audio').forEach(audio => audio.addEventListener('error', () => {
    if (audio.classList.contains('voice-audio')) return;
    // The flow has timed fallbacks, so missing optional sound files never block progress.
  }));
})();
