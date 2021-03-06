function powerlessSnail(Data){

    const automaticVars = ["$$", "$?", "$^", "$_", "$args", "$ConsoleFileName", "$Error", "$ErrorView", "$Event", "$EventArgs", "$EventSubscriber", "$ExecutionContext", "$false", "$foreach", "$HOME", "$Host", "$input", "$IsCoreCLR", "$IsLinux", "$IsMacOS", "$IsWindows", "$LastExitCode", "$Matches", "$MyInvocation", "$NestedPromptLevel", "$null", "$PID", "$PROFILE", "$PSBoundParameters", "$PSCmdlet", "$PSCommandPath", "$PSCulture", "$PSDebugContext", "$PSHOME", "$PSItem", "$PSNativeCommandArgumentPassing", "$PSScriptRoot", "$PSSenderInfo", "$PSStyle", "$PSUICulture", "$PSVersionTable", "$PWD", "$Sender", "$ShellId", "$StackTrace", "$switch", "$this", "$true"];
    const LC_automaticVars = automaticVars.map(name => name.toLowerCase());
    const preferenceVars = ["$ConfirmPreference", "$DebugPreference", "$ErrorActionPreference", "$ErrorView", "$FormatEnumerationLimit", "$InformationPreference", "$LogCommandHealthEvent", "$LogCommandLifecycleEvent", "$LogEngineHealthEvent", "$LogEngineLifecycleEvent", "$LogProviderLifecycleEvent", "$LogProviderHealthEvent", "$MaximumHistoryCount", "$OFS", "$OutputEncoding", "$ProgressPreference", "$PSDefaultParameterValues", "$PSEmailServer", "$PSModuleAutoLoadingPreference", "$PSSessionApplicationName", "$PSSessionConfigurationName", "$PSSessionOption", "$Transcript", "$VerbosePreference", "$WarningPreference", "$WhatIfPreference"];
    const LC_preferenceVars = preferenceVars.map(name => name.toLowerCase());
    const scopeVars = ["$env:", "$global:", "$local:", "$private:", "$script:", "$using:", "$workflow:", "$alias:", "$function:", "$variable:"];
    const LC_scopeVars = scopeVars.map(name => name.toLowerCase());
    const aliases = ["?","Where-Object","%","ForEach-Object","cd","Set-Location","chdir","Set-Location","clc","Clear-Content","clear","Clear-Host","clhy","Clear-History","cli","Clear-Item","clp","Clear-ItemProperty","cls","Clear-Host","clv","Clear-Variable","cnsn","Connect-PSSession","copy","Copy-Item","cpi","Copy-Item","cvpa","Convert-Path","dbp","Disable-PSBreakpoint","del","Remove-Item","dir","Get-ChildItem","dnsn","Disconnect-PSSession","ebp","Enable-PSBreakpoint","echo","Write-Output","epal","Export-Alias","epcsv","Export-Csv","erase","Remove-Item","etsn","Enter-PSSession","exsn","Exit-PSSession","fc","Format-Custom","fhx","Format-Hex","fl","Format-List","foreach","ForEach-Object","ft","Format-Table","fw","Format-Wide","gal","Get-Alias","gbp","Get-PSBreakpoint","gc","Get-Content","gci","Get-ChildItem","gcm","Get-Command","gcs","Get-PSCallStack","gdr","Get-PSDrive","ghy","Get-History","gi","Get-Item","gjb","Get-Job","gl","Get-Location","gm","Get-Member","gmo","Get-Module","gp","Get-ItemProperty","gps","Get-Process","gpv","Get-ItemPropertyValue","group","Group-Object","gsn","Get-PSSession","gtz","Get-TimeZone","gu","Get-Unique","gv","Get-Variable","h","Get-History","history","Get-History","icm","Invoke-Command","iex","Invoke-Expression","ihy","Invoke-History","ii","Invoke-Item","ipal","Import-Alias","ipcsv","Import-Csv","ipmo","Import-Module","irm","Invoke-RestMethod","iwr","Invoke-WebRequest","kill","Stop-Process","md","mkdir","measure","Measure-Object","mi","Move-Item","move","Move-Item","mp","Move-ItemProperty","nal","New-Alias","ndr","New-PSDrive","ni","New-Item","nmo","New-Module","nsn","New-PSSession","nv","New-Variable","oh","Out-Host","popd","Pop-Location","pushd","Push-Location","pwd","Get-Location","r","Invoke-History","rbp","Remove-PSBreakpoint","rcjb","Receive-Job","rcsn","Receive-PSSession","rd","Remove-Item","rdr","Remove-PSDrive","ren","Rename-Item","ri","Remove-Item","rjb","Remove-Job","rmo","Remove-Module","rni","Rename-Item","rnp","Rename-ItemProperty","rp","Remove-ItemProperty","rsn","Remove-PSSession","rv","Remove-Variable","rvpa","Resolve-Path","sajb","Start-Job","sal","Set-Alias","saps","Start-Process","sbp","Set-PSBreakpoint","sc","Set-Content","select","Select-Object","set","Set-Variable","si","Set-Item","sl","Set-Location","sls","Select-String","sp","Set-ItemProperty","spjb","Stop-Job","spps","Stop-Process","sv","Set-Variable","type","Get-Content","where","Where-Object","wjb","Wait-Job"];
    const LC_aliases = aliases.map(name => name.toLowerCase());

    var escapes = [];
    var stack = [];
    var variables = [];
    var scopes = [];
    var functions = [];

    var escaped = false;
    var inquotes1 = false;
    var inquotes2 = false;
    var variable = false;
    var semicolon = false;
    var comment = false;
    var multilinecomment = false;
    var athere1 = false;
    var athere2 = false;

    for(var x = 0; x < Data.length; x++){

        if(Data.charAt(x) == "`" && escapes.length == 0 && inquotes1 == false && inquotes2 == false && comment == false && multilinecomment == false && athere1 == false && athere2 == false){
            escapes.push("`");
            escaped = true;
        }
        else if(Data.charAt(x) == "\"" && inquotes2 == false && variable == false && escaped == false && comment == false && multilinecomment == false && athere1 == false && athere2 == false){
            if((stack.length-1) >=0 && stack[stack.length - 1] == "\"" && Data.charAt(x-1) != "@" && Data.charAt(x+1) != "@"){
                    stack.pop();
                    inquotes1 = false;
            }
            else if((stack.length-1) >=0 && stack[stack.length - 1] != "\""){
                    stack.push("\"");
                    inquotes1 = true;
            }
            else if((stack.length-1) < 0){
                    stack.push("\"");
                    inquotes1 = true;
            }
        }
        else if(Data.charAt(x) == "\'" && inquotes1 == false && variable == false && escaped == false && comment == false && multilinecomment == false && athere1 == false && athere2 == false){
            if((stack.length-1) >=0 && stack[stack.length - 1] == "\'" && Data.charAt(x-1) != "@" && Data.charAt(x+1) != "@"){
                    stack.pop();
                    inquotes2 = false;
            }
            else if((stack.length-1) >=0 && stack[stack.length - 1] != "\'"){
                    stack.push("\'");
                    inquotes2 = true;
            }
            else if((stack.length-1) < 0){
                    stack.push("\'");
                    inquotes2 = true;
            }
        }
        else if(Data.charAt(x) == "$" && escaped == false && variable == false && inquotes1 == false && inquotes2 == false && comment == false && Data.charAt(x+1) == "{" && multilinecomment == false && athere1 == false && athere2 == false){
                variable = true;
        }
        else if(Data.charAt(x) == "{" && escaped == false && inquotes1 == false && inquotes2 == false && variable == true && comment == false && multilinecomment == false && athere1 == false && athere2 == false){
            stack.push("{");
            if(stack.includes("{")){
                variable = true;
            }
            else{
                variable = false;
            }
        }
        else if(Data.charAt(x) == "}" && escaped == false && inquotes1 == false && inquotes2 == false && variable == true && comment == false && multilinecomment == false && athere1 == false && athere2 == false){
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
        else if(Data.charAt(x) == ";" && escaped == false && inquotes1 == false && inquotes2 == false && variable == false && comment == false && multilinecomment == false && athere1 == false && athere2 == false){
            semicolon = true;
        }
        else if(Data.charAt(x) == "#" && escaped == false && inquotes1 == false && inquotes2 == false && variable == false && multilinecomment == false && comment == false && athere1 == false && athere2 == false){
            comment = true;
        }
        else if(Data.charAt(x) == "<" && Data.charAt(x+1) == "#" && escaped == false && inquotes1 == false && inquotes2 == false && variable == false && comment == false && multilinecomment == false && athere1 == false && athere2 == false){
            multilinecomment = true;
        }
        else if(Data.charAt(x) == "@" && Data.charAt(x+1) == "\"" && variable == false && escaped == false && comment == false && multilinecomment == false && athere1 == false && athere2 == false && inquotes1 == false && inquotes2 == false){
                    stack.push("@\"");
                    x = x + 1;
                    athere1 = true;
        }
        else if(Data.charAt(x) == "\"" && Data.charAt(x+1) == "@" && variable == false && escaped == false && comment == false && multilinecomment == false && athere1 == true && inquotes1 == false && inquotes2 == false){
                    if(stack[stack.length - 1] == "@\""){
                        stack.pop();
                        x = x + 1;
                        if(stack.includes("@\"") || stack.includes("@\'")){
                            athere1 = true;
                        }
                        else{
                            athere1 = false;
                        }
                    }
        }
        else if(Data.charAt(x) == "@" && Data.charAt(x+1) == "\'" && variable == false && escaped == false && comment == false && multilinecomment == false && athere1 == false && athere2 == false && inquotes1 == false && inquotes2 == false){
                    stack.push("@\'");
                    x = x + 1;
                    athere2 = true;
        }
        else if(Data.charAt(x) == "\'" && Data.charAt(x+1) == "@" && variable == false && escaped == false && comment == false && multilinecomment == false && athere2 == true && inquotes1 == false && inquotes2 == false){
                    if(stack[stack.length - 1] == "@\'"){
                        stack.pop();
                        x = x + 1;
                        if(stack.includes("@\"") || stack.includes("@\'")){
                            athere2 = true;
                        }
                        else{
                            athere2 = false;
                        }
                    }
        }
        else if(Data.charAt(x) == "$" && Data.charAt(x+1) != "{" && variable == false && escaped == false && comment == false && multilinecomment == false  && inquotes1 == false && inquotes2 == false && athere2 == false){
            x = x + 1;
            var y = x;
            var z = y;
            var complexVar = false;
            var modifications = 0;
            while(true){
                if(Data.charAt(x) == ":" && complexVar == false){
                    var scope = Data.slice(y, x);
                    if(scopes.includes(scope) == false && LC_scopeVars.includes(scope.toLowerCase()) == false){
                        modifications = 1;
                        scopes.push(scope);
                    }
                    else if(LC_scopeVars.includes(scope.toLowerCase()) == true){
                        modifications = 1;
                        scopes.push("LC_scopeVars$" + LC_scopeVars.indexOf(scope));
                    }
                    else if(scopes.includes(scope)){
                        modifications = 1;
                        scopes.push("scopes$" + scopes.indexOf(scope));
                    }
                    y = x + 1;
                }
                else if(Data.charAt(x) == "{"){
                    complexVar = true;
                }
                else if(Data.charAt(x) == "}" && complexVar == true){
                    complexVar = false;
                    var variable = Data.slice(y, x+1);
                    if(variables.includes(variable) == false && LC_automaticVars.includes(variable.toLowerCase()) == false && LC_preferenceVars.includes(variable.toLowerCase()) == false){
                        if(modifications == 0){
                            modifications = 2;
                        }
                        else if(modifications == 1){
                            modifications = 3;
                        }
                        variables.push(variable);
                    }
                    else if(LC_automaticVars.includes(variable.toLowerCase()) == true){
                        if(modifications == 0){
                            modifications = 2;
                        }
                        else if(modifications == 1){
                            modifications = 3;
                        }
                        variables.push("LC_automaticVars$" + LC_automaticVars.indexOf(variable));
                    }
                    else if(LC_preferenceVars.includes(variable.toLowerCase()) == true){
                        if(modifications == 0){
                            modifications = 2;
                        }
                        else if(modifications == 1){
                            modifications = 3;
                        }
                        variables.push("LC_preferenceVars$" + LC_preferenceVars.indexOf(variable));
                    }
                    else if(variables.includes(variable)){
                        if(modifications == 0){
                            modifications = 2;
                        }
                        else if(modifications == 1){
                            modifications = 3;
                        }
                        variables.push("variables$" + variables.indexOf(variable));         
                    }
                }
                else if(/[A-Za-z0-9_$?^]/.test(Data.charAt(x)) == false && complexVar == false){
                    var variable = Data.slice(y, x+1);
                   var variable = Data.slice(y, x+1);
                    if(variables.includes(variable) == false && LC_automaticVars.includes(variable.toLowerCase()) == false && LC_preferenceVars.includes(variable.toLowerCase()) == false){
                        if(modifications == 0){
                            modifications = 2;
                        }
                        else if(modifications == 1){
                            modifications = 3;
                        }
                        variables.push(variable);
                    }
                    else if(LC_automaticVars.includes(variable.toLowerCase()) == true){
                        if(modifications == 0){
                            modifications = 2;
                        }
                        else if(modifications == 1){
                            modifications = 3;
                        }
                        variables.push("LC_automaticVars$" + LC_automaticVars.indexOf(variable));
                    }
                    else if(LC_preferenceVars.includes(variable.toLowerCase()) == true){
                        if(modifications == 0){
                            modifications = 2;
                        }
                        else if(modifications == 1){
                            modifications = 3;
                        }
                        variables.push("LC_preferenceVars$" + LC_preferenceVars.indexOf(variable));
                    }
                    else if(variables.includes(variable)){
                        if(modifications == 0){
                            modifications = 2;
                        }
                        else if(modifications == 1){
                            modifications = 3;
                        }
                        variables.push("variables$" + variables.indexOf(variable));         
                    }
                }

                if(modifications == 2){
                    scopes.push("");
                    if(variables[variables.length - 1].includes("LC_automaticVars$")){
                        break;
                    }
                    else if(variables[variables.length - 1].includes("LC_preferenceVars$")){
                        break;
                    }
                    else if(variables[variables.length - 1].includes("variables$")){
                        var variable = "var" + variables[variables.length - 1].split("$")[1];
                        Data = Data.slice(0,y) + variable + Data.slice(x+1);
                        break;
                    }
                    else{
                        var variable = "var" + (variables.length - 1);
                        Data = Data.slice(0,y) + variable + Data.slice(x+1);
                        break;
                    }
                }
                else if(modifications == 3){                   
                    if(){

                    }
                    else if(){

                    }
                    else{
                        
                    }

                    if(variables[variables.length - 1].includes("LC_automaticVars$")){
                        break;
                    }
                    else if(variables[variables.length - 1].includes("LC_preferenceVars$")){
                        break;
                    }
                    else if(variables[variables.length - 1].includes("variables$")){

                        break;
                    }
                    else{

                        break;
                    }
                }

                x++;
            }
        }



        if(escaped == true && inquotes1 == false && inquotes2 == false && comment == false && multilinecomment == false && athere1 == false && athere2 == false){
            Data = Data.slice(0, x) + Data.slice(x+2);
            x -= 1;
            escapes.pop();
            escaped = false;
        }

        if(semicolon == true && variable == false && inquotes1 == false && inquotes2 == false && comment == false && multilinecomment == false && athere1 == false && athere2 == false){
            Data = Data.slice(0, x+1) + "\n" + Data.slice(x+1);
            x += 1;
            semicolon = false;
        }

        if(comment == true && variable == false && inquotes1 == false && inquotes2 == false && escaped == false && multilinecomment == false && athere1 == false && athere2 == false){
            var y = x;
            while(Data.charAt(x) != "\n"){
                x++;
            }
            Data = Data.slice(0,y) + Data.slice(x+1);
            x = y - 1;
            comment = false;
        }

        if(multilinecomment == true && variable == false && inquotes1 == false && inquotes2 == false && escaped == false && comment == false && athere1 == false && athere2 == false){
            x = x + 2
            var y = x - 2;
            while(true){
                if((Data.charAt(x) == "#" && Data.charAt(x+1) == ">") || x >= Data.length){
                    break;
                }
                else{
                x++;
                }
            }
                Data = Data.slice(0,y) + Data.slice(x+2);
                x = y - 1;
                multilinecomment = false;
        }
        
        var balance = "";
        
        if(x == (Data.length - 1) && stack.length > 0){
            for(y in stack){
                if(stack[y] == "{"){
                    balance = balance + "}";
                }
                else if(stack[y] == "@\""){
                    balance = balance + "\"@";
                    console.log(x);
                }
                else if(stack[y] == "@\'"){
                    balance = balance + "\'@";
                }
                else{
                    balance = balance + stack[stack.length-1-y];
                }
            }
        }

    }

    if(balance != ""){
    Data = Data.slice(0, Data.length);
    Data = Data + balance;
    }

    return Data;

}


function powerSnail(){
    document.getElementById("outputbox").value = "";

    var inputData = "";

    if(document.getElementById("inputbox").value != ""){
        inputData = document.getElementById("inputbox").value;
        
        inputData = powerlessSnail(inputData);
        document.getElementById("outputbox").value = inputData;

    }
}
