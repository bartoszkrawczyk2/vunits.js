vunits.js
===================
CSS viewport units (vh, vw, vmin and vmax) polyfill.

## Usage
vunits.js has no built-in viewport units support detection. You have to detect manually, but you can target any browser with buggy, partial or no support of viewport units.    
- - -
Example usage (using Modernizr and RequireJS):
```js
  if (!Modernizr.cssvwunit && !window.vunits) {
    requirejs(['vunits.min']);
  }
```  
Example usage (using IE conditional comments):
```html
<!--[if lte IE 9]>
  <script src="js/vunits.min.js"></script>
<![endif]-->
```
Note: vunits.js doesn't work with inline styles and imported styles (`@import` rule). It can be slow with very large stylesheets.

## Demo
http://projects.bartoszkrawczyk.com/vunits/

## License
MIT License
