/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function() {
var exports = {};
exports.id = "pages/api/get-verification-session/[id]";
exports.ids = ["pages/api/get-verification-session/[id]"];
exports.modules = {

/***/ "./pages/api/get-verification-session/[id].js":
/*!****************************************************!*\
  !*** ./pages/api/get-verification-session/[id].js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ handler; }\n/* harmony export */ });\n/* harmony import */ var _public_mimc_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../public/mimc.ts */ \"./public/mimc.ts\");\nconst stripe = __webpack_require__(/*! stripe */ \"stripe\")(\"sk_test_51J305OC6YuwVjGqqdtMScisG2JWYy339dNtTGf7QE44BdrPbWPqeMKd5WF1nfpnKYhAmbh8GGQbiaolofct52IgZ003WkhWzMr\");\n\n\n\nconst seedrandom = __webpack_require__(/*! seedrandom */ \"seedrandom\");\n\nlet seededHash, randSeededNum, mimcVal;\nasync function handler(req, res) {\n  const {\n    id\n  } = req.query;\n  const verificationSession = await stripe.identity.verificationSessions.retrieve(id);\n  let {\n    status\n  } = verificationSession;\n  console.log(verificationSession.metadata.passedDatabaseCheck);\n  console.log(\"\\u001b[1;32m [id].js \\u001b[0m Polling... \"); // create random num and mimc hash of that num if session is verified\n\n  if (verificationSession.status == \"verified\") {\n    console.log(\"\\u001b[1;32m [id].js \\u001b[0m User id verified \");\n    status = \"verified_waiting_for_database_check\";\n\n    if (verificationSession.metadata.passedDatabaseCheck == \"true\") {\n      console.log(\"\\u001b[1;32m [id].js \\u001b[0m User passed database check \");\n      seededHash = seedrandom(id);\n      randSeededNum = seededHash() * 1000000000000000000;\n      console.log(\"\\u001b[1;32m [id].js \\u001b[0m randSeededNum in [id].js \", randSeededNum);\n      mimcVal = (0,_public_mimc_ts__WEBPACK_IMPORTED_MODULE_0__.default)(randSeededNum);\n      console.log(\"\\u001b[1;32m [id].js \\u001b[0m mimc val in [id].js \", mimcVal.toString());\n      status = \"passed_database_check\";\n    }\n\n    if (verificationSession.metadata.passedDatabaseCheck == \"false\") {\n      console.log(\"\\u001b[1;32m [id].js \\u001b[0m User failed database check \");\n      status = \"failed_database_check\";\n    }\n  }\n\n  res.status(200).json({\n    status,\n    randSeededNum,\n    mimcVal\n  });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vc3Ryb21faWQvLi9wYWdlcy9hcGkvZ2V0LXZlcmlmaWNhdGlvbi1zZXNzaW9uL1tpZF0uanM/MTBkZCJdLCJuYW1lcyI6WyJzdHJpcGUiLCJyZXF1aXJlIiwicHJvY2VzcyIsInNlZWRyYW5kb20iLCJzZWVkZWRIYXNoIiwicmFuZFNlZWRlZE51bSIsIm1pbWNWYWwiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwiaWQiLCJxdWVyeSIsInZlcmlmaWNhdGlvblNlc3Npb24iLCJpZGVudGl0eSIsInZlcmlmaWNhdGlvblNlc3Npb25zIiwicmV0cmlldmUiLCJzdGF0dXMiLCJjb25zb2xlIiwibG9nIiwibWV0YWRhdGEiLCJwYXNzZWREYXRhYmFzZUNoZWNrIiwibWltYyIsInRvU3RyaW5nIiwianNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxNQUFNQSxNQUFNLEdBQUdDLG1CQUFPLENBQUMsc0JBQUQsQ0FBUCxDQUFrQkMsNkdBQWxCLENBQWY7O0FBQ0E7O0FBQ0EsTUFBTUMsVUFBVSxHQUFHRixtQkFBTyxDQUFDLDhCQUFELENBQTFCOztBQUVBLElBQUlHLFVBQUosRUFBZUMsYUFBZixFQUE4QkMsT0FBOUI7QUFFZSxlQUFlQyxPQUFmLENBQXVCQyxHQUF2QixFQUE0QkMsR0FBNUIsRUFBaUM7QUFDOUMsUUFBTTtBQUFDQztBQUFELE1BQU9GLEdBQUcsQ0FBQ0csS0FBakI7QUFDQSxRQUFNQyxtQkFBbUIsR0FBRyxNQUFNWixNQUFNLENBQUNhLFFBQVAsQ0FBZ0JDLG9CQUFoQixDQUFxQ0MsUUFBckMsQ0FBOENMLEVBQTlDLENBQWxDO0FBQ0EsTUFBSTtBQUFDTTtBQUFELE1BQVdKLG1CQUFmO0FBQ0FLLFNBQU8sQ0FBQ0MsR0FBUixDQUFZTixtQkFBbUIsQ0FBQ08sUUFBcEIsQ0FBNkJDLG1CQUF6QztBQUNBSCxTQUFPLENBQUNDLEdBQVIsQ0FBWSw0Q0FBWixFQUw4QyxDQU05Qzs7QUFDQSxNQUFJTixtQkFBbUIsQ0FBQ0ksTUFBcEIsSUFBOEIsVUFBbEMsRUFBOEM7QUFDNUNDLFdBQU8sQ0FBQ0MsR0FBUixDQUFZLGtEQUFaO0FBQ0FGLFVBQU0sR0FBRyxxQ0FBVDs7QUFFQSxRQUFJSixtQkFBbUIsQ0FBQ08sUUFBcEIsQ0FBNkJDLG1CQUE3QixJQUFvRCxNQUF4RCxFQUFnRTtBQUM5REgsYUFBTyxDQUFDQyxHQUFSLENBQVksNERBQVo7QUFFQWQsZ0JBQVUsR0FBR0QsVUFBVSxDQUFDTyxFQUFELENBQXZCO0FBQ0FMLG1CQUFhLEdBQUdELFVBQVUsS0FBSyxtQkFBL0I7QUFDQWEsYUFBTyxDQUFDQyxHQUFSLENBQVksMERBQVosRUFBd0ViLGFBQXhFO0FBRUFDLGFBQU8sR0FBR2Usd0RBQUksQ0FBQ2hCLGFBQUQsQ0FBZDtBQUNBWSxhQUFPLENBQUNDLEdBQVIsQ0FBWSxxREFBWixFQUFtRVosT0FBTyxDQUFDZ0IsUUFBUixFQUFuRTtBQUNBTixZQUFNLEdBQUcsdUJBQVQ7QUFDRDs7QUFDRCxRQUFJSixtQkFBbUIsQ0FBQ08sUUFBcEIsQ0FBNkJDLG1CQUE3QixJQUFvRCxPQUF4RCxFQUFpRTtBQUMvREgsYUFBTyxDQUFDQyxHQUFSLENBQVksNERBQVo7QUFDQUYsWUFBTSxHQUFHLHVCQUFUO0FBQ0Q7QUFDRjs7QUFHRFAsS0FBRyxDQUFDTyxNQUFKLENBQVcsR0FBWCxFQUFnQk8sSUFBaEIsQ0FBcUI7QUFBRVAsVUFBRjtBQUFVWCxpQkFBVjtBQUF5QkM7QUFBekIsR0FBckI7QUFDRCIsImZpbGUiOiIuL3BhZ2VzL2FwaS9nZXQtdmVyaWZpY2F0aW9uLXNlc3Npb24vW2lkXS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHN0cmlwZSA9IHJlcXVpcmUoJ3N0cmlwZScpKHByb2Nlc3MuZW52LlNUUklQRV9TRUNSRVRfS0VZKTtcbmltcG9ydCBtaW1jIGZyb20gJy4uLy4uLy4uL3B1YmxpYy9taW1jLnRzJztcbmNvbnN0IHNlZWRyYW5kb20gPSByZXF1aXJlKCdzZWVkcmFuZG9tJyk7XG5cbmxldCBzZWVkZWRIYXNoLHJhbmRTZWVkZWROdW0sIG1pbWNWYWw7IFxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gIGNvbnN0IHtpZH0gPSByZXEucXVlcnk7XG4gIGNvbnN0IHZlcmlmaWNhdGlvblNlc3Npb24gPSBhd2FpdCBzdHJpcGUuaWRlbnRpdHkudmVyaWZpY2F0aW9uU2Vzc2lvbnMucmV0cmlldmUoaWQpO1xuICBsZXQge3N0YXR1c30gPSB2ZXJpZmljYXRpb25TZXNzaW9uO1xuICBjb25zb2xlLmxvZyh2ZXJpZmljYXRpb25TZXNzaW9uLm1ldGFkYXRhLnBhc3NlZERhdGFiYXNlQ2hlY2spXG4gIGNvbnNvbGUubG9nKFwiXFx1MDAxYlsxOzMybSBbaWRdLmpzIFxcdTAwMWJbMG0gUG9sbGluZy4uLiBcIilcbiAgLy8gY3JlYXRlIHJhbmRvbSBudW0gYW5kIG1pbWMgaGFzaCBvZiB0aGF0IG51bSBpZiBzZXNzaW9uIGlzIHZlcmlmaWVkXG4gIGlmICh2ZXJpZmljYXRpb25TZXNzaW9uLnN0YXR1cyA9PSBcInZlcmlmaWVkXCIpIHtcbiAgICBjb25zb2xlLmxvZyhcIlxcdTAwMWJbMTszMm0gW2lkXS5qcyBcXHUwMDFiWzBtIFVzZXIgaWQgdmVyaWZpZWQgXCIpXG4gICAgc3RhdHVzID0gXCJ2ZXJpZmllZF93YWl0aW5nX2Zvcl9kYXRhYmFzZV9jaGVja1wiXG5cbiAgICBpZiAodmVyaWZpY2F0aW9uU2Vzc2lvbi5tZXRhZGF0YS5wYXNzZWREYXRhYmFzZUNoZWNrID09IFwidHJ1ZVwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlxcdTAwMWJbMTszMm0gW2lkXS5qcyBcXHUwMDFiWzBtIFVzZXIgcGFzc2VkIGRhdGFiYXNlIGNoZWNrIFwiKVxuICAgIFxuICAgICAgc2VlZGVkSGFzaCA9IHNlZWRyYW5kb20oaWQpO1xuICAgICAgcmFuZFNlZWRlZE51bSA9IHNlZWRlZEhhc2goKSAqIDEwMDAwMDAwMDAwMDAwMDAwMDA7XG4gICAgICBjb25zb2xlLmxvZyhcIlxcdTAwMWJbMTszMm0gW2lkXS5qcyBcXHUwMDFiWzBtIHJhbmRTZWVkZWROdW0gaW4gW2lkXS5qcyBcIiwgcmFuZFNlZWRlZE51bSlcblxuICAgICAgbWltY1ZhbCA9IG1pbWMocmFuZFNlZWRlZE51bSlcbiAgICAgIGNvbnNvbGUubG9nKFwiXFx1MDAxYlsxOzMybSBbaWRdLmpzIFxcdTAwMWJbMG0gbWltYyB2YWwgaW4gW2lkXS5qcyBcIiwgbWltY1ZhbC50b1N0cmluZygpKVxuICAgICAgc3RhdHVzID0gXCJwYXNzZWRfZGF0YWJhc2VfY2hlY2tcIlxuICAgIH1cbiAgICBpZiAodmVyaWZpY2F0aW9uU2Vzc2lvbi5tZXRhZGF0YS5wYXNzZWREYXRhYmFzZUNoZWNrID09IFwiZmFsc2VcIikge1xuICAgICAgY29uc29sZS5sb2coXCJcXHUwMDFiWzE7MzJtIFtpZF0uanMgXFx1MDAxYlswbSBVc2VyIGZhaWxlZCBkYXRhYmFzZSBjaGVjayBcIilcbiAgICAgIHN0YXR1cyA9IFwiZmFpbGVkX2RhdGFiYXNlX2NoZWNrXCI7XG4gICAgfVxuICB9XG4gIFxuXG4gIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3RhdHVzLCByYW5kU2VlZGVkTnVtLCBtaW1jVmFsIH0pXG59Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/api/get-verification-session/[id].js\n");

/***/ }),

/***/ "big-integer":
/*!******************************!*\
  !*** external "big-integer" ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = require("big-integer");;

/***/ }),

/***/ "seedrandom":
/*!*****************************!*\
  !*** external "seedrandom" ***!
  \*****************************/
/***/ (function(module) {

"use strict";
module.exports = require("seedrandom");;

/***/ }),

/***/ "stripe":
/*!*************************!*\
  !*** external "stripe" ***!
  \*************************/
/***/ (function(module) {

"use strict";
module.exports = require("stripe");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, ["public_mimc_ts"], function() { return __webpack_exec__("./pages/api/get-verification-session/[id].js"); });
module.exports = __webpack_exports__;

})();