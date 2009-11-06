/////////////////////////////////////////////////////////////////////////////////////////////////////

// jquery.fadeJQ.js
// version 1.0.1
/////////////////////////////////////////////////////////////////////////////////////////////////////





jQuery.fn.fadeJQ = function(startcolor,endcolor) {
	
	
	//////////////////////////////////// VARS ////////////////////////////////////////////////////////
	var fadeInterval=400;// The time in miliseconds between color steps
	var fadeSteps=7;// The number of different shades during fade
	var useExistingAsEnd=true; // Use the existing background color as the end color if a background color is not provided
	var defaultStartColor="ffff99"; //default starting color if one is not provided
	var defaultEndColor="ffffff"; //default ending color if one is not provided and do_FadeuseExistingAsEnd is false;
	
	var element=this; // just to keep track of the DOM object we want to fade
	
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	if(typeof startcolor=="object"){
		paramObj=startcolor;
		startcolor=paramObj.startcolor;
		
		if(paramObj.endcolor!=undefined)endcolor=paramObj.endcolor;
		if(paramObj.steps!=undefined)fadeSteps=paramObj.steps;
		if(paramObj.interval!=undefined)fadeInterval=paramObj.interval;
		
		
	}
	
	
	
	
	////////////////////////////////////////////
	// Helper method to convert a hex color (example #ffcc00) to an array of rgb values
	//
	// JS Hex/Number: Copyright 2007, John Resig
	 // http://ejohn.org/blog/numbers-hex-and-colors/
	////////////////////////////////////////////
	toNumbers=function(str){
		 
   		var ret = [];
    	str.replace(/(..)/g, function(str){
     		ret.push( parseInt( str, 16 ) );
   		});
  		 return ret;
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
			
			alert("color string ( "+color+" ) sent to setColor function has incorrect number of digits ( "+color.length+" )");
		}
		return color;
	};
	

	/////////////////////////////////////
	//Helper method that  gets the background of the object
	//
	/////////////////////////////////////
	getBackground=function(){
		
		var bg=checkForCSS3(jQuery(element).css('background-color'));	
		
		// Check to see if the element itself has a background color
	
		// The element itself doesn't have a background color - check each of it's parents
		if(bg==""){
			var parents=jQuery(element).parents();
			parents.each(function(){
				if(bg==""){
					bg=checkForCSS3(jQuery(this).css('background-color'));	
				}
			
			});
		}
		
		if(bg=="") return defaultEndColor; // no background color set - use default 
		
		else return bg;
		
	};
	
	/////////////////////////////////////
	//Helper method that  checks to see if a color exists and is nontransparent.
	// Returns the color in hex or "" if color doesn't exist.
	//
	/////////////////////////////////////
	checkForCSS3=function(bg){
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
	
	/////////////////////////////////////
	//Main method - this does the actual fading of the background.
	//
	//Called fadeSteps times through recursion
	/////////////////////////////////////
	fadeJQMain=function(element,startcolor,endcolor,step,startr,startg,startb,endr,endg,endb){
		
		//No start color provided - use default
		//Note: the start color is set on the first pass of this method.
		if(startcolor==undefined)startcolor=defaultStartColor;
		
		// No end color provided - find current background color and use as the end color
		//Note: the end color is set on the first pass of this method.
		if(endcolor==undefined){
			if(useExistingAsEnd)endcolor=getBackground();
			else endcolor=defaultEndColor;
		}
		
	
		// This is the first pass - ensure that the start and end colors are in the proper hex format
		if(step==""||step==undefined){
			step=0;
			startcolor=setColor(startcolor);
			endcolor=setColor(endcolor)
		}
		
		
		
		//This is the first pass
		//Need to convert the start and end colors from hex to rgb values
		//The rgb values are needed to help calculate the next colors
		//This conversion is only done on the first pass
		if(startr==undefined){
			var startnums=toNumbers(startcolor);
			var endnums=toNumbers(endcolor);
			startr=startnums[0];
			startg=startnums[1];
			startb=startnums[2];
			endr=endnums[0];
			endg=endnums[1];
			endb=endnums[2];
		}
	
		//Calculate the next rgb values assuming this isn't the last step
		if(step<fadeSteps){
			var r=Math.round(startr+(endr-startr)/fadeSteps*step);
			var g=Math.round(startg+(endg-startg)/fadeSteps*step);
			var b=Math.round(startb+(endb-startb)/fadeSteps*step);
			
			jQuery(element).css('background-color',"rgb("+r+","+g+","+b+")");
			step++;
			
			
			//Recall this method in the given time interval
			setTimeout(function(){
			 fadeJQMain(element,startcolor,endcolor,step,startr,startg,startb,endr,endg,endb);
			
			},fadeInterval);
		
		}
		// This is the last time this method is called - set the background color to the final color
		else{
			jQuery(element).css('background-color',"rgb("+endr+","+endg+","+endb+")");
		}
			
		
		
	};
		
		
	
	
	fadeJQMain(element,startcolor,endcolor); // Call the main method 
	
    return this; //return the DOM object so this plug-in can be daisy chained.
};

