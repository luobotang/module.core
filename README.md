# module.core

A simple module define/require library, with API like Require.JS, but without support of load js file.

# usage

```javascript
Luobo.define('module', ['mod_1', 'mod_2'], function (Mod1, Mod2) {
    // ...
    return {
        doSomething: function () {
            // ...
        }
    };
});

Luobo.require(['module'], function (Module) {
    Module.doSomething();
});
```
