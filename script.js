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

  $("#no-button").on("mouseenter click", function(){
    const button = $(this);

    const viewportWidth = $(document.documentElement).width();
    const viewportHeight = $(document.documentElement).height();

    const buttonWidth = button.outerWidth();
    const buttonHeight = button.outerHeight();

    var maxL = viewportWidth - buttonWidth;
    var maxT = viewportHeight - buttonHeight;

    //ensure that the Left and top are adjusted and pos value if button larger than vp
    maxL = Math.max(0, maxL)
    maxT = Math.max(0, maxT)

    const newL = Math.floor(Math.random() * maxL)
    const newT = Math.floor(Math.random() * maxT)

    button.css({
      'position': 'absolute',
      'left': newL + 'px',
      'top': newT + 'px'
    });
  });
});