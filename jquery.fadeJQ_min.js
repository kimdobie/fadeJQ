// jquery.fadeJQ.js version 1.0.1
jQuery.fn.fadeJQ=function(i,p){var q=400,e=7,s=true,t="ffff99",r="ffffff",o=this;if(typeof i=="object"){paramObj=i;i=paramObj.startcolor;if(paramObj.endcolor!=undefined)p=paramObj.endcolor;if(paramObj.steps!=undefined)e=paramObj.steps;if(paramObj.interval!=undefined)q=paramObj.interval}toNumbers=function(a){var b=[];a.replace(/(..)/g,function(c){b.push(parseInt(c,16))});return b};setColor=function(a){a=a.replace(/#/,"");if(a.length==3){var b=a.charAt(0)+"",c=a.charAt(1)+"";a=a.charAt(2)+"";a=b+b+ c+c+a+a}a.length!=6&&alert("color string ( "+a+" ) sent to setColor function has incorrect number of digits ( "+a.length+" )");return a};getBackground=function(){var a=checkForCSS3(jQuery(o).css("background-color"));if(a==""){var b=jQuery(o).parents();b.each(function(){if(a=="")a=checkForCSS3(jQuery(this).css("background-color"))})}return a==""?r:a};checkForCSS3=function(a){if(a=="transparent")return"";var b=/rgba\((.+),(.+),(.+),(.+)\)/i.exec(a);if(b!=null){if(parseInt(b[4])==0)return"";return"#"+ (parseInt(b[1]).toString(16)+parseInt(b[2]).toString(16)+parseInt(b[3]).toString(16)).toUpperCase()}else{b=/rgb\((.+),(.+),(.+)\)/i.exec(a);if(b==null)return a;return"#"+(parseInt(b[1]).toString(16)+parseInt(b[2]).toString(16)+parseInt(b[3]).toString(16)).toUpperCase()}};fadeJQMain=function(a,b,c,d,f,j,k,l,m,n){if(b==undefined)b=t;if(c==undefined)c=s?getBackground():r;if(d==""||d==undefined){d=0;b=setColor(b);c=setColor(c)}if(f==undefined){var g=toNumbers(b),h=toNumbers(c);f=g[0];j=g[1];k=g[2];l= h[0];m=h[1];n=h[2]}if(d<e){g=Math.round(f+(l-f)/e*d);h=Math.round(j+(m-j)/e*d);var u=Math.round(k+(n-k)/e*d);jQuery(a).css("background-color","rgb("+g+","+h+","+u+")");d++;setTimeout(function(){fadeJQMain(a,b,c,d,f,j,k,l,m,n)},q)}else jQuery(a).css("background-color","rgb("+l+","+m+","+n+")")};fadeJQMain(o,i,p);return this};