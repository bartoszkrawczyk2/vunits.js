/*!
 vunits.js
 CSS viewport units polyfill
 (c) 2015 Bartosz Krawczyk
 bartoszkrawczyk.com
 MIT License
*/

(function() {
    this.vunits = true;

    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function() {
            this.parentElement.removeChild(this);
        };
    }

    var originalStylesheet = '',
        outputStylesheet   = '',
        sheets             = document.styleSheets,
        head               = document.head || document.getElementsByTagName('head')[0],
        style,
        resizeTimeout,
        urlMatch,
        relativeUrl,
        _cssText;

    var applyStyles = function (cssText) {
        if (style) style.remove();
        style = document.createElement('style');
        style.type = 'text/css';

        if (style.styleSheet) {
            style.styleSheet.cssText = cssText;
        } else {
            style.appendChild(document.createTextNode(cssText));
        }

        head.appendChild(style);
    };

    function absolute(base, relative) {
        var stack = base.split("/"),
            parts = relative.split("/");

        stack.pop();
     
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] == ".") 
                continue;

            if (parts[i] == "..") {
                stack.pop();
            } else {
                stack.push(parts[i]);
            }
        }

        return stack.join("/");
    }

    var parseRules = function (rulesList, href) {
        if (!!href) href = href.replace(/(\w+\.\w+)[^/]*$/, '');

        if (typeof rulesList !== 'undefined' && rulesList) {
            for (var i = 0, len = rulesList.length; i < len; i++) {
                _cssText = rulesList[i].cssText;
                urlMatch = _cssText.match(/url\(([^#]+?)\)/g);

                if (urlMatch) {
                    for (var j = 0, len2 = urlMatch.length; j < len2; j++) {
                        relativeUrl = urlMatch[j].match(/url\(("|')*([^#]+?)("|')*\)/)[2].match(/(^[^http|\/].*)/);
                        if (relativeUrl && !!href) {
                            _cssText = _cssText.replace(relativeUrl[0], absolute(href, relativeUrl[0]));
                        }
                    }
                }

                originalStylesheet += _cssText+' ';
            }
        }
    };

    var polyfill = function () {
        var ruleMatchW, ruleMatchH,
            vmin = (window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth),
            vmax = (window.innerHeight > window.innerWidth ? window.innerHeight : window.innerWidth);

        outputStylesheet = originalStylesheet;

        ruleMatchH = outputStylesheet.match(/(?=.*\d)\d*(?:\.\d*)?vh/g);
        ruleMatchW = outputStylesheet.match(/(?=.*\d)\d*(?:\.\d*)?vw/g);
        ruleMatchMin = outputStylesheet.match(/(?=.*\d)\d*(?:\.\d*)?vmin/g);
        ruleMatchMax = outputStylesheet.match(/(?=.*\d)\d*(?:\.\d*)?vmax/g);

        if (ruleMatchH) {
            for (var i = 0, rLen = ruleMatchH.length; i < rLen; i++) {
                outputStylesheet = outputStylesheet.replace(ruleMatchH[i], (parseFloat('0'+ruleMatchH[i])*0.01*window.innerHeight)+'px');
            }
        }

        if (ruleMatchW) {
            for (var j = 0, rLen2 = ruleMatchW.length; j < rLen2; j++) {
                outputStylesheet = outputStylesheet.replace(ruleMatchW[j], (parseFloat('0'+ruleMatchW[j])*0.01*window.innerWidth)+'px');
            }
        }

        if (ruleMatchMin) {
            for (var k = 0, rLen3 = ruleMatchMin.length; k < rLen3; k++) {
                outputStylesheet = outputStylesheet.replace(ruleMatchMin[k], (parseFloat('0'+ruleMatchMin[k])*0.01*vmin)+'px');
            }
        }

        if (ruleMatchMax) {
            for (var l = 0, rLen4 = ruleMatchMax.length; l < rLen4; l++) {
                outputStylesheet = outputStylesheet.replace(ruleMatchMax[l], (parseFloat('0'+ruleMatchMax[l])*0.01*vmax)+'px');
            }
        }

        applyStyles(outputStylesheet);
    }

    if (!originalStylesheet) {
        for (var key in sheets) {
            if (sheets.hasOwnProperty(key)) {
                if (typeof sheets[key].rules === 'object') parseRules(sheets[key].rules, sheets[key].href);
            }
        }

        polyfill();
    }

    window.onresize = function () {
        clearTimeout(resizeTimeout)
        
        resizeTimeout = setTimeout(function() {
            polyfill();
        }, 200);
    };
}());
