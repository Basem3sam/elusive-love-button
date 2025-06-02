//shorter version of doc ready
$(function() {
  $("#yes-button").click(function(){
    $(".container > img").first().addClass("hidden");
    $(".container > h1").first().addClass("hidden");
    $(".buttons").addClass("hidden");
    $("#loading-icon").removeClass("hidden");
    const loading = setTimeout(() => {
      $("#loading-icon").addClass("hidden");
      $("#result-gif").removeClass("hidden")
    }, 5000);
  });

  let noButtonCount = 0;
  const noButtonMessages = [
    "Are you sure about that?", // After 1st click
    "Really, really sure?",     // After 2nd click
    "Okay, last chance!",       // After 3rd click
    "Nope! Catch me now! 🏃‍♂️"    // On 4th click when it starts running
  ];

  const elusiveStartClickCount = noButtonMessages.length;


  $("#no-button").on("mouseenter click", function(event){
    const button = $(this);
    if (event.type === "click") {
      noButtonCount++; // Increment click count
      if (noButtonCount < elusiveStartClickCount) {
        button.text(noButtonMessages[noButtonCount - 1])
      } else if (noButtonCount === elusiveStartClickCount) {
        button.text(noButtonMessages[noButtonCount - 1])
        makeNoButtonElusive(button);
      } else {
        makeNoButtonElusive(button)
      }
    } else if (event.type === "mouseenter") {
      if (noButtonClickCount >= elusiveStartClickCount) {
        makeNoButtonElusive(button);
      }
    }
  });

  $("#back-button").click(function() {
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
});

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
}