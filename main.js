define(function (require, exports, module) {
    'use strict';
    
    //Load Modules
    var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        LanguageManager = brackets.getModule("language/LanguageManager");
    
    
    //Define PowerShell
    CodeMirror.defineMode("powershell", function() {
        return{
            
        startStat: function() {return {inString: false};},
        token: function(stream, state){
            //If a string starts here
            if (!state.inString && stream.peek() == '"'){
                stream.next();              //Skip quote
                state.inString = true;      //Update state
            }
            
            if (state.inString) {
                
                if (stream.skipTo('"')){    //Quote found on this line
                    stream.next();          //Skip quote
                    state.inString=false;   //Clear flag
                } else {
                    stream.skipToEnd();     //Rest of line is string
                }
                
                return "red-text";          //Token style
                
            } else {
                
                stream.skipTo('"') || stream.skipToEnd();
                return "red-text";          //Unstyled token
                
                }   
            }  
        };    
    });
    
    
    //Define language
    LanguageManager.defineLanguage("powershell", {
    name: "PowerShell",
    mode: "powershell",
    fileExtensions: ["ps1"],
    lineComment: ["\/\/"]
    });
    
    function log(s) {
            console.log("[PS-DevKit] "+s);
    }

    log("The PowerShell extension has loaded!");

});