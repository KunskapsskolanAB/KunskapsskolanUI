(function ($) {
  $(document).ready(function () {
    // 
    // 
    // States
    // 
    //
    var menuOpenMs = 150;
    var timeoutId;
    var hamburgerWidth = 767;
    var minOpenWidth = 1349;
    var $window = $(window);
    // Keep a reference to logo span for fast lookup of its open/close state
    var logoSpan = $(".ked-navigation .logo span");
    // pin state
    var pinned = sessionStorage.getItem('offcanvas-pinned');
    // if pinned not set set as false instead of null
    if (pinned === null) {
      pinned = false;
      sessionStorage.setItem("offcanvas-pinned", false);
    }
    var openSections = sessionStorage.getItem("offcanvas-openSections");
    if (openSections === null) {
      openSections = [];
    } else {
      openSections = JSON.parse(openSections);
    }

    if(pinned=="false" || pinned==false){
      pinned=false;
    }
    if(pinned=="true" || pinned==true){
      pinned=true;
    }

    var pinIcon;
    // 
    // 
    // Initialization Code
    // 
    //
    (function init() {
      // Prohibit unintentional text select on the main headers
      $(".ked-navigation ul.offcanvas-nav > li > a").css({
        userSelect: 'none'
      }); // Could be done in offcanvas.scss instead!
      // Create and store a reference to, the thumbtack icon (pinning icon)
      pinIcon = $('<i style="color: #fff" class="fa fa-thumb-tack" aria-hidden="true"></i>').css({
        position: 'absolute',
        top: 0,
        right: 0,
        padding: "1em",
        opacity: pinned ? 1 : 0,
        cursor: 'pointer',
      }).hover(function () {
        if (logoSpan.css("opacity") == 1) pinIcon.css({
          opacity: 0.8
        });
      }, function () {
        if (logoSpan.css("opacity") == 1) pinIcon.css({
          opacity: pinned ? 1 : 0.5
        });
      }).click(function () {
        if (!pinned) {
          pinMenu();
        } else {
          unPinMenu();
        }
      });
      // Insert the pinning icon into the menu with position relative to right
      $(".ked-navigation .logo").css({
        position: 'relative',
        top: 0,
        left: 0,
        width: "100%"
      }).append(pinIcon);
      // Define the hover-in and hover-out behavior of the menu
      $(".ked-navigation .sidebar").hover(function () {
        // hover-in:
        if (!timeoutId && !pinned) {
          timeoutId = window.setTimeout(expandMenu, menuOpenMs);
        }
      }, function () {
        // hover-out:
        if (timeoutId) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        } else if (!pinned) {
          collapseMenu();
        }
      });
      // If menu is pinned look for previously opened sections and open them
    
      if (pinned === true) {
        for (var i = 0; i < openSections.length; i++) {
          var liSelector = ".offcanvas-nav .lvl1:nth-child(" + [openSections[i] + 1] + ")";
          var selectedItem = $(liSelector);
          selectedItem.find(".subnav").show();
          selectedItem.find(".state-indicator").removeClass('fa-caret-down').addClass('fa-caret-up');
        }
      }
      // Define the behavior of expanding/collapsing sub-menus:
      $(".ked-navigation .has-sub-nav").click(function () {
        // Check which nth child was clicked
        var clickedChild = $(this).parent().index()
        // The line below is remarked so that a user may click on a menu item while
        // it is being expanded:
        //if ($(".ked-navigation .logo span").css("opacity") == 1) {               
        if ($(this).find(".state-indicator").hasClass("fa-caret-down")) {
          // Before, we hade slideToggle() above this if-statement. State could then get
          // out-of-sync. Instead, I've put an explicit slideDown() here and another
          // slideUp() in the else statement to replace the previous slideToggle.
          // Add click child number to open sections array
          openSections.push(clickedChild);
          $(this).next(".subnav").stop().slideDown(300);
          $(this).find(".state-indicator").removeClass('fa-caret-down').addClass('fa-caret-up');
        } else {
          openSections = jQuery.grep(openSections, function (value) {
            return value != clickedChild;
          });
          // Replacement of earlier slideToggle() before if-statement:
          $(this).next(".subnav").stop().slideUp(300);
          $(this).find(".state-indicator").removeClass('fa-caret-up').addClass('fa-caret-down');
        }
        sessionStorage.setItem("offcanvas-openSections", JSON.stringify(openSections));
        //}
      });
      // Kept code (don't know the exact functionality):
      $(".selectSize").change(function (event) {
        window.location.replace($(this).val());
      });
      //$(window).resize(removeLink); 
      removeLink();
      // If menu was initially pinned (from stored value in sessionStorage), make
      // the menu pinned initially:
      if (pinned == true) {
        pinMenu();
      } 
      
      if(pinned == false) {
        sessionStorage.setItem('offcanvas-pinned', false);
        $(".sv-grid-ksgs12").first().removeClass('pinned'); // So CSS can adjust padding rule accordingly
        $(".ked-navigation .sidebar").css({
          transition: ''
        });
        pinIcon.css({
          transform: "none"
        });
        collapseMenu();
      }
    })();
    //
    //
    // Help functions
    //
    //
    /** pinMenu()
     * 
     * Makes menu pinned.
     * 
     */
    function pinMenu() {
      pinned = true;
      sessionStorage.setItem('offcanvas-pinned', true);
      // Adjust content area padding-left
      $(".sv-grid-ksgs12").first().addClass('pinned'); // So CSS can adjust padding rule accordingly
      // Turn off CSS animation (important on initially pinned page)
      $(".ked-navigation .sidebar").css({
        transition: 'none'
      });
      // Rotate the pinning icon a bit and let it 100% non-transparent:
      pinIcon.css({
        opacity: 1,
        transform: "rotate(35deg) scale(1.1)",
        transformOrigin: '50% 50%'
      });
      // Make menu expanded if not already expanded:
      expandMenu();
    }
    /** pinMenu()
     * 
     * Makes menu unpinned.
     * 
     */
    function unPinMenu() {
      pinned = false;
      sessionStorage.setItem('offcanvas-pinned', false);
      $(".sv-grid-ksgs12").first().removeClass('pinned'); // So CSS can adjust padding rule accordingly
      $(".ked-navigation .sidebar").css({
        transition: ''
      });
      pinIcon.css({
        transform: "none"
      });
      collapseMenu();
    }
    /** expandMenu()
     * 
     * Expands the menu.
     */
    function expandMenu() {
      var windowsize = $window.width();
      if (windowsize < hamburgerWidth) {
        // hamburger menu
        $(".ked-navigation .sidebar").css("height", "100vh");
        $(".sv-grid-ksgs12").first().addClass('hamburger'); // So CSS can adjust padding rule accordingly
        pinIcon.hide(); // Don't support pinning when in hamburger menu yet.
      } else {
        // normal menu
        $(".ked-navigation .sidebar").css("width", "290px");
        $(".sv-grid-ksgs12").first().removeClass('hamburger'); // So CSS can adjust padding rule accordingly
      }
      timeoutId = null;
      if (!pinned) pinIcon.css("opacity", 0.5);
      $(".ked-navigation .logo span").css("opacity", "1");
      $(".ked-navigation .offcanvas-nav li a span").css("opacity", "1");
      $(".ked-navigation .offcanvas-nav li a .state-indicator").css("opacity", "1");
      $(".ked-navigation .search .search-field").css("opacity", "1");
      $(".ked-navigation .offcanvas-nav li a span").css("opacity", "1");
    }
    /** collapseMenu()
     * 
     * Un-expands the menu.
     */
    function collapseMenu() {
      var windowsize = $window.width();
      if (windowsize < hamburgerWidth) {
        // hamburger menu
        $(".ked-navigation .sidebar").css("height", "");
      } else {
        // normal menu
        $(".ked-navigation .sidebar").css("width", "");
      }
      pinIcon.css("opacity", 0);
      $(".ked-navigation .logo span").css("opacity", "0");
      $(".ked-navigation .offcanvas-nav li a span").css("opacity", "0");
      $(".ked-navigation .offcanvas-nav li a .state-indicator").css("opacity", "0");
      $(".ked-navigation .search .search-field").css("opacity", "0");
      $(".ked-navigation .offcanvas-nav li a span").css("opacity", "0");
      $(".subnav").stop().hide();
      $(".state-indicator").removeClass('fa-caret-up').addClass('fa-caret-down');
    }
    /** removeLink()
     * 
     */
    function removeLink() {
      var windowsize = $window.width();
      if (windowsize < hamburgerWidth) {
        // hamburger menu
        $(".ked-navigation .logo a").removeAttr("href"); //.css("cursor","pointer");
        if (pinned) {
          $(".ked-navigation .sidebar").css("width", "");
          // Doing same things as unpinned to handle situation when pinned menu goes into mobile view
          pinIcon.css("opacity", 0);
          $(".sv-grid-ksgs12").first().removeClass('pinned'); // So CSS can adjust padding rule accordingly
          $(".ked-navigation .sidebar").css({
            transition: ''
          });
          pinIcon.css({
            transform: "none"
          });
        }
      } else {
        $(".ked-navigation .logo a").attr("href", "/home");
        if (pinned) {
          $(".ked-navigation .sidebar").css("width", "");
          // Doing same things as pinned to handle situation when pinned menu goes into desktop view
          $(".sv-grid-ksgs12").first().addClass('pinned');
          $(".ked-navigation .sidebar").css({
            transition: 'none'
          });
          pinIcon.css({
            opacity: 1,
            transform: "rotate(35deg) scale(1.1)",
            transformOrigin: '50% 50%'
          });
          expandMenu();
        }
      }
    }
    $(window).resize(removeLink);
  });
})(jQuery);