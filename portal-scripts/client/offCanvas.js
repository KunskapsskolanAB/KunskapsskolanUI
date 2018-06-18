offCanvasJQ = jQuery.noConflict();
offCanvasJQ(function($) {
    $(document).ready(function() {
        var menuOpenMs = 150;
        var timeoutId;
       
        var hamburgerWidth=767;
        var minOpenWidth = 1349;
        
        var $window = $(window);

        // Prohibit unintentional text select on the main headers
        $(".ked-navigation ul.offcanvas-nav > li > a").css({userSelect: 'none'}); // Could be done in offcanvas.scss instead!

        $(".ked-navigation .sidebar").hover(function() {
            if (!timeoutId) {
                timeoutId = window.setTimeout(function() {
                   
                   var windowsize = $window.width();
                   
                    console.log ("Hover function Window size = " + windowsize + " < " + hamburgerWidth);
                   
                    if(windowsize < hamburgerWidth){
                       // hamburger menu
                       
                       console.log ("hover hamburger");
                       
                       $(".ked-navigation .sidebar").css("height", "100vh");
                       
                    } else {
                       // normal menu
                       
                       $(".ked-navigation .sidebar").css("width", "290px");
                       
                    }
                   
                    timeoutId = null;
                    
                    $(".ked-navigation .logo span").css("opacity", "1");
                    $(".ked-navigation .offcanvas-nav li a span").css("opacity", "1");
                    $(".ked-navigation .offcanvas-nav li a .state-indicator").css("opacity", "1");
                    $(".ked-navigation .search .search-field").css("opacity", "1");
                    $(".ked-navigation .offcanvas-nav li a span").css("opacity", "1");
                }, menuOpenMs);
            }
        }, function() {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
            } else {
               
               var windowsize = $window.width();
               
                //console.log ("Window size = " + windowsize);
                   
                    if(windowsize < hamburgerWidth){
                       // hamburger menu
                       
                       console.log ("hamburger 2");
                       
                       $(".ked-navigation .sidebar").css("height", "");
                       
                    } else {
                       // normal menu
                       console.log ("normal 2");
                       $(".ked-navigation .sidebar").css("width", "");
                    }
               
                
               if(windowsize < minOpenWidth) {
                  
                  console.log("close and hide");
                
               } else {
                  
                  console.log("Keep open");
                  
               }
               
                 
                   $(".ked-navigation .logo span").css("opacity", "0");
                $(".ked-navigation .offcanvas-nav li a span").css("opacity", "0");
                $(".ked-navigation .offcanvas-nav li a .state-indicator").css("opacity", "0");
                $(".ked-navigation .search .search-field").css("opacity", "0");
                $(".ked-navigation .offcanvas-nav li a span").css("opacity", "0");
                $(".subnav").stop().hide();
                $(".state-indicator").removeClass('fa-caret-up').addClass('fa-caret-down');
                  
               
               
            }
        });
       
        $(".ked-navigation .has-sub-nav").click(function() {
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
               
                console.log ("Window size = " + windowsize);
                   
                    if(windowsize < hamburgerWidth){
                       // hamburger menu
                       $(".ked-navigation .logo a").removeAttr("href"); //.css("cursor","pointer");
                       console.log("Remove link");
                    } else {
                       $(".ked-navigation .logo a").attr("href", "https://kg.kunskapsporten.se/2.28acbbdd12d2c6519a080007.html");
                    }
     }
     //***************************************  
    

    $(".selectSize").change(function(event) {
			window.location.replace($(this).val());
    });
   
       
       
       
    $(window).resize(removeLink);
                       
    removeLink();
       
    });
});