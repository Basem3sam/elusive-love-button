//shorter version of doc ready
$(function() {
  // --- Audio Elements ---
  const yesCelebrationSound = $('#yesSound')[0]; // Or document.getElementById('yesSound');
  const noButtonMoveSound1 = $('#noButtonMoveSoundV1')[0];
  const noButtonMoveSound2 = $('#noButtonMoveSoundV2')[0];
  const noButtonTextChangeSound = $('#noButtonTextChangeSound')[0];
  const backgroundMusic = $('#backgroundMusic')[0];
  const musicToggleButton = $('#musicToggleButton');
  let musicSuccessfullyStarted = false; 

  $("#yes-button").click(function(){
    $(".container > img").first().addClass("hidden");
    $(".container > h1").first().addClass("hidden");
    $(".buttons").addClass("hidden");
    $("#loading-icon").removeClass("hidden");
    const loading = setTimeout(() => {
      $("#loading-icon").addClass("hidden");
      $("#result-gif").removeClass("hidden");
      
      playSound(yesCelebrationSound);

      // ✨🎉 Trigger Confetti Here! 🎉✨

      function shootConfetti() {
          confetti({
          particleCount: 70,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 } // Left side
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 } // Right side
        });
      }
      shootConfetti();
      setTimeout(shootConfetti, 200); // Another burst slightly later
    }, 6000);
  });

  let noButtonCount = 0;
  const noButtonMessages = [
    "Are you sure about that?", // After 1st click
    "Really, really sure?",     // After 2nd click
    "Okay, last chance!",       // After 3rd click
    "Nope! Catch me now! 🏃‍♂️"    // On 4th click when it starts running
  ];

  const elusiveStartClickCount = noButtonMessages.length;

  function makeNoButtonElusive(buttonElement) {
    const viewportWidth = $(document.documentElement).width();
    const viewportHeight = $(document.documentElement).height();

    const buttonWidth = buttonElement.outerWidth();
    const buttonHeight = buttonElement.outerHeight();

    var maxL = viewportWidth - buttonWidth;
    var maxT = viewportHeight - buttonHeight;

    //ensure that the Left and top are adjusted and pos value if button larger than vp
    maxL = Math.max(0, maxL)
    maxT = Math.max(0, maxT)

    const newL = Math.floor(Math.random() * maxL)
    const newT = Math.floor(Math.random() * maxT)

    buttonElement.css({
      'position': 'absolute',
      'left': newL + 'px',
      'top': newT + 'px'
    });
    
    // --- Play a random move sound ---
    const availableMoveSounds = [noButtonMoveSound1, noButtonMoveSound2].filter(sound => sound); // Filter out any nulls just in case

    if (availableMoveSounds.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMoveSounds.length);
      const soundToPlay = availableMoveSounds[randomIndex];
      playSound(soundToPlay);
    }
  }

  $("#no-button").on("mouseenter click", function(event){
    const button = $(this);
    if (event.type === "click") {
      noButtonCount++; // Increment click count
      if (noButtonCount < elusiveStartClickCount) {
        button.text(noButtonMessages[noButtonCount - 1]);
        playSound(noButtonTextChangeSound);
      } else if (noButtonCount === elusiveStartClickCount) {
        button.text(noButtonMessages[noButtonCount - 1]);
        playSound(noButtonTextChangeSound);
        makeNoButtonElusive(button);
      } else {
        makeNoButtonElusive(button)
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
    
    // For backgroundMusic, we will NO LONGER pause it here. idk i feel like that :>
    // It will continue to play if it was already playing.
    // The user can use the musicToggleButton to control it.

    // =============== older code ===============
    // if (backgroundMusic && musicSuccessfullyStarted) {
    //   backgroundMusic.pause();
    //   musicSuccessfullyStarted = false;
    //   updateMusicButtonText();
    // }

    $("#result-gif").addClass("hidden")
    $(".container > img").first().removeClass("hidden");
    $(".container > h1").first().removeClass("hidden");
    $(".buttons").removeClass("hidden");

    //Reset the noButtonCount for the #no-button
    noButtonCount = 0;

    $("#no-button").text('no').css({
      'position': '',
      'top': '',
      'left': ''
    });
  });

  musicToggleButton.click(function() {
    if (!backgroundMusic) return;

    if (!musicSuccessfullyStarted) {
      // If music hasn't started yet, this button click will try to start it
      attemptToPlayMusic();
    } else {
      // If music has successfully started before, this button toggles mute
      backgroundMusic.muted = !backgroundMusic.muted;
      // If unmuting and it was somehow paused, play it (optional, good for robustness)
      if (!backgroundMusic.muted && backgroundMusic.paused) {
          backgroundMusic.play().catch(e => console.warn("Error re-playing on unmute:", e));
      }
      updateMusicButtonText();
    }
  });

  function updateMusicButtonText() {
  if (!backgroundMusic) return;
  if (musicSuccessfullyStarted) { // If music has successfully started at least once
    musicToggleButton.text(backgroundMusic.muted ? '🎵 Unmute Music' : '🎵 Mute Music');
  } else { // Music hasn't started successfully yet
    musicToggleButton.text('▶️ Play Music');
  }
}

function attemptToPlayMusic() {
  if (!backgroundMusic || musicSuccessfullyStarted) {
    return;
  }

  backgroundMusic.volume = 0.25; // Set a pleasant, non-intrusive volume (0.0 to 1.0)
  backgroundMusic.play().then(() => {
    musicSuccessfullyStarted = true;
    backgroundMusic.muted = false; // Ensure it's unmuted if play succeeds
    console.log("Background music started successfully.");
    updateMusicButtonText();
  }).catch(error => {
    console.warn("Background music play on interaction was prevented:", error);
    musicSuccessfullyStarted = false; // It didn't start
    updateMusicButtonText(); // Keep button as "Play Music"
  });
}

  let firstInteractionHasOccurred = false;
  function handleFirstUserInteraction() {
    if (!firstInteractionHasOccurred) {
      firstInteractionHasOccurred = true;
      attemptToPlayMusic(); // Try to play music
    }
  }

  $("#yes-button").one("click", handleFirstUserInteraction);
  $("#no-button").one("click", handleFirstUserInteraction);
});

// Helper function to play sounds (handles rewinding and error catching)
function playSound(soundElement) {
  if (soundElement) {
    soundElement.currentTime = 0;
    soundElement.play().catch(error => console.warn("Audio play issue:", error));
  }
}




