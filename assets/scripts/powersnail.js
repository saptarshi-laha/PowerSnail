function powerlessSnail(Data){

    const automaticVars = ["$$", "$?", "$^", "$_", "$args", "$ConsoleFileName", "$Error", "$ErrorView", "$Event", "$EventArgs", "$EventSubscriber", "$ExecutionContext", "$false", "$foreach", "$HOME", "$Host", "$input", "$IsCoreCLR", "$IsLinux", "$IsMacOS", "$IsWindows", "$LastExitCode", "$Matches", "$MyInvocation", "$NestedPromptLevel", "$null", "$PID", "$PROFILE", "$PSBoundParameters", "$PSCmdlet", "$PSCommandPath", "$PSCulture", "$PSDebugContext", "$PSHOME", "$PSItem", "$PSNativeCommandArgumentPassing", "$PSScriptRoot", "$PSSenderInfo", "$PSStyle", "$PSUICulture", "$PSVersionTable", "$PWD", "$Sender", "$ShellId", "$StackTrace", "$switch", "$this", "$true"];
    const LC_automaticVars = automaticVars.map(name => name.toLowerCase());
    const preferenceVars = ["$ConfirmPreference", "$DebugPreference", "$ErrorActionPreference", "$ErrorView", "$FormatEnumerationLimit", "$InformationPreference", "$LogCommandHealthEvent", "$LogCommandLifecycleEvent", "$LogEngineHealthEvent", "$LogEngineLifecycleEvent", "$LogProviderLifecycleEvent", "$LogProviderHealthEvent", "$MaximumHistoryCount", "$OFS", "$OutputEncoding", "$ProgressPreference", "$PSDefaultParameterValues", "$PSEmailServer", "$PSModuleAutoLoadingPreference", "$PSSessionApplicationName", "$PSSessionConfigurationName", "$PSSessionOption", "$Transcript", "$VerbosePreference", "$WarningPreference", "$WhatIfPreference"];
    const LC_preferenceVars = preferenceVars.map(name => name.toLowerCase());
    const scopeVars = ["$env:", "$global:", "$local:", "$private:", "$script:", "$using:", "$workflow:", "$alias:", "$function:", "$variable:"];
    const LC_scopeVars = scopeVars.map(name => name.toLowerCase());
    const aliases = ["\\?","Where-Object","%","ForEach-Object","cd","Set-Location","chdir","Set-Location","clc","Clear-Content","clear","Clear-Host","clhy","Clear-History","cli","Clear-Item","clp","Clear-ItemProperty","cls","Clear-Host","clv","Clear-Variable","cnsn","Connect-PSSession","copy","Copy-Item","cpi","Copy-Item","cvpa","Convert-Path","dbp","Disable-PSBreakpoint","del","Remove-Item","dir","Get-ChildItem","dnsn","Disconnect-PSSession","ebp","Enable-PSBreakpoint","echo","Write-Output","epal","Export-Alias","epcsv","Export-Csv","erase","Remove-Item","etsn","Enter-PSSession","exsn","Exit-PSSession","fc","Format-Custom","fhx","Format-Hex","fl","Format-List","foreach","ForEach-Object","ft","Format-Table","fw","Format-Wide","gal","Get-Alias","gbp","Get-PSBreakpoint","gc","Get-Content","gci","Get-ChildItem","gcm","Get-Command","gcs","Get-PSCallStack","gdr","Get-PSDrive","ghy","Get-History","gi","Get-Item","gjb","Get-Job","gl","Get-Location","gm","Get-Member","gmo","Get-Module","gp","Get-ItemProperty","gps","Get-Process","gpv","Get-ItemPropertyValue","group","Group-Object","gsn","Get-PSSession","gtz","Get-TimeZone","gu","Get-Unique","gv","Get-Variable","h","Get-History","history","Get-History","icm","Invoke-Command","iex","Invoke-Expression","ihy","Invoke-History","ii","Invoke-Item","ipal","Import-Alias","ipcsv","Import-Csv","ipmo","Import-Module","irm","Invoke-RestMethod","iwr","Invoke-WebRequest","kill","Stop-Process","md","mkdir","measure","Measure-Object","mi","Move-Item","move","Move-Item","mp","Move-ItemProperty","nal","New-Alias","ndr","New-PSDrive","ni","New-Item","nmo","New-Module","nsn","New-PSSession","nv","New-Variable","oh","Out-Host","popd","Pop-Location","pushd","Push-Location","pwd","Get-Location","r","Invoke-History","rbp","Remove-PSBreakpoint","rcjb","Receive-Job","rcsn","Receive-PSSession","rd","Remove-Item","rdr","Remove-PSDrive","ren","Rename-Item","ri","Remove-Item","rjb","Remove-Job","rmo","Remove-Module","rni","Rename-Item","rnp","Rename-ItemProperty","rp","Remove-ItemProperty","rsn","Remove-PSSession","rv","Remove-Variable","rvpa","Resolve-Path","sajb","Start-Job","sal","Set-Alias","saps","Start-Process","sbp","Set-PSBreakpoint","sc","Set-Content","select","Select-Object","set","Set-Variable","si","Set-Item","sl","Set-Location","sls","Select-String","sp","Set-ItemProperty","spjb","Stop-Job","spps","Stop-Process","sv","Set-Variable","type","Get-Content","where","Where-Object","wjb","Wait-Job"];
    const LC_aliases = aliases.map(name => name.toLowerCase());

    var escapes = [];
    var stack = [];

    var escaped = false;
    var inquotes = false;
    var variable = false;
    var semicolon = false;
    var comment = false;

    for(var x = 0; x < Data.length; x++){

        if(Data.charAt(x) == "`"){
            if(escapes.length == 0 && inquotes == false && comment == false){
                escapes.push("`");
                escaped = true;
            }
            else{
                x += 1;
            }
        }
        else if(Data.charAt(x) == "\"" && escaped == false && comment == false){
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
        else if(Data.charAt(x) == "\'" && escaped == false && variable == false && comment == false){
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
        else if(Data.charAt(x) == "$" && escaped == false && variable == false && inquotes == false && comment == false && Data.charAt(x+1) == "{"){
                variable = true;
        }
        else if(Data.charAt(x) == "{" && escaped == false && inquotes == false && variable == true && comment == false){
            stack.push("{");
            if(stack.includes("{")){
                variable = true;
            }
            else{
                variable = false;
            }
        }
        else if(Data.charAt(x) == "}" && escaped == false && inquotes == false && variable == true && comment == false){
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
            if(escaped == false && inquotes == false && variable == false && comment == false){
                semicolon = true;
            }
        }
        else if(Data.charAt(x) == "#" && escaped == false && inquotes == false && variable == false){
            comment = true;
        }

        if(escaped == true && inquotes == false && comment == false){
            Data = Data.slice(0, x) + Data.slice(x+2);
            x -= 1;
            escapes.pop();
            escaped = false;
        }

        if(semicolon == true && variable == false && inquotes == false && comment == false){
            Data = Data.slice(0, x+1) + "\n" + Data.slice(x+1);
            x += 1;
            semicolon = false;
        }

        if(comment == true && variable == false && inquotes == false && escaped == false){
            var y = x;
            while(Data.charAt(x) != "\n" && x < Data.length){
                x++;
            }
            Data = Data.slice(0,y) + Data.slice(x+1);
            x = y - 1;
            comment = false;
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
    document.getElementById("outputbox").value = "";

    var inputData = "";

    if(document.getElementById("inputbox").value != ""){
        inputData = document.getElementById("inputbox").value;
        inputData = inputData + "\n";


        inputData = powerlessSnail(inputData);
        document.getElementById("outputbox").value = inputData;

    }
}
