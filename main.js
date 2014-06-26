define(function (require, exports, module) {
    'use strict';
    
    //Load Modules
    var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror"),
        LanguageManager = brackets.getModule("language/LanguageManager");
    
    
    function log(s) {
        console.log("[PS-DevKit] "+s);
    }
    
    
    function keyWordCheck(st){
        
        var psKeywords = ["For", "If", "Add-PSSnapin", "While", "-lt", "-eq"];
        var stat = "";
        for (var i = 0; i < psKeywords.length; i++){
            if (st.match(psKeywords[i])){
                stat = true;
            } else {
                stat = false;
            }
        log(psKeywords[i]);
        return stat;
        }
    }
    
    //Define PowerShell
    CodeMirror.defineMode("powershell", function() {
    return {
        startState: function() {return {inString: false};},
        token: function(stream, state) {
            
            // If a string starts here
            if (!state.inString && stream.peek() == '"') { 
                stream.next();            // Skip quote
                state.inString = true;    // Update state     
            }
            
            
            if (!state.inString && (keyWordCheck(stream))){
        
                stream.next();
                return "keyword";
                
            }
            
            if (state.inString) {
                
                if (stream.skipTo('"')) { // Quote found on this line
                    stream.next();          // Skip quote
                    state.inString = false; // Clear flag
                } else {
                    stream.skipToEnd();    // Rest of line is string
                }
                
                return "string";          // Token style
            
            } else {
                stream.skipTo('"') || stream.skipToEnd();
                return null;              // Unstyled token
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

    log("The PowerShell extension has loaded!");

});