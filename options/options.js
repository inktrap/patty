/*jshint esversion: 6 */
//"use strict";

// the container that holds the rules
var rulesContainer = document.querySelector('#rules');

// callback to set() just checks for errors
function onSet() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    console.log("OK");
  }
}

function addRule(e){
    e.preventDefault();
    makeInput();
}

function deleteRule(e){
    e.preventDefault();
    e.target.parentNode.parentNode.remove();
}
function moveUp(e){
    e.preventDefault();
    //console.log("up");
    var currentRule = e.target.parentNode.parentNode;
    if (currentRule.previousElementSibling !== null){
        rulesContainer.insertBefore(currentRule, currentRule.previousElementSibling);
    }
}

function moveDown(e){
    e.preventDefault();
    //console.log("down");
    var currentRule = e.target.parentNode.parentNode;
    if (currentRule.nextElementSibling !== null){
        currentRule.parentNode.insertBefore(currentRule, currentRule.nextElementSibling.nextElementSibling);
    }
}

function exportRules(e){
    e.preventDefault();
    chrome.storage.local.get('rules', function(jsonResult){
        var exportLink = document.createElement('a');
        var result = {};
        result.rules = JSON.parse(jsonResult.rules);
        console.log(result);
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result));
        exportLink.href = 'data:' + data;
        exportLink.download = 'patty-export.json';
        exportLink.click();
    });
}

function parseFormat(jsonContent){
    var new_rules = Array();
    var content = JSON.parse(jsonContent);
    if (!('rules' in content)){
        console.log("rules");
        return false;
    }
    if (!(content.rules instanceof Array)){
        console.log("instance");
        return false;
    }
    for (i=0; i<content.rules.length; i++){
        if ((content.rules[i].length !== 2) ||
            (!(typeof content.rules[i][0] === 'string' || content.rules[i][0] instanceof String)) ||
            (!(typeof content.rules[i][1] === 'string' || content.rules[i][1] instanceof String))){
                console.log("inner");
                return false;
        } else {
            new_rules.push(Array(content.rules[i][0], content.rules[i][1]));
        }
    }
    return new_rules;
}

function clearFormRules(){
    var rulesContainer = document.querySelector('#rules');
    while (rulesContainer.firstChild){
        rulesContainer.removeChild(rulesContainer.firstChild);
    }
}

function deleteAll(){
    clearFormRules();
    saveRules(Array());
}

function importRules(e){
    e.preventDefault();
    var files = e.target.files;
    var output = [];
    var reader = new FileReader();
    var new_rules = Array();
    reader.onload = function(e){
        var jsonContent = e.target.result;
        var rules = parseFormat(jsonContent);
        if ( rules === false){
            console.log("Invalid JSON datastructure. Skipping file");
            return;
        } else {
            new_rules.push(rules);
        }
    };
    for (var i = 0; i < files.length; i++) {
        if (!files[i].type.match('json.*')) {
          console.log("You can only import json files. Skipping type " + files[i].type);
          continue;
        }
        reader.readAsText(files[i]);
    }

    chrome.storage.local.get('rules', function(jsonResult){
        var results = JSON.parse(jsonResult.rules);
        for (var i = 0; i < new_rules.length; i++){
            results = results.concat(new_rules[i]);
        }
        saveRules(results);
        clearFormRules();
        initialize();
    });
}

function triggerImportRules(e){
    e.preventDefault();
    document.querySelector("#importBtn").click();
}

function saveRules(new_rules){
    chrome.storage.local.set({'rules' : JSON.stringify(new_rules) });
}

function saveCurrentRules(e){
    e.preventDefault();
    var new_rules = getFormRules();
    //console.log(JSON.stringify(new_rules));
    saveRules(new_rules);
    // do not  close the window because a user might want to save rules before he imports new ones
    //window.close();
}

function makeInput(patternValue="", replaceValue=""){

    var ruleset = document.createElement('div');
    var pattern = document.createElement('input');
    var replace = document.createElement('input');

    var actions = document.createElement('p');

    var upBtn = document.createElement('button');
    upBtn.textContent = 'Up';

    var downBtn = document.createElement('button');
    downBtn.textContent = 'Down';

    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';

    //var clearfix = document.createElement('div');

    ruleset.setAttribute('class', 'ruleset');
    actions.setAttribute('class', 'actions');

    pattern.setAttribute('type', 'text');
    pattern.setAttribute('value', patternValue);
    pattern.setAttribute('placeholder', 'pattern');

    replace.setAttribute('type', 'text');
    replace.setAttribute('value', replaceValue);
    replace.setAttribute('placeholder', 'replace');

    deleteBtn.setAttribute('class', 'delete');
    downBtn.setAttribute('class', 'down');
    upBtn.setAttribute('class', 'up');
    //clearfix.setAttribute('class', 'clearfix');
    //
    ruleset.appendChild(pattern);
    ruleset.appendChild(replace);

    actions.appendChild(deleteBtn);
    actions.appendChild(upBtn);
    actions.appendChild(downBtn);
    ruleset.appendChild(actions);

    /* set listeners for buttons */
    upBtn.addEventListener("click", moveUp);
    downBtn.addEventListener("click", moveDown);
    deleteBtn.addEventListener("click", deleteRule);

    rulesContainer.appendChild(ruleset);
}

// make an array from the rulesets that are found on the page
function getFormRules() {
    //console.log("called function getFormRules");
    var new_rules = Array();
    // all the rulesets as two element arrays
    var rules = document.querySelectorAll(".ruleset");
    for (var i = 0; i < rules.length; ++i) {
        var rule = rules[i].children;
        new_rules.push(Array(rule[0].value, rule[1].value));
    }
    return new_rules;
}

function initialize(){
    chrome.storage.local.get('rules', function(jsonResult){
        if ((jsonResult !== undefined) && (jsonResult !== null) && ('rules' in jsonResult)){
            results = JSON.parse(jsonResult.rules);
            for (i = 0; i < results.length; i++){
                makeInput(results[i][0], results[i][1]);
            }
        } else {
            if (chrome.runtime.lastError){
                console.log(chrome.runtime.lastError);
            }
        }
    });
}

function initializeProfiles(){
    xhttp.open("GET", "https://inktrap.org/profile.json", true);
    xhttp.send();
}

document.addEventListener('DOMContentLoaded', initialize);
document.querySelector("form").addEventListener("submit", saveCurrentRules);
document.querySelector("#add").addEventListener("click", addRule);
document.querySelector("#export").addEventListener("click", exportRules);
document.querySelector("#importBtn").addEventListener("change", importRules);
document.querySelector("#deleteAll").addEventListener("click", deleteAll);

