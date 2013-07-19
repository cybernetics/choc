// Generated by CoffeeScript 1.6.3
(function() {
  var escodegen, esmorph, esprima, generateReadableExpression, generateReadableStatement, inspect, pp, puts, readableNode, _, _ref;

  _ref = require("util"), puts = _ref.puts, inspect = _ref.inspect;

  pp = function(x) {
    return puts(inspect(x, null, 1000));
  };

  esprima = require("esprima");

  escodegen = require("escodegen");

  esmorph = require("esmorph");

  _ = require("underscore");

  generateReadableExpression = function(node, opts) {
    var message, operators, target, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
    if (opts == null) {
      opts = {};
    }
    switch (node.type) {
      case 'AssignmentExpression':
        operators = {
          "=": "'set " + node.left.name + " to ' + " + node.left.name,
          "+=": "'add ' + " + (generateReadableExpression(node.right)) + " + ' to " + node.left.name + " and set " + node.left.name + " to ' + " + node.left.name,
          "-=": "'subtract ' + " + (generateReadableExpression(node.right)) + " + ' from " + node.left.name + "' + ' and set " + node.left.name + " to ' + " + node.left.name,
          "*=": "'multiply " + node.left.name + " by ' + " + (generateReadableExpression(node.right)) + " + ' and set " + node.left.name + " to ' + " + node.left.name,
          "/=": "'divide " + node.left.name + " by ' + " + (generateReadableExpression(node.right)) + " + ' and set " + node.left.name + " to ' + " + node.left.name,
          "%=": "'divide " + node.left.name + " by ' + " + (generateReadableExpression(node.right)) + " + ' and set " + node.left.name + " to the remainder, ' + " + node.left.name
        };
        return message = operators[node.operator] || "";
      case 'BinaryExpression':
        operators = {
          "==": "" + (generateReadableExpression(node.left)) + " + ' equals ' + " + (generateReadableExpression(node.right)),
          "!=": "" + (generateReadableExpression(node.left)) + " + ' does not equal ' + " + (generateReadableExpression(node.right)),
          "===": "" + (generateReadableExpression(node.left)) + " + ' equals ' + " + (generateReadableExpression(node.right)),
          "!==": "" + (generateReadableExpression(node.left)) + " + ' does not equal ' + " + (generateReadableExpression(node.right)),
          "<": "" + (generateReadableExpression(node.left)) + " + ' less than ' + " + (generateReadableExpression(node.right)),
          "<=": "" + (generateReadableExpression(node.left)) + " + ' less than or equal to ' + " + (generateReadableExpression(node.right)),
          ">": "" + (generateReadableExpression(node.left)) + " + ' greater than ' + " + (generateReadableExpression(node.right)),
          ">=": "" + (generateReadableExpression(node.left)) + " + ' greater than or equal to ' + " + (generateReadableExpression(node.right)),
          "<<": "" + node.left.name,
          ">>": "" + node.left.name,
          ">>>": "" + node.left.name,
          "+": "" + node.left.name,
          "-": "" + node.left.name,
          "*": "" + node.left.name,
          "/": "" + node.left.name,
          "%": "" + (generateReadableExpression(node.left)) + " + ' % ' + " + (generateReadableExpression(node.right)),
          "|": "" + node.left.name,
          "^": "" + node.left.name,
          "in": "''",
          "instanceof": "''",
          "..": "''"
        };
        message = operators[node.operator] || "";
        return "" + message;
      case 'CallExpression':
        target = ((_ref1 = node.callee) != null ? _ref1.name : void 0) || (node.callee.object.name + "." + node.callee.property.name);
        return "(function() {\n  if(" + target + ".hasOwnProperty(\"__choc_annotation\")) {\n    return eval(" + target + ".__choc_annotation(" + (inspect(node["arguments"], null, 1000)) + "));\n  } else if (" + (((_ref2 = node.callee) != null ? _ref2.name : void 0) != null ? "true" : "false") + ") {\n    return \"call the function <span class='choc-variable'>" + node.callee.name + "</span>\";\n  } else if (" + (((_ref3 = node.callee) != null ? (_ref4 = _ref3.object) != null ? _ref4.name : void 0 : void 0) ? "true" : "false") + ") {\n    return \"tell <span class='choc-variable'>" + ((_ref5 = node.callee) != null ? (_ref6 = _ref5.object) != null ? _ref6.name : void 0 : void 0) + "</span> to <span class='choc-variable'>" + ((_ref7 = node.callee) != null ? (_ref8 = _ref7.property) != null ? _ref8.name : void 0 : void 0) + "</span>\";\n  } else {\n    return \"\";\n  }\n})()";
      case 'Literal':
        return "" + node.value;
      case 'Identifier':
        return "" + node.name;
      default:
        return "";
    }
  };

  generateReadableStatement = function(node, opts) {
    var conditional, i, msgs, sentences;
    if (opts == null) {
      opts = {};
    }
    switch (node.type) {
      case 'VariableDeclaration':
        i = 0;
        sentences = _.map(node.declarations, function(dec) {
          var name, prefix;
          name = dec.id.name;
          prefix = i === 0 ? "Create" : " and create";
          i = i + 1;
          return "'" + prefix + " the variable <span class=\"choc-variable\">" + name + "</span> and set it to <span class=\"choc-value\">' + " + name + " + '</span>'";
        });
        msgs = _.map(sentences, function(sentence) {
          return "{ lineNumber: " + node.loc.start.line + ", message: " + sentence + " }";
        });
        return "[ " + msgs.join(", ") + " ]";
      case 'ExpressionStatement':
        return ("[ { lineNumber: " + node.loc.start.line + ", message: ") + generateReadableExpression(node.expression) + " } ]";
      case 'WhileStatement':
        conditional = opts.hoistedAttributes ? opts.hoistedAttributes[1] : true;
        return "(function (__conditional) { \n if(__conditional) { \n   var startLine = " + node.loc.start.line + ";\n   var endLine   = " + node.loc.end.line + ";\n   var messages = [ { lineNumber: startLine, message: \"Because \" + " + (generateReadableExpression(node.test)) + " } ]\n   // CodeMirror is ridiculously slow when removing these messages. TODO speed it up and add them back\n   // for(var i=startLine+1; i<= endLine; i++) {\n   //   var message = i == startLine+1 ? \"do this\" : \"and this\";\n   //   messages.push({ lineNumber: i, message: message });\n   // }\n   messages.push( { lineNumber: endLine, message: \"... and try again\" } )\n   // do this\n   // and this\n   // ... and try again\n   return messages;\n } else {\n   // Because -> condition with variables expanded e.g. 0 <= 200 is false\n   // ... stop looping\n   var startLine = " + node.loc.start.line + ";\n   var endLine   = " + node.loc.end.line + ";\n   var messages = [ { lineNumber: startLine, message: \"Because \" + " + (generateReadableExpression(node.test)) + " + \" is false\"} ]\n   messages.push( { lineNumber: endLine, message: \"stop looping\" } )\n   return messages;\n }\n})(" + conditional + ")";
      case 'IfStatement':
        conditional = opts.hoistedAttributes ? opts.hoistedAttributes[1] : true;
        return "(function (__conditional) { \n var startLine = " + node.loc.start.line + ";\n var endLine   = " + node.loc.end.line + ";\n if(__conditional) { \n   var messages = [ { lineNumber: startLine, message: \"Because \" + " + (generateReadableExpression(node.test)) + " } ]\n   return messages;\n } else {\n   var messages = [ { lineNumber: startLine, message: \"Because \" + " + (generateReadableExpression(node.test)) + " + \" is false\"} ]\n   return messages;\n }\n})(" + conditional + ")";
      default:
        return "[]";
    }
  };

  readableNode = function(node, opts) {
    if (opts == null) {
      opts = {};
    }
    switch (node.type) {
      case 'VariableDeclaration':
      case 'ExpressionStatement':
      case 'WhileStatement':
      case 'IfStatement':
        return generateReadableStatement(node, opts);
      default:
        return "[]";
    }
  };

  exports.readableNode = readableNode;

  exports.generateReadableExpression = generateReadableExpression;

}).call(this);
