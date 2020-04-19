import Log from "../log/Log.js"

function Fullscreen(){}
Fullscreen.installed = false
Fullscreen.timeouts = []
Fullscreen.createTimeouts = function(){}
Fullscreen.install = function(){
    if(Fullscreen.installed){
        return
    }
    Fullscreen.installed = true
    Log.print(Log.Info, "Fullscreen", "install")
	$(window).on("resize", function(e){
		if($(".jogg-fullscreen:visible").length > 0){
			window.scrollTo(0, -1)
			var w = window.innerWidth;			
			var h = window.innerHeight
			$(".jogg-fullscreen").outerWidth(w)
            $(".jogg-fullscreen").outerHeight(h)
            var offset = $(".jogg-fullscreen").offset()
			window.scrollTo(offset.left, offset.top)
		}
	})
	$(window).on("orientationchange", function(e){
		if($(".jogg-fullscreen:visible").length > 0){
			Fullscreen.refresh();			
		}
	});	 
}
Fullscreen.enter = function(element){
    if(!Fullscreen.installed){
        Fullscreen.install()
    }
    var $element = $(element)
    if(!$element.hasClass("jogg-fullscreen")){            
        $element.addClass("jogg-fullscreen")
        Fullscreen.refresh()
    }
}
Fullscreen.leave = function(element){
    if(!Fullscreen.installed){
        Fullscreen.install()
    }    
    var $element = $(element)
    if($element.hasClass("jogg-fullscreen")){        
        $element.removeClass("jogg-fullscreen")
        $element.css("width", "")
        $element.css("height", "")
        Fullscreen.refresh()
        var offset = $element.offset()
        window.scrollTo(offset.left, offset.top)
    }
}
Fullscreen.refresh = function(){
    if(!Fullscreen.installed){
        Fullscreen.install()
    }
    $(window).trigger("resize");	
	// clear timeouts
	for(var i in Fullscreen.timeouts){
		clearTimeout(Fullscreen.timeouts[i]);		
	}
	Fullscreen.timeouts = []
	// create new timeouts	
	Fullscreen.timeouts.push(setTimeout(function(){
		$(window).trigger("resize");			
	}, 250))
	Fullscreen.timeouts.push(setTimeout(function(){
		$(window).trigger("resize");			
	}, 500))
	Fullscreen.timeouts.push(setTimeout(function(){
		$(window).trigger("resize");			
	}, 1000))
}

export default Fullscreen