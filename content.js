/*jshint esversion: 6 */

function Handler(rules){
    this.rules = rules;
    // <https://stackoverflow.com/questions/5904914/javascript-regex-to-replace-text-not-in-html-attributes/5904945#5904945>

    this.walk = function(node)
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
                    this.walk(child);
                    child = next;
                }
                break;

            case 3: // Text node
                this.handleNode(node);
                break;
        }
    };

    this.handleNode = function(textNode) {
        let v = textNode.nodeValue;

        if (v) {
            let modified =  this.handleText(v);

            if (v != modified) {
                textNode.nodeValue = modified;
            }
        }
    };

    this.handleText = function(text) {
        let v = text;

        for (var i=0; i<this.rules.length; i++){
            v = v.replace(this.rules[i][0], this.rules[i][1]);
        }

        return v;
    };

    this.handleTitle = function() {
        document.title = this.handleText(document.title);
    };
}


function main(rules){
    //console.log(rules);
    if ((rules  !== undefined) && (rules !== null)){
        var handler = new Handler(rules);
        handler.walk(document.body);
        handler.handleTitle();
        //setTimeout(function () {
        //walk(rules, document.body);
        //handleTitle(rules);
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

