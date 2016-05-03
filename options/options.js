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

function saveRules(e){
    e.preventDefault();
    var new_rules = getFormRules();
    //console.log("called saveRules");
    //console.log(JSON.stringify(new_rules));
    if (new_rules.length > 0){
        chrome.storage.local.set({'rules' : JSON.stringify(new_rules) });
    }

    window.close();
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
    //console.log("init");
    chrome.storage.local.get('rules', function(jsonResult){
        if ((jsonResult !== undefined) && (jsonResult !== null) && ('rules' in jsonResult)){
            results = JSON.parse(jsonResult.rules);
            for (i = 0; i < results.length; i++){
                makeInput(results[i][0], results[i][1]);
            }
        } else {
            if (chrome.runtime.lastError){
            //console.log(chrome.runtime.lastError);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initialize);
document.querySelector("form").addEventListener("submit", saveRules);
document.querySelector("#add").addEventListener("click", addRule);

