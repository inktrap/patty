/*jshint esversion: 6 */

// <https://stackoverflow.com/questions/5904914/javascript-regex-to-replace-text-not-in-html-attributes/5904945#5904945>
function walk(rules, node)
{
    // Source: http://is.gd/mwZp7E

    var child, next;

    switch ( node.nodeType )
    {
        case 1:  // Element
        case 9:  // Document
        case 11: // Document fragment
            child = node.firstChild;
            while ( child )
            {
                next = child.nextSibling;
                walk(rules, child);
                child = next;
            }
            break;

        case 3: // Text node
            handleNode(rules, node);
            break;
    }
}

function handleNode(rules, textNode) {
    let v = textNode.nodeValue;

    if (v) {
        let modified =  handleText(rules, v);

        if (v != modified) {
            textNode.nodeValue = modified;
        }
    }
}

function handleText(rules, text) {
    let v = text;

    for (var i=0; i<rules.length; i++){
        v = v.replace(new RegExp(rules[i][0], 'g'), rules[i][1]);
    }

    return v;
}

function handleTitle(rules) {
    document.title = handleText(rules, document.title);
}

function main(rules){
    //console.log(rules);
    if ((rules  !== undefined) && (rules !== null)){
        //setTimeout(function () {
        walk(rules, document.body);
        handleTitle(rules);
        //}, 10);
    }
}
function compile_rules(response){
    var rules = JSON.parse(response.rules);
    for (i=0; i< rules.length; i++){
        rules[i][0] = new RegExp(rules[i][0], 'g');
    }
    return rules;
}

function getCurrentRules(){
    // get the replacements
    // <http://stackoverflow.com/a/3938013>
    chrome.runtime.sendMessage({method: "getRules"}, function(response) {
      main(compile_rules(response));
    });
}

getCurrentRules();

