//Function Removes Escapes and Distributes Data Based on Semicolon
function removeEscapesAndBalanceSemicolons(Data){

    var escapes = [];
    var stack = [];

    var escaped = false;
    var inquotes = false;
    var variable = false;
    var semicolon = false;

    for(var x = 0; x < Data.length; x++){

        if(Data.charAt(x) == "`"){
            if(escapes.length == 0 && inquotes == false){
                escapes.push("`");
                escaped = true;
            }
            else{
                x += 1;
            }
        }
        else if(Data.charAt(x) == "\"" && escaped == false){
            if((stack.length-1) >=0 && stack[stack.length - 1] == "\""){
                if(escaped == false){
                    stack.pop();
                    if(stack.includes("\"") || stack.includes("\'")){
                        inquotes = true;
                    }
                    else{
                        inquotes = false;
                    }
                }
            }
            else if((stack.length-1) >=0 && stack[stack.length - 1] != "\""){
                if(escaped == false){
                    stack.push("\"");
                    if(stack.includes("\"") || stack.includes("\'")){
                        inquotes = true;
                    }
                    else{
                        inquotes = false;
                    }
                }
            }
            else if((stack.length-1) < 0){
                if(escaped == false){
                    stack.push("\"");
                    inquotes = true;
                }
            }
        }
        else if(Data.charAt(x) == "\'" && escaped == false && variable == false){
            if((stack.length-1) >=0 && stack[stack.length - 1] == "\'"){
                if(escaped == false){
                    stack.pop();
                    if(stack.includes("\"") || stack.includes("\'")){
                        inquotes = true;
                    }
                    else{
                        inquotes = false;
                    }
                }
            }
            else if((stack.length-1) >=0 && stack[stack.length - 1] != "\'"){
                if(escaped == false){
                    stack.push("\'");
                    if(stack.includes("\"") || stack.includes("\'")){
                        inquotes = true;
                    }
                    else{
                        inquotes = false;
                    }
                }
            }
            else if((stack.length-1) < 0){
                if(escaped == false){
                    stack.push("\'");
                    inquotes = true;
                }
            }
        }
        else if(Data.charAt(x) == "$" && escaped == false && variable == false && inquotes == false && (x+1)<Data.length && Data.charAt(x+1) == "{"){
                variable = true;
        }
        else if(Data.charAt(x) == "{" && escaped == false && inquotes == false && variable == true){
            stack.push("{");
            if(stack.includes("{")){
                variable = true;
            }
            else{
                variable = false;
            }
        }
        else if(Data.charAt(x) == "}" && escaped == false && inquotes == false && variable == true){
            if(stack[stack.length -1] == "{"){
            stack.pop();    
            }            
            if(stack.includes("{")){
                variable = true;
            }
            else{
                variable = false;
            }
        }
        else if(Data.charAt(x) == ";"){
            if(escaped == false && inquotes == false && variable == false){
                semicolon = true;
            }
        }

        if(escaped == true && inquotes == false){
            if(Data.length>(x+2)){
                Data = Data.slice(0, x) + Data.slice(x+2);
                x -= 1;
            }
            else{
                Data = Data.slice(0, x-1);
                x -= 1;
            }
            escapes.pop();
            escaped = false;
        }

        if(semicolon == true && variable == false && inquotes == false){
            if((x+1)<Data.length){
                Data = Data.slice(0, x+1) + "\n" + Data.slice(x+1);
                x += 1;
                semicolon = false;
            }
            else{
                Data = Data.slice(0, x) + "\n" + Data.slice(x);
                x += 1;
                semicolon = false;
            }
        }

        if(x == (Data.length - 1) && stack.length > 0){
            for(y in stack){
                Data = Data.slice(0,Data.length-1);
                if(stack[y] == "{"){
                    Data = Data + "}";
                }
                else{
                    Data = Data + stack[stack.length-1-y];
                }
            }
        }
    }

    return Data;

}


function powerSnail(){
    //Cleaning outputbox
    document.getElementById("outputbox").value = "";

    var inputData = "";
    var re = new RegExp("");

    //Pre-defined Values
    const automaticVars = ["$$", "$?", "$^", "$_", "$args", "$ConsoleFileName", "$Error", "$ErrorView", "$Event", "$EventArgs", "$EventSubscriber", "$ExecutionContext", "$false", "$foreach", "$HOME", "$Host", "$input", "$IsCoreCLR", "$IsLinux", "$IsMacOS", "$IsWindows", "$LastExitCode", "$Matches", "$MyInvocation", "$NestedPromptLevel", "$null", "$PID", "$PROFILE", "$PSBoundParameters", "$PSCmdlet", "$PSCommandPath", "$PSCulture", "$PSDebugContext", "$PSHOME", "$PSItem", "$PSNativeCommandArgumentPassing", "$PSScriptRoot", "$PSSenderInfo", "$PSStyle", "$PSUICulture", "$PSVersionTable", "$PWD", "$Sender", "$ShellId", "$StackTrace", "$switch", "$this", "$true"];
    const LC_automaticVars = automaticVars.map(name => name.toLowerCase());
    const preferenceVars = ["$ConfirmPreference", "$DebugPreference", "$ErrorActionPreference", "$ErrorView", "$FormatEnumerationLimit", "$InformationPreference", "$LogCommandHealthEvent", "$LogCommandLifecycleEvent", "$LogEngineHealthEvent", "$LogEngineLifecycleEvent", "$LogProviderLifecycleEvent", "$LogProviderHealthEvent", "$MaximumHistoryCount", "$OFS", "$OutputEncoding", "$ProgressPreference", "$PSDefaultParameterValues", "$PSEmailServer", "$PSModuleAutoLoadingPreference", "$PSSessionApplicationName", "$PSSessionConfigurationName", "$PSSessionOption", "$Transcript", "$VerbosePreference", "$WarningPreference", "$WhatIfPreference"];
    const LC_preferenceVars = preferenceVars.map(name => name.toLowerCase());
    const scopeVars = ["$env:", "$global:", "$local:", "$private:", "$script:", "$using:", "$workflow:", "$alias:", "$function:", "$variable:"];
    const LC_scopeVars = scopeVars.map(name => name.toLowerCase());
    const aliases = ["\\?","Where-Object","%","ForEach-Object","cd","Set-Location","chdir","Set-Location","clc","Clear-Content","clear","Clear-Host","clhy","Clear-History","cli","Clear-Item","clp","Clear-ItemProperty","cls","Clear-Host","clv","Clear-Variable","cnsn","Connect-PSSession","copy","Copy-Item","cpi","Copy-Item","cvpa","Convert-Path","dbp","Disable-PSBreakpoint","del","Remove-Item","dir","Get-ChildItem","dnsn","Disconnect-PSSession","ebp","Enable-PSBreakpoint","echo","Write-Output","epal","Export-Alias","epcsv","Export-Csv","erase","Remove-Item","etsn","Enter-PSSession","exsn","Exit-PSSession","fc","Format-Custom","fhx","Format-Hex","fl","Format-List","foreach","ForEach-Object","ft","Format-Table","fw","Format-Wide","gal","Get-Alias","gbp","Get-PSBreakpoint","gc","Get-Content","gci","Get-ChildItem","gcm","Get-Command","gcs","Get-PSCallStack","gdr","Get-PSDrive","ghy","Get-History","gi","Get-Item","gjb","Get-Job","gl","Get-Location","gm","Get-Member","gmo","Get-Module","gp","Get-ItemProperty","gps","Get-Process","gpv","Get-ItemPropertyValue","group","Group-Object","gsn","Get-PSSession","gtz","Get-TimeZone","gu","Get-Unique","gv","Get-Variable","h","Get-History","history","Get-History","icm","Invoke-Command","iex","Invoke-Expression","ihy","Invoke-History","ii","Invoke-Item","ipal","Import-Alias","ipcsv","Import-Csv","ipmo","Import-Module","irm","Invoke-RestMethod","iwr","Invoke-WebRequest","kill","Stop-Process","md","mkdir","measure","Measure-Object","mi","Move-Item","move","Move-Item","mp","Move-ItemProperty","nal","New-Alias","ndr","New-PSDrive","ni","New-Item","nmo","New-Module","nsn","New-PSSession","nv","New-Variable","oh","Out-Host","popd","Pop-Location","pushd","Push-Location","pwd","Get-Location","r","Invoke-History","rbp","Remove-PSBreakpoint","rcjb","Receive-Job","rcsn","Receive-PSSession","rd","Remove-Item","rdr","Remove-PSDrive","ren","Rename-Item","ri","Remove-Item","rjb","Remove-Job","rmo","Remove-Module","rni","Rename-Item","rnp","Rename-ItemProperty","rp","Remove-ItemProperty","rsn","Remove-PSSession","rv","Remove-Variable","rvpa","Resolve-Path","sajb","Start-Job","sal","Set-Alias","saps","Start-Process","sbp","Set-PSBreakpoint","sc","Set-Content","select","Select-Object","set","Set-Variable","si","Set-Item","sl","Set-Location","sls","Select-String","sp","Set-ItemProperty","spjb","Stop-Job","spps","Stop-Process","sv","Set-Variable","type","Get-Content","where","Where-Object","wjb","Wait-Job"];
    const LC_aliases = aliases.map(name => name.toLowerCase());

    //Run JS if Input is Valid
    if(document.getElementById("inputbox").value != ""){
        inputData = document.getElementById("inputbox").value;
        inputData = inputData + "\n";


        inputData = removeEscapesAndBalanceSemicolons(inputData);
        console.log(inputData);

        return;

        //Removal of MultiLine Comments
        re = new RegExp(/<#[\s\S]*?#>/g);
        inputData = inputData.replaceAll(re, "");

        //Removal of Single Line Comments
        var indexes = [];
        re = new RegExp(/(?:(["'])(?:.)*?\1|[^#])+|#.*/gm);
        while ((match = re.exec(inputData)) != null) {
            if(match[0].charAt(0) == "#"){
                indexes.push(match.index);
                indexes.push(match[0].length);
            }
        }

        for(var x = 0; x < indexes.length;x+=2){
            var temp = indexes[x]+indexes[x+1]+1;
            inputData = inputData.slice(0, indexes[x]) + inputData.slice(temp);
            if((x+2) < indexes.length){
                indexes[x+2] = indexes[x+2] - indexes[x+1] -1;
            }
        }

        
        //Removal of Escapes //Work
        re = new RegExp(/`[\s\S]{1}/g);
        inputData = inputData.replaceAll(re, "");

        var functions = [];
        var variables = [];
        var scopes = [];

        re = new RegExp(/\$[A-Za-z0-9_]*[:]{0,1}(\{(?:[^\{\}]+|(R))*\}|[A-Za-z0-9_]+)/g);
        var vars = inputData.match(re);
        if(vars){
                vars = vars.map(name => name.toLowerCase());
                

                //Finding Variables that need to be replaced with understandable counterparts
                for(x in vars){
                    if(vars[x].includes(":") && vars[x].includes("{")){
                        if(vars[x].indexOf(":") < vars[x].indexOf("{")){
                            var temp = vars[x].split(":");
                            var index = -1;
                            if(LC_scopeVars.includes(temp[0]+":")){
                                index = LC_scopeVars.indexOf(temp[0]+":");
                                index = index+400;
                            }
                            else if(scopes.includes(temp[0] + ":")){
                                index = scopes.indexOf(temp[0]+":");
                            }
                            else{
                                scopes.push(temp[0]+":");
                                index = scopes.indexOf(temp[0]+":")
                            }

                            if(LC_automaticVars.includes("$"+temp[1]) || LC_preferenceVars.includes("$"+temp[1])){
                                //Change nothing - For future Development
                            }
                            else{
                                if(variables.includes("sc" + index + "$"+temp[1])){
                                     //Change nothing - For future Development
                                }
                                else{
                                    variables.push("sc" + index + "$"+temp[1]);
                                }
                            }

                        }
                    }
                    else if(vars[x].includes(":") && !vars[x].includes("{")){
                        var temp = vars[x].split(":");
                        var index = -1;
                        if(LC_scopeVars.includes(temp[0] + ":")){
                            index = LC_scopeVars.indexOf(temp[0]+":");
                            index = index+400;
                        }
                        else if(scopes.includes(temp[0] + ":")){
                            index = scopes.indexOf(temp[0]+":");
                        }
                        else{
                            scopes.push(temp[0]+":");
                            index = scopes.indexOf(temp[0]+":")
                        }

                        if(LC_automaticVars.includes("$"+temp[1]) || LC_preferenceVars.includes("$"+temp[1])){
                            //Change nothing - For future Development
                        }
                        else{
                            if(variables.includes("sc" + index + "$"+temp[1])){
                               //Change nothing - For future Development
                            }
                            else{
                                 variables.push("sc" + index + "$"+temp[1]);
                            }
                        }

                    }
                    else if(!vars[x].includes(":")){
                        if(LC_automaticVars.includes(vars[x]) || LC_preferenceVars.includes(vars[x])){
                            //Change nothing - For future Development
                        }
                        else{
                            if(variables.includes(vars[x])){
                                //Change nothing - For future Development
                            }
                            else{
                                 variables.push(vars[x]);
                            }
                        }
                    }
                }

                //Replacing scopes with understandable counterparts
                for(x in variables){
                    if(variables[x].startsWith("sc")){
                        var temp = variables[x].split("$");
                        temp[0] = temp[0].replace("sc", "");
                        temp[0] = parseInt(temp[0]);
                        var scope = "";
                        if(temp[0] >= 400){
                            temp[0] = temp[0] - 400;
                            if(temp[0] > 0){
                            scope = LC_scopeVars[temp[0]];
                            scope = scope.replace("$", "");
                            re = new RegExp("(?<![\\w\\d])"+scope+temp[1]+"(?![\\w\\d])", "gi");
                            inputData = inputData.replaceAll(re, ""+scope+"var"+variables.indexOf(variables[x]));
                            }
                            else{
                                //Retaining $env variable parameters
                            }
                        }
                        else{
                            scope = scopes[temp[0]];
                            scope = scope.replace("$", "");
                            re = new RegExp("(?<![\\w\\d])"+scope+temp[1]+"(?![\\w\\d])", "gi");
                            inputData = inputData.replaceAll(re, "scope"+temp[0]+":var"+variables.indexOf(variables[x]));
                        }
                    }
               }

               //Replacing variables with understandable counterparts
               for(x in variables){
                    if(!variables[x].startsWith("sc")){
                    re = new RegExp("(?<![\\w\\d])"+variables[x].replace("$","")+"(?![\\w\\d])", "gi");
                    inputData = inputData.replaceAll(re,"var" + variables.indexOf(variables[x]));
                    }
               }

            }

        //Finding and Replacing Functions that need to be replaced with understandable counterparts
        re = new RegExp(/[A-Za-z0-9_]*[:]{0,1}function(.*?){/g);
        var funcs = inputData.match(re);
        if(funcs){
        funcs = funcs.map(name => name.toLowerCase());
        

            for(x in funcs){
                    if(functions.includes(funcs[x].split("{")[0].split("(")[0].replace("function","").trim())){
                        //Do nothing here - For future development
                    }
                    else{
                        functions.push(funcs[x].split("{")[0].split("(")[0].replace("function","").trim());
                        
                    }
            }


            for(x in functions){
                if(functions[x].includes(":")){
                 var temp = functions[x].split(":");
                 var LC_has = -1;
                 for(y in LC_scopeVars){
                    if(LC_scopeVars[y].replace("$", "").replace(":","").includes(temp[0])){
                        LC_has = y;
                        break;
                    }
                 }


                 if(LC_has != -1){
                    re = new RegExp("(?<![\\w\\d])"+temp[0]+":"+temp[1]+"(?![\\w\\d])", "gi");
                    inputData = inputData.replaceAll(re, LC_scopeVars[LC_has].replace("$","").replace(":","")+":"+"func"+functions.indexOf(functions[x]));
                 }
                 else{
                    
                    for(y in scopes){
                        if(scopes[y].replace("$", "").replace(":","").includes(temp[0])){
                            LC_has = y;
                            break;
                        }                        
                    }

                    if(LC_has != -1){
                    re = new RegExp("(?<![\\w\\d])"+temp[0]+":"+temp[1]+"(?![\\w\\d])", "gi");
                    inputData = inputData.replaceAll(re, "scope"+LC_has+":"+"func"+functions.indexOf(functions[x]));
                    }
                    else{
                        scopes.push("$"+temp[0]+":");
                        LC_has = scopes.indexOf("$" + temp[0] + ":");
                        re = new RegExp("(?<![\\w\\d])"+temp[0]+":"+temp[1]+"(?![\\w\\d])", "gi");
                        inputData = inputData.replaceAll(re, "scope"+LC_has+":"+"func"+functions.indexOf(functions[x]));
                    }

                 }


                }
                else{
                    re = new RegExp("(?<![\\w\\d])"+functions[x]+"(?![\\w\\d])", "gi");
                    inputData = inputData.replaceAll(re, "func" + functions.indexOf(functions[x]));
                }
            }

        }

        //Alias
        for(x = 0; x<LC_aliases.length; x=x+2){
            re = new RegExp("(?<![\\w\\d-])"+LC_aliases[x]+"(?![\\w\\d-])", "gi");
            inputData = inputData.replaceAll(re, aliases[x+1]);
        }

        //Beautification
        inputData = inputData.split("\n");
        for(x in inputData){
            inputData[x] = inputData[x].trim();
        }
        
        inputData = inputData.filter(n => n);
        var outputData = "";

        //Line Break on ; character
        for(x in inputData){
            indexes = [];
            re = new RegExp(/(?:(["'])(?:\\.|.)*?\1|[^;])+|;/gm);
            while ((match = re.exec(inputData[x])) != null) {
                if(match[0].length == 1){
                    indexes.push(match.index);
                }
            }
            for(y in indexes){
                inputData[x] = inputData[x].slice(0,indexes[y]+1) + "\n" + inputData[x].slice(indexes[y]+1);
                for(z in indexes){
                    indexes[z] = indexes[z] + 1;
                }
            }


            re = new RegExp(/\n[\s]*/gm)
            inputData[x] = inputData[x].replaceAll(re, "\n");

        }



        for(x in inputData){
            outputData = outputData + inputData[x] + "\n";
        }

        //Output to outputbox
        document.getElementById("outputbox").value = outputData;
    }
}
