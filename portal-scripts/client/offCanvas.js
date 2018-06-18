offCanvasJQ = jQuery.noConflict();
offCanvasJQ(function ($) {
    $(document).ready(function () {
        var menuOpenMs = 150;
        var timeoutId;

        var hamburgerWidth = 767;
        var minOpenWidth = 1349;

        var $window = $(window);

        // Prohibit unintentional text select on the main headers
        $(".ked-navigation ul.offcanvas-nav > li > a").css({ userSelect: 'none' }); // Could be done in offcanvas.scss instead!

        // Keep a reference to logo span for fast lookup of its open/close state
        var logoSpan = $(".ked-navigation .logo span");

        // Add pin/unpin icon.
        //fas fa-thumbtack
        var pinned = sessionStorage.getItem('offcanvas-pinned');

        var pinIcon = $('<i style="color: #fff" class="fa fa-thumb-tack" aria-hidden="true"></i>')
            .css({
                position: 'absolute',
                top: 0,
                right: 0,
                padding: "1em",
                opacity: pinned ? 1 : 0,
                cursor: 'pointer',
            }).hover(function () {
                if (logoSpan.css("opacity") == 1) pinIcon.css({ opacity: 0.8 });
            }, function () {
                if (logoSpan.css("opacity") == 1) pinIcon.css({ opacity: pinned ? 1 : 0.5 });
            }).click(function () {
                if (!pinned) {
                    pinMenu();
                } else {
                    unPinMenu();
                }
            });
        $(".ked-navigation .logo").css({ position: 'relative', top: 0, left: 0, width: "100%" }).append(pinIcon);
        //$(".ked-navigation .sidebar").css({position: 'relative', top:0, left: 0});


        $(".ked-navigation .sidebar").hover(function () {
            if (!timeoutId && !pinned) {
                timeoutId = window.setTimeout(expandMenu, menuOpenMs);
            }
        }, function () {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            } else if (!pinned) {
                collapseMenu();
            }
        });

        $(".ked-navigation .has-sub-nav").click(function () {
            // The line below is remarked so that a user may click on a menu item while
            // it is being expanded:
            //if ($(".ked-navigation .logo span").css("opacity") == 1) {               
            if ($(this).find(".state-indicator").hasClass("fa-caret-down")) {
                // Before, we hade slideToggle() above this if-statement. State could then get
                // out-of-sync. Instead, I've put an explicit slideDown() here and another
                // slideUp() in the else statement to replace the previous slideToggle.
                $(this).next(".subnav").stop().slideDown(300);
                $(this).find(".state-indicator").removeClass('fa-caret-down').addClass('fa-caret-up');
            } else {
                // Replacement of earlier slideToggle() before if-statement:
                $(this).next(".subnav").stop().slideUp(300);
                $(this).find(".state-indicator").removeClass('fa-caret-up').addClass('fa-caret-down');
            }
            //}
        });


        // ***************************************     
        function removeLink() {

            var windowsize = $window.width();

            console.log("Window size = " + windowsize);

            if (windowsize < hamburgerWidth) {
                // hamburger menu
                $(".ked-navigation .logo a").removeAttr("href"); //.css("cursor","pointer");
                console.log("Remove link");
            } else {
                $(".ked-navigation .logo a").attr("href", "https://kg.kunskapsporten.se/2.28acbbdd12d2c6519a080007.html");
            }
        }
        //***************************************  


        $(".selectSize").change(function (event) {
            window.location.replace($(this).val());
        });




        $(window).resize(removeLink);

        removeLink();

        if (pinned) pinMenu();

        function pinMenu() {
            pinned = true;
            sessionStorage.setItem('offcanvas-pinned', "true");
            $(".ked-navigation .sidebar").css({transition: 'none'});
            pinIcon.css({
                opacity: 1,
                transform: "rotate(35deg) scale(1.1)", transformOrigin: '50% 50%'
            });
            expandMenu();
        }

        function unPinMenu() {
            pinned = false;
            sessionStorage.setItem('offcanvas-pinned', "");
            $(".ked-navigation .sidebar").css({transition: ''});
            pinIcon.css({ transform: "none" });
        }

        function expandMenu() {

            var windowsize = $window.width();

            console.log("Hover function Window size = " + windowsize + " < " + hamburgerWidth);

            if (windowsize < hamburgerWidth) {
                // hamburger menu

                console.log("hover hamburger");

                $(".ked-navigation .sidebar").css("height", "100vh");

            } else {
                // normal menu

                $(".ked-navigation .sidebar").css("width", "290px");

            }

            timeoutId = null;

            if (!pinned) pinIcon.css("opacity", 0.5);
            $(".ked-navigation .logo span").css("opacity", "1");
            $(".ked-navigation .offcanvas-nav li a span").css("opacity", "1");
            $(".ked-navigation .offcanvas-nav li a .state-indicator").css("opacity", "1");
            $(".ked-navigation .search .search-field").css("opacity", "1");
            $(".ked-navigation .offcanvas-nav li a span").css("opacity", "1");
        }

        function collapseMenu() {

            var windowsize = $window.width();

            //console.log ("Window size = " + windowsize);

            if (windowsize < hamburgerWidth) {
                // hamburger menu

                console.log("hamburger 2");

                $(".ked-navigation .sidebar").css("height", "");

            } else {
                // normal menu
                console.log("normal 2");
                $(".ked-navigation .sidebar").css("width", "");
            }


            if (windowsize < minOpenWidth) {

                console.log("close and hide");

            } else {

                console.log("Keep open");

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
    });
});