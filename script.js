$(function() {
  // --- Audio Elements ---
  const yesCelebrationSound = $('#yesSound')[0];
  const noButtonMoveSound1 = $('#noButtonMoveSoundV1')[0];
  const noButtonMoveSound2 = $('#noButtonMoveSoundV2')[0];
  const noButtonTextChangeSound = $('#noButtonTextChangeSound')[0];
  const backgroundMusic = $('#backgroundMusic')[0];
  const musicToggleButton = $('#musicToggleButton');
  let musicSuccessfullyStarted = false;

  // --- Elusive Button DOM Manipulation Variables ---
  let noButtonOriginalParent = null;
  let noButtonOriginalNextSibling = null;

  $("#yes-button").click(function() {
    // 1. Hide standard initial elements
    $(".container > img").first().addClass("hidden");
    $(".container > h1").first().addClass("hidden");
    $(".buttons").addClass("hidden"); // Hides the original container of both buttons

    // 2. Explicitly hide the #no-button, wherever it might be in the DOM
    $("#no-button").addClass("hidden");

    // 3. Reset the noButton's click count for the next round (if user uses "Go Back")
    noButtonCount = 0;
    // Note: The actual DOM move back and style/text reset for #no-button
    // is handled by the #back-button's click handler. This is fine.

    // 4. Show loading icon
    $("#loading-icon").removeClass("hidden");

    // 5. Proceed to success state
    setTimeout(() => {
      $("#loading-icon").addClass("hidden");
      $("#result-gif").removeClass("hidden");
      playSound(yesCelebrationSound);
      function shootConfetti() {
        confetti({ particleCount: 70, angle: 60, spread: 55, origin: { x: 0, y: 0.8 } });
        confetti({ particleCount: 70, angle: 120, spread: 55, origin: { x: 1, y: 0.8 } });
      }
      shootConfetti();
      setTimeout(shootConfetti, 200);
    }, 6000);
  });

  // --- noButtonCount and messages (remains the same) ---
  let noButtonCount = 0; // Already declared above, ensure only one declaration
  const noButtonMessages = [
    "Are you sure about that?",
    "Really, really sure?",
    "Okay, last chance!",
    "Nope! Catch me now! 🏃‍♂️"
  ];
  const elusiveStartClickCount = noButtonMessages.length;

  function makeNoButtonElusive(buttonElement) {
    if (!buttonElement.data('isMovedToBody')) {
      noButtonOriginalParent = buttonElement.parent();
      noButtonOriginalNextSibling = buttonElement.next().length ? buttonElement.next() : null;
      buttonElement.detach().appendTo('body');
      buttonElement.data('isMovedToBody', true);
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonWidth = buttonElement.outerWidth();
    const buttonHeight = buttonElement.outerHeight();
    let maxL = viewportWidth - buttonWidth;
    let maxT = viewportHeight - buttonHeight;
    maxL = Math.max(0, maxL);
    maxT = Math.max(0, maxT);
    const newL = Math.floor(Math.random() * maxL);
    const newT = Math.floor(Math.random() * maxT);

    if (!buttonElement.hasClass("elusive")) {
      buttonElement.addClass("elusive");
    }
    buttonElement.css({
      'position': 'fixed',
      'left': newL + 'px',
      'top': newT + 'px'
    });

    const availableMoveSounds = [noButtonMoveSound1, noButtonMoveSound2].filter(sound => sound);
    if (availableMoveSounds.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMoveSounds.length);
      playSound(availableMoveSounds[randomIndex]);
    }
  }

  $("#no-button").on("mouseenter click", function(event) {
    const button = $(this);
    if (event.type === "click") {
      noButtonCount++; // This refers to the noButtonCount declared in the outer scope
      if (noButtonCount < elusiveStartClickCount) {
        button.text(noButtonMessages[noButtonCount - 1]);
        playSound(noButtonTextChangeSound);
      } else if (noButtonCount === elusiveStartClickCount) {
        button.text(noButtonMessages[noButtonCount - 1]);
        playSound(noButtonTextChangeSound);
        makeNoButtonElusive(button);
      } else {
        makeNoButtonElusive(button);
      }
    } else if (event.type === "mouseenter") {
      if (noButtonCount >= elusiveStartClickCount) {
        makeNoButtonElusive(button);
      }
    }
  });

  $("#back-button").click(function() {
    if (yesCelebrationSound) {
      yesCelebrationSound.pause();
      yesCelebrationSound.currentTime = 0;
    }
    $("#result-gif").addClass("hidden");
    $(".container > img").first().removeClass("hidden");
    $(".container > h1").first().removeClass("hidden");
    $(".buttons").removeClass("hidden");

    noButtonCount = 0; // Resetting here is correct for the "back" action
    const noButton = $("#no-button");

    if (noButton.data('isMovedToBody') && noButtonOriginalParent) {
      noButton.detach();
      if (noButtonOriginalNextSibling && noButtonOriginalNextSibling.length > 0) {
        noButtonOriginalNextSibling.before(noButton);
      } else {
        noButtonOriginalParent.append(noButton);
      }
      noButton.data('isMovedToBody', false);
    }

    noButton.removeClass("elusive")
      .removeClass("hidden")
      .text('no')
      .css({
        'position': '',
        'top': '',
        'left': '',
        'max-width': ''
      });
      
    noButtonOriginalParent = null;
    noButtonOriginalNextSibling = null;
  });

  // --- Music Toggle Logic (remains the same) ---
  musicToggleButton.click(function() {
    if (!backgroundMusic) return;
    if (!musicSuccessfullyStarted) {
      attemptToPlayMusic();
    } else {
      backgroundMusic.muted = !backgroundMusic.muted;
      if (!backgroundMusic.muted && backgroundMusic.paused) {
        backgroundMusic.play().catch(e => console.warn("Error re-playing on unmute:", e));
      }
      updateMusicButtonText();
    }
  });

  function updateMusicButtonText() {
    if (!backgroundMusic) return;
    musicToggleButton.text(musicSuccessfullyStarted && !backgroundMusic.muted ? '🎵 Mute Music' : (musicSuccessfullyStarted && backgroundMusic.muted ? '🎵 Unmute Music' : '▶️ Play Music'));
  }
  
  function attemptToPlayMusic() {
    if (!backgroundMusic || (musicSuccessfullyStarted && !backgroundMusic.paused && backgroundMusic.duration > 0 && !backgroundMusic.ended)) {
        if(musicSuccessfullyStarted && backgroundMusic.muted){
            backgroundMusic.muted = false;
            updateMusicButtonText();
        }
        return; 
    }
    backgroundMusic.volume = 0.25;
    backgroundMusic.play().then(() => {
      musicSuccessfullyStarted = true;
      backgroundMusic.muted = false;
      updateMusicButtonText();
    }).catch(error => {
      console.warn("Background music play failed:", error);
      musicSuccessfullyStarted = false;
      updateMusicButtonText();
    });
  }

  let firstInteractionHasOccurred = false;
  function handleFirstUserInteraction() {
    if (!firstInteractionHasOccurred) {
      firstInteractionHasOccurred = true;
      attemptToPlayMusic();
    }
  }
  $("#yes-button").one("click", handleFirstUserInteraction);
  $("#no-button").one("click", handleFirstUserInteraction);

  // Helper function to play sounds (remains the same)
  function playSound(soundElement) {
    if (soundElement) {
      soundElement.currentTime = 0;
      soundElement.play().catch(error => console.warn("Audio play issue:", error));
    }
  }
});