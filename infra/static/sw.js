if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,t)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let r={};const c=e=>n(e,o),f={module:{uri:o},exports:r,require:c};s[o]=Promise.all(i.map((e=>f[e]||c(e)))).then((e=>(t(...e),r)))}}define(["./workbox-ff5937f6"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-185136ff.js",revision:null},{url:"assets/index-2a359f42.css",revision:null},{url:"index.html",revision:"cb4726fc4bbf7ce203778e260cfcde1c"},{url:"manifest.webmanifest",revision:"b0354be841c1c54ba14341aa5ca9c336"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/https?:\/\/.*\.woff2/,new e.StaleWhileRevalidate({cacheName:"fonts",plugins:[]}),"GET")}));