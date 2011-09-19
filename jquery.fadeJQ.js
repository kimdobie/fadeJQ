//  version 2.0.0


(function( $ ){
		

  $.fn.fadeJQ = function( options ) {  
  	// publicly available options
    var settings = {
	'interval':400, // The time in miliseconds between color steps
	'steps':7,// The number of different shades during fade
	'useExistingAsEnd':true, // Use the existing background color as the end color if a background color is not provided
	'startcolor':'ffff99', //default starting color if one is not provided
	'endcolor':"ffffff", //default ending color if one is not provided and do_FadeuseExistingAsEnd is false;
	'fadeBGAttribute':"data-fadeJQ_bg",
	'fadeTimestampAttribute':"data-fadeJQ_timestamps",
	'debug':false // turn on or off debugging messages
	};
	
	if( options ){ $.extend( settings, options ); }
	
		var init=function(element){
			//If using existing color - then get current background before fade
			var hasAttr=$(element).is("["+settings.fadeBGAttribute+"]");
			if(settings.useExistingAsEnd==true&&!hasAttr){settings.endcolor=getBackground(element)};
			
			//Set bg attribute if not set, use value if set
			if(!hasAttr){$(element).attr(settings.fadeBGAttribute,settings.endcolor)}
			else settings.endcolor=$(element).attr(settings.fadeBGAttribute);
			
			
			// Insure start and end colors are proper format
			settings.startcolor=setColor(settings.startcolor);
			settings.endcolor=setColor(settings.endcolor);
			
			mainFade({"element":element});
		}
		
		
		//////////// MAIN FADE ////////////
		var mainFade=function(options){
	    var s={
		   	'element':"",
			"step":0,
			"timestamp":"",
			"startr":"",
			"endr":"",
			"startg":"",
			"endg":"",
			"startb":"",
			"endb":""
		    
		 };
		if ( options ) { $.extend( s, options ); }
		
		if(s.element==""){msg('No element sent to mainFade - killing function');return;}
		var $this=$(s.element);
		
		
		if(s.timestamp==""){// there is no timestamp - set one
			s.timestamp=new Date().getTime();
			var newAttrVal= s.timestamp+',';
			if($this.is("["+settings.fadeTimestampAttribute+"]")) newAttrVal+=$this.attr(settings.fadeTimestampAttribute);
			$this.attr(settings.fadeTimestampAttribute,newAttrVal);
		}
		
		var timestampArray=$this.attr(settings.fadeTimestampAttribute).split(',');
		timestampArray.pop();

		for(var i=0;i<timestampArray.length;i++){
			if(s.timestamp<timestampArray[i]){return;}// There is a newer timestamp - Let's kill this fade
		}
		
		
		
		
		
		var r,g,b;
		if(s.step==0){
			
			//set start and final states for math calculation below	
			var startnums=toNumbers(settings.startcolor);
			s.startr=r=startnums[0];
			s.startg=g=startnums[1];
			s.startb=b=startnums[2];
			
			var endnums=toNumbers(settings.endcolor);
			s.endr=endnums[0];
			s.endg=endnums[1];
			s.endb=endnums[2];
				
		}
		else if(s.step==settings.steps){
			r=s.endr;
			g=s.endg;
			b=s.endb;
		}
		else{
			// inbetween and need to calculate r,g,b
			r=Math.round(s.startr+(s.endr-s.startr)/settings.steps*s.step);
			g=Math.round(s.startg+(s.endg-s.startg)/settings.steps*s.step);
			b=Math.round(s.startb+(s.endb-s.startb)/settings.steps*s.step);
		}
		
		
		//Set background
		$this.css('background-color',"rgb("+r+","+g+","+b+")");
		
		
		if(s.step<settings.steps){
			s.step++;
			setTimeout(function(){mainFade(s);},settings.interval);
		}
			
			
		}// end mainFade
		
			/////////////// HELPERS /////////////////
			 
	    ///////////TO NUMBERS///////////////////////
		// Helper method to convert a hex color (example #ffcc00) to an array of rgb values
		//
		// JS Hex/Number: Copyright 2007, John Resig
		 // http://ejohn.org/blog/numbers-hex-and-colors/
		////////////////////////////////////////////
		var toNumbers=function(str){
			 
			var ret = [];
			str.replace(/(..)/g, function(str){
				ret.push( parseInt( str, 16 ) );
			});
			 return ret;
		};
	    
	    
	    /////////////// LOGGING ///////////////
		var msg=function(msgTxt){
			if(settings.debug==true){
				try{console.log(msgTxt);}
				catch(err){alert(msgTxt);}
			}
		}
		
	////////////////////////////////////////////////////////	
		
		/////////////////////////////////////
		//Helper method that  gets the background of the object
		//
		/////////////////////////////////////
		var getBackground=function(element){
			
			var bg=checkForCSS3($(element).css('background-color'));	
			if(bg==""){
				var parents=$(element).parents();
				parents.each(function(){
					if(bg==""){bg=checkForCSS3($(this).css('background-color'));}
				});
			}
			
			if(bg=="") return settings.endcolor; // no background color set - use default end color (usually white)
			return bg;
		};
		
		
		
		/////////////////////////////////////
		//Helper method that  checks to see if a color exists and is nontransparent.
		// Returns the color in hex or "" if color doesn't exist.
		//
		/////////////////////////////////////
		var checkForCSS3=function(bg){
			// check to see if rgba is returned
			if(bg=="transparent")return "";
			var rgbavals=/rgba\((.+),(.+),(.+),(.+)\)/i.exec(bg);
			
			if(rgbavals!=null){
				//this is using rbga and is not transparent
				if(parseInt(rgbavals[4])==0) return "";
				return "#"+(
					parseInt(rgbavals[1]).toString(16)+
					parseInt(rgbavals[2]).toString(16)+
					parseInt(rgbavals[3]).toString(16)
					).toUpperCase();
			}
			
			else{
				var rgbvals = /rgb\((.+),(.+),(.+)\)/i.exec(bg);
				if(rgbvals==null) return bg;
				return "#"+(
					parseInt(rgbvals[1]).toString(16)+
					parseInt(rgbvals[2]).toString(16)+
					parseInt(rgbvals[3]).toString(16)
					).toUpperCase();
			}
		};
		
		/////////////////////////////////////////
		// Helper method to make sure a  provided hex color is in the proper hex format without the leading "#"
		//
		/////////////////////////////////////////
		setColor=function(color){
			color=color.replace(/#/,""); //strip out any leading #	
			if(color.length==3){
				// this a color shorthand - need to expand it
				var r=color.charAt(0)+"";
				var g=color.charAt(1)+"";
				var b=color.charAt(2)+"";
				
				color=r+r+g+g+b+b;
			}
			if(color.length!=6){
				
				msg("color string ( "+color+" ) sent to setColor function has incorrect number of digits ( "+color.length+" )");
			}
			return color;
	};
		
	
    return this.each(function() {
		init($(this));
						
	}); 
    
   
  }// end fadeJQ
    

})( jQuery );