(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/underscore/underscore.js":
/*!***********************************************!*\
  !*** ./node_modules/underscore/underscore.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}());

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_components_redirect_to_default_route_redirect_to_default_route_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/_components/redirect-to-default-route/redirect-to-default-route.component */ "./src/app/shared/_components/redirect-to-default-route/redirect-to-default-route.component.ts");
/* harmony import */ var _user_profile_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./user-profile/create-profile-guard.service */ "./src/app/user-profile/create-profile-guard.service.ts");
/* harmony import */ var _core_auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/auth/_guards/login-guard.service */ "./src/app/core/auth/_guards/login-guard.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var routes = [
    { path: '**', redirectTo: '/redirect' },
    { path: 'redirect', component: _shared_components_redirect_to_default_route_redirect_to_default_route_component__WEBPACK_IMPORTED_MODULE_2__["RedirectToDefaultRouteComponent"], canActivate: [_core_auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_4__["LoginGuard"], _user_profile_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_3__["CreateProfileGuardService"]] }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes, { useHash: true })],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".home-icon{\n  padding-top: 7px;\n  padding-right: 7px;\n}\n\nmat-toolbar.mat-tangy-custom-toolbar {\n  background: #212a3f;\n}\n\n#update-in-progress-inner {\n  margin: 100px 50px 0px;\n}\n\n#update-in-progress {\n  font-size: 2em;\n  text-align: center;\n  position: fixed;\n  background: #FFF;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  height: 100%;\n  z-index: 98765;\n\n}\n\n#update-in-progress img {\n  width: 40%;\n}"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"update-in-progress\" *ngIf=\"updateIsRunning\">\n  <div id=\"update-in-progress-inner\">\n    <img src=\"../logo.svg\">\n    <br> {{'Update is Running. Please Wait ...'|translate}}\n    <br>\n    <br>\n    <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\n  </div>\n</div>\n\n<mat-toolbar color=\"primary\" class=\"mat-typography mat-tangy-custom-toolbar\">\n  <span class=\"home-icon\">\n    <a class=\"tangy-no-text-decoration tangy-app-name\" routerLink=\"/home\">\n      <app-tangy-svg-logo [tangyLogoStyle]=\"{'height':'45px'}\"></app-tangy-svg-logo>\n    </a>\n  </span>\n\n  <span>\n    <a class=\"tangy-no-text-decoration tangy-app-name\" routerLink=\"home\"></a>\n  </span>\n  <span class=\"tangy-spacer\"></span>\n\n  <button *ngIf=\"showNav\" [matMenuTriggerFor]=\"appMenu\" mat-button>\n    <i class=\"material-icons\">account_box</i>\n  </button>\n  <mat-menu #appMenu=\"matMenu\">\n    <button routerLink=\"manage-user-profile\" mat-menu-item>\n      <mat-icon class=\"material-icons menu-tangy-location-list-icon\">create</mat-icon>\n      <span>{{'Manage Profile'|translate}}</span>\n    </button>\n    <!-- <button routerLink=\"/home\" mat-menu-item>\n      <mat-icon class=\"material-icons menu-tangy-location-list-icon\">settings</mat-icon>\n      <span>My Settings</span>\n    </button> -->\n    <button routerLink=\"/sync-records\" mat-menu-item>\n      <mat-icon class=\"material-icons menu-tangy-location-list-icon\">autorenew</mat-icon>\n      <span>{{'Sync'|translate}}</span>\n    </button>\n    <button routerLink=\"/export-data\" mat-menu-item>\n      <mat-icon class=\"material-icons menu-tangy-location-list-icon\">import_export</mat-icon>\n      <span>{{'Export Data'|translate}}</span>\n    </button>\n    <button mat-menu-item (click)=\"updateApp()\" *ngIf=\"showUpdateAppLink\">\n      <mat-icon class=\"material-icons menu-tangy-location-list-icon\">cloud_download</mat-icon>\n      <span>{{'Update App'|translate}}</span>\n    </button>\n    <button mat-menu-item (click)=\"updateApp()\" *ngIf=\"!showUpdateAppLink\">\n      <mat-icon class=\"material-icons menu-tangy-location-list-icon\">cloud_download</mat-icon>\n      <span>{{'Check for Update'|translate}}</span>\n    </button>\n    <button mat-menu-item (click)=\"logout()\">\n      <mat-icon class=\"material-icons menu-tangy-location-list-icon\">exit_to_app</mat-icon>\n      <span>{{'Logout'|translate}}</span>\n    </button>\n\n  </mat-menu>\n\n</mat-toolbar>\n<div class=\"tangerine-app-content mat-typography\">\n  <router-outlet></router-outlet>\n</div>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _core_auth_services_authentication_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/auth/_services/authentication.service */ "./src/app/core/auth/_services/authentication.service.ts");
/* harmony import */ var _core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/auth/_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
/* harmony import */ var _core_window_ref_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./core/window-ref.service */ "./src/app/core/window-ref.service.ts");
/* harmony import */ var _core_update_update_updates__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./core/update/update/updates */ "./src/app/core/update/update/updates.ts");
/* harmony import */ var _tangy_forms_tangy_form_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./tangy-forms/tangy-form-service */ "./src/app/tangy-forms/tangy-form-service.ts");
/* harmony import */ var pouchdb__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! pouchdb */ "./node_modules/pouchdb/lib/index-browser.es.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _shared_translation_marker__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./shared/translation-marker */ "./src/app/shared/translation-marker.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};












var AppComponent = /** @class */ (function () {
    function AppComponent(windowRef, userService, authenticationService, http, router, translate) {
        this.windowRef = windowRef;
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.http = http;
        this.router = router;
        this.updateIsRunning = false;
        windowRef.nativeWindow.PouchDB = pouchdb__WEBPACK_IMPORTED_MODULE_9__["default"];
        translate.setDefaultLang('translation');
        translate.use('translation');
    }
    AppComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var res, _a, e_1, styleContainer, currentUser, tangyFormService;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Set location list as a global.
                        this.window = this.windowRef.nativeWindow;
                        return [4 /*yield*/, this.http.get('./assets/location-list.json').toPromise()];
                    case 1:
                        res = _b.sent();
                        this.window.locationList = res;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        _a = this.window;
                        return [4 /*yield*/, this.http.get('./assets/app-config.json').toPromise()];
                    case 3:
                        _a.appConfig = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        console.log('No app config found.');
                        return [3 /*break*/, 5];
                    case 5:
                        if (this.window.appConfig.direction === 'rtl') {
                            styleContainer = this.window.document.createElement('div');
                            styleContainer.innerHTML = "\n        <style>\n          * {\n              text-align: right;\n              direction: rtl;\n          }\n      </style>\n      ";
                            this.window.document.body.appendChild(styleContainer);
                        }
                        this.showNav = this.authenticationService.isLoggedIn();
                        this.authenticationService.currentUserLoggedIn$.subscribe(function (isLoggedIn) {
                            _this.showNav = isLoggedIn;
                        });
                        this.isAppUpdateAvailable();
                        setInterval(this.getGeolocationPosition, 5000);
                        this.checkIfUpdateScriptRequired();
                        return [4 /*yield*/, this.authenticationService.getCurrentUser()];
                    case 6:
                        currentUser = _b.sent();
                        if (currentUser) {
                            tangyFormService = new _tangy_forms_tangy_form_service__WEBPACK_IMPORTED_MODULE_8__["TangyFormService"]({ databaseName: currentUser });
                            tangyFormService.initialize();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AppComponent.prototype.checkIfUpdateScriptRequired = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usersDb, response, usernames, _i, usernames_1, username, userDb, infoDoc, e_2, atUpdateIndex, lastUpdateIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usersDb = new pouchdb__WEBPACK_IMPORTED_MODULE_9__["default"]('users');
                        return [4 /*yield*/, usersDb.allDocs({ include_docs: true })];
                    case 1:
                        response = _a.sent();
                        usernames = response
                            .rows
                            .map(function (row) { return row.doc; })
                            .filter(function (doc) { return doc.hasOwnProperty('username'); })
                            .map(function (doc) { return doc.username; });
                        _i = 0, usernames_1 = usernames;
                        _a.label = 2;
                    case 2:
                        if (!(_i < usernames_1.length)) return [3 /*break*/, 11];
                        username = usernames_1[_i];
                        return [4 /*yield*/, new pouchdb__WEBPACK_IMPORTED_MODULE_9__["default"](username)];
                    case 3:
                        userDb = _a.sent();
                        infoDoc = { _id: '', atUpdateIndex: 0 };
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 9]);
                        return [4 /*yield*/, userDb.get('info')];
                    case 5:
                        infoDoc = _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        e_2 = _a.sent();
                        return [4 /*yield*/, userDb.put({ _id: 'info', atUpdateIndex: 0 })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, userDb.get('info')];
                    case 8:
                        infoDoc = _a.sent();
                        return [3 /*break*/, 9];
                    case 9:
                        atUpdateIndex = infoDoc.hasOwnProperty('atUpdateIndex') ? infoDoc.atUpdateIndex : 0;
                        lastUpdateIndex = _core_update_update_updates__WEBPACK_IMPORTED_MODULE_7__["updates"].length - 1;
                        if (lastUpdateIndex !== atUpdateIndex) {
                            this.router.navigate(['/update']);
                        }
                        _a.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 2];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    AppComponent.prototype.logout = function () {
        this.authenticationService.logout();
        this.router.navigate(['login']);
    };
    AppComponent.prototype.isAppUpdateAvailable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, foundReleaseUuid, storedReleaseUuid, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.http.get('../../release-uuid.txt').toPromise()];
                    case 1:
                        response = _a.sent();
                        foundReleaseUuid = ("" + response).replace(/\n|\r/g, '');
                        storedReleaseUuid = localStorage.getItem('release-uuid');
                        this.showUpdateAppLink = foundReleaseUuid === storedReleaseUuid ? false : true;
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AppComponent.prototype.updateApp = function () {
        var _this = this;
        if (this.window.isCordovaApp) {
            console.log('Running from APK');
            var installationCallback_1 = function (error) {
                if (error) {
                    console.log('Failed to install the update with error code:' + error.code);
                    console.log(error.description);
                    _this.updateIsRunning = false;
                }
                else {
                    console.log('Update Instaled');
                    _this.updateIsRunning = false;
                }
            };
            var updateCallback = function (error, data) {
                console.log('data: ' + JSON.stringify(data));
                if (error) {
                    console.log('error: ' + JSON.stringify(error));
                    alert('No Update: ' + JSON.stringify(error.description));
                }
                else {
                    console.log('Update is Loaded');
                    if (_this.window.confirm(Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_11__["_TRANSLATE"])('An update is available. Be sure to first sync your data before installing the update. If you have not done this, click `Cancel`. If you are ready to install the update, click `Yes`'))) {
                        _this.updateIsRunning = true;
                        console.log('Installing Update');
                        _this.window.chcp.installUpdate(installationCallback_1);
                    }
                    else {
                        console.log('Cancelled install; did not install update.');
                        _this.updateIsRunning = false;
                    }
                }
            };
            this.window.chcp.fetchUpdate(updateCallback);
        }
        else {
            var currentPath = this.window.location.pathname;
            var storedReleaseUuid = localStorage.getItem('release-uuid');
            this.window.location.href = (currentPath.replace(storedReleaseUuid + "/shell/", ''));
        }
    };
    AppComponent.prototype.getGeolocationPosition = function () {
        var options = {
            enableHighAccuracy: true
        };
        var queue = JSON.parse(localStorage.getItem('gpsQueue')) ? (JSON.parse(localStorage.getItem('gpsQueue'))) : null;
        navigator.geolocation.getCurrentPosition(function (position) {
            // Accuracy is in meters, a lower reading is better
            if (!queue || (typeof queue !== 'undefined' && ((position.timestamp - queue.timestamp) / 1000) >= 30) ||
                queue.accuracy >= position.coords.accuracy) {
                var x = {
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    altitudeAccuracy: position.coords.altitudeAccuracy,
                    heading: position.coords.heading,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    speed: position.coords.speed,
                    timestamp: position.timestamp
                };
                localStorage.setItem('gpsQueue', JSON.stringify(x));
            }
            else {
                console.log(position);
            }
        }, function (err) { }, options);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSidenav"]),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
    ], AppComponent.prototype, "sidenav", void 0);
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_core_window_ref_service__WEBPACK_IMPORTED_MODULE_6__["WindowRef"], _core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_5__["UserService"],
            _core_auth_services_authentication_service__WEBPACK_IMPORTED_MODULE_4__["AuthenticationService"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__["TranslateService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppComponent, HttpClientLoaderFactory, AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpClientLoaderFactory", function() { return HttpClientLoaderFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return _app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"]; });

/* harmony import */ var _case_management_case_management_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./case-management/case-management.module */ "./src/app/case-management/case-management.module.ts");
/* harmony import */ var _core_auth_auth_module__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./core/auth/auth.module */ "./src/app/core/auth/auth.module.ts");
/* harmony import */ var _core_sync_records_sync_records_module__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./core/sync-records/sync-records.module */ "./src/app/core/sync-records/sync-records.module.ts");
/* harmony import */ var _core_window_ref_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./core/window-ref.service */ "./src/app/core/window-ref.service.ts");
/* harmony import */ var _core_location_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./core/location.service */ "./src/app/core/location.service.ts");
/* harmony import */ var _core_update_update_module__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./core/update/update.module */ "./src/app/core/update/update.module.ts");
/* harmony import */ var _tangy_forms_tangy_forms_module__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./tangy-forms/tangy-forms.module */ "./src/app/tangy-forms/tangy-forms.module.ts");
/* harmony import */ var _user_profile_user_profile_module__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./user-profile/user-profile.module */ "./src/app/user-profile/user-profile.module.ts");
/* harmony import */ var _core_export_data_export_data_module__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./core/export-data/export-data.module */ "./src/app/core/export-data/export-data.module.ts");
/* harmony import */ var _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @ngx-translate/http-loader */ "./node_modules/@ngx-translate/http-loader/esm5/ngx-translate-http-loader.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





















// import { CaseManagementModule } from './case-management/case-management.module';

function HttpClientLoaderFactory(httpClient) {
    return new _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_20__["TranslateHttpLoader"](httpClient, './assets/', '.json');
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"]
            ],
            schemas: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["CUSTOM_ELEMENTS_SCHEMA"]],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__["BrowserAnimationsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatButtonModule"], _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatIconModule"], _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatCheckboxModule"], _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatInputModule"], _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatToolbarModule"], _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatSidenavModule"], _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatMenuModule"], _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatProgressBarModule"],
                _tangy_forms_tangy_forms_module__WEBPACK_IMPORTED_MODULE_17__["TangyFormsModule"],
                _core_auth_auth_module__WEBPACK_IMPORTED_MODULE_12__["AuthModule"],
                _case_management_case_management_module__WEBPACK_IMPORTED_MODULE_11__["CaseManagementModule"],
                _user_profile_user_profile_module__WEBPACK_IMPORTED_MODULE_18__["UserProfileModule"],
                _core_update_update_module__WEBPACK_IMPORTED_MODULE_16__["UpdateModule"],
                _core_sync_records_sync_records_module__WEBPACK_IMPORTED_MODULE_13__["SyncRecordsModule"],
                _core_export_data_export_data_module__WEBPACK_IMPORTED_MODULE_19__["ExportDataModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_9__["AppRoutingModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_0__["SharedModule"],
                _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__["TranslateModule"].forRoot({
                    loader: {
                        provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__["TranslateLoader"],
                        useFactory: HttpClientLoaderFactory,
                        deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"]]
                    }
                })
            ],
            providers: [_core_window_ref_service__WEBPACK_IMPORTED_MODULE_14__["WindowRef"],
                _core_location_service__WEBPACK_IMPORTED_MODULE_15__["Loc"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_10__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/case-management/_services/case-management.service.ts":
/*!**********************************************************************!*\
  !*** ./src/app/case-management/_services/case-management.service.ts ***!
  \**********************************************************************/
/*! exports provided: CaseManagementService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CaseManagementService", function() { return CaseManagementService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var pouchdb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pouchdb */ "./node_modules/pouchdb/lib/index-browser.es.js");
/* harmony import */ var _core_auth_services_authentication_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/auth/_services/authentication.service */ "./src/app/core/auth/_services/authentication.service.ts");
/* harmony import */ var _core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/auth/_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
/* harmony import */ var _core_location_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core/location.service */ "./src/app/core/location.service.ts");
/* harmony import */ var _shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/_services/app-config.service */ "./src/app/shared/_services/app-config.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







function _window() {
    return window;
}
var CaseManagementService = /** @class */ (function () {
    function CaseManagementService(authenticationService, loc, userService, http, appConfigService) {
        this.http = http;
        this.appConfigService = appConfigService;
        this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.loc = loc;
        this.userService = userService;
        this.userDB = new pouchdb__WEBPACK_IMPORTED_MODULE_2__["default"](authenticationService.getCurrentUserDBPath());
    }
    CaseManagementService.prototype.getMyLocationVisits = function (month, year) {
        return __awaiter(this, void 0, void 0, function () {
            var res, allLocations, locationList, myLocations, locations, results, visits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.get('./assets/location-list.json').toPromise()];
                    case 1:
                        res = _a.sent();
                        allLocations = Object.assign({}, res);
                        locationList = allLocations.locations;
                        myLocations = [];
                        locations = [];
                        return [4 /*yield*/, this.getVisitsByYearMonthLocationId()];
                    case 2:
                        results = _a.sent();
                        visits = removeDuplicates(results, 'key');
                        visits.forEach(function (visit) {
                            var visitKey = visit.key.split('-');
                            if (visitKey[2].toString() === month.toString() && visitKey[3].toString() === year.toString()) {
                                var item = findById(locationList, visitKey[0]);
                                locations.push({
                                    location: item.label,
                                    visits: countUnique(visits, item['id'].toString()),
                                    id: item['id']
                                });
                            }
                        });
                        return [2 /*return*/, removeDuplicates(locations, 'id')];
                }
            });
        });
    };
    CaseManagementService.prototype.getFilterDatesForAllFormResponses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var results, timeLapseFilter, visits;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getVisitsByYearMonthLocationId()];
                    case 1:
                        results = _a.sent();
                        timeLapseFilter = [];
                        visits = removeDuplicates(results, 'key');
                        visits.forEach(function (visit) {
                            var visitKey = visit.key.split('-');
                            timeLapseFilter.push({
                                value: visitKey[2].toString() + "-" + visitKey[3].toString(),
                                label: _this.monthNames[visitKey[2].toString()] + ", " + visitKey[3].toString(),
                            });
                        });
                        return [2 /*return*/, removeDuplicates(timeLapseFilter, 'value')];
                }
            });
        });
    };
    CaseManagementService.prototype.getFilterDatesForAllFormResponsesByLocationId = function (locationId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var result, timeLapseFilter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userDB.query('tangy-form/responsesByLocationId', { key: locationId, include_docs: true })];
                    case 1:
                        result = _a.sent();
                        timeLapseFilter = [];
                        result.rows.forEach(function (observation) {
                            var date = new Date(observation.doc.startDatetime);
                            timeLapseFilter.push({
                                value: date.getMonth() + "-" + date.getFullYear(),
                                label: _this.monthNames[date.getMonth()] + "-" + date.getFullYear()
                            });
                        });
                        return [2 /*return*/, removeDuplicates(timeLapseFilter, 'value')];
                }
            });
        });
    };
    CaseManagementService.prototype.getFormList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var forms, formList, _i, formList_1, form;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        forms = [];
                        return [4 /*yield*/, this.http.get('./assets/forms.json')
                                .toPromise()];
                    case 1:
                        formList = _a.sent();
                        for (_i = 0, formList_1 = formList; _i < formList_1.length; _i++) {
                            form = formList_1[_i];
                            forms.push({
                                title: form['title'],
                                src: form['src'],
                                id: form['id']
                            });
                        }
                        return [2 /*return*/, forms];
                }
            });
        });
    };
    CaseManagementService.prototype.getVisitsByYearMonthLocationId = function (locationId, include_docs) {
        return __awaiter(this, void 0, void 0, function () {
            var options, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = { key: locationId, include_docs: include_docs };
                        return [4 /*yield*/, this.userDB.query('tangy-form/responsesByYearMonthLocationId', options)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    CaseManagementService.prototype.getResponsesByLocationId = function (locationId, period) {
        return __awaiter(this, void 0, void 0, function () {
            var result, currentDate, monthYear, monthYearParts, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userDB.query('tangy-form/responsesByLocationId', { key: locationId, include_docs: true })];
                    case 1:
                        result = _a.sent();
                        currentDate = new Date();
                        monthYear = period ? period : currentDate.getMonth() + "-" + currentDate.getFullYear();
                        monthYearParts = monthYear.split('-');
                        result.rows = result.rows.filter(function (observation) {
                            var formStartDate = new Date(observation.doc.startDatetime);
                            return formStartDate.getMonth().toString() === monthYearParts[0] && formStartDate.getFullYear().toString() === monthYearParts[1];
                        });
                        return [4 /*yield*/, this.transformResultSet(result.rows)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    CaseManagementService.prototype.transformResultSet = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var appConfig, columnsToShow, formList, observations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.appConfigService.getAppConfig()];
                    case 1:
                        appConfig = _a.sent();
                        columnsToShow = appConfig.columnsOnVisitsTab;
                        return [4 /*yield*/, this.getFormList()];
                    case 2:
                        formList = _a.sent();
                        observations = result.map(function (observation) { return __awaiter(_this, void 0, void 0, function () {
                            var columns, index;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getDataForColumns(observation.doc['items'], columnsToShow)];
                                    case 1:
                                        columns = _a.sent();
                                        columns = columns.filter(function (x) { return x !== undefined; });
                                        index = formList.findIndex(function (c) { return c.id === observation.doc.form['id']; });
                                        return [2 /*return*/, {
                                                formTitle: formList[index]['title'],
                                                startDatetime: observation.doc.startDatetime,
                                                formIndex: index,
                                                _id: observation.doc._id,
                                                columns: columns
                                            }];
                                }
                            });
                        }); });
                        return [2 /*return*/, Promise.all(observations)];
                }
            });
        });
    };
    CaseManagementService.prototype.getDataForColumns = function (array, columns) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, columns.map(function (column) {
                        var data = array.map(function (el) {
                            return el.inputs.find(function (e) { return e.name === column; });
                        }).find(function (x) { return x; });
                        return ({
                            name: data ? data.name : column,
                            value: data ? data.value : ''
                        });
                    })];
            });
        });
    };
    CaseManagementService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_core_auth_services_authentication_service__WEBPACK_IMPORTED_MODULE_3__["AuthenticationService"],
            _core_location_service__WEBPACK_IMPORTED_MODULE_5__["Loc"],
            _core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_4__["UserService"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"],
            _shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_6__["AppConfigService"]])
    ], CaseManagementService);
    return CaseManagementService;
}());

function removeDuplicates(array, property) {
    return array.filter(function (obj, pos, arr) {
        return arr.map(function (mappedObject) { return mappedObject[property]; }).indexOf(obj[property]) === pos;
    });
}
function countUnique(array, key) {
    var count = 0;
    array.forEach(function (item) {
        count += item.key.toString().startsWith(key) ? 1 : 0;
    });
    return count;
}
function findById(object, property) {
    // Early return
    if (object.id === property) {
        return object;
    }
    var result;
    for (var p in object) {
        if (object.hasOwnProperty(p) && typeof object[p] === 'object') {
            result = findById(object[p], property);
            if (result) {
                return result;
            }
        }
    }
    return result;
}


/***/ }),

/***/ "./src/app/case-management/case-details/case-details.component.css":
/*!*************************************************************************!*\
  !*** ./src/app/case-management/case-details/case-details.component.css ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/case-management/case-details/case-details.component.html":
/*!**************************************************************************!*\
  !*** ./src/app/case-management/case-details/case-details.component.html ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-tab-group>\n  <mat-tab [label]=\"'Observations'|translate\">\n    <br>\n    <mat-card class=\"tangy-card-content-container\">\n      <app-observations-by-location></app-observations-by-location>\n    </mat-card>\n  </mat-tab>\n  <mat-tab [label]=\"'Reports'|translate\">\n    <iframe *ngIf=\"formUrl\" id=\"ifr\" [src]=\"formUrl|safeUrl\" appSeamlessWithWindow #iframe>\n    </iframe>\n  </mat-tab>\n</mat-tab-group>"

/***/ }),

/***/ "./src/app/case-management/case-details/case-details.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/case-management/case-details/case-details.component.ts ***!
  \************************************************************************/
/*! exports provided: CaseDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CaseDetailsComponent", function() { return CaseDetailsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/auth/_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var CaseDetailsComponent = /** @class */ (function () {
    function CaseDetailsComponent(userService, route) {
        this.userService = userService;
        this.route = route;
    }
    CaseDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.queryParams.subscribe(function (params) {
            _this.locationId = params['locationId'];
            _this.setURL();
        });
    };
    CaseDetailsComponent.prototype.setURL = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userDbName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserDatabase()];
                    case 1:
                        userDbName = _a.sent();
                        this.formUrl = "../tangy-forms/index.html#form_src=./assets/reports/form.html&hide_top_bar=true&database_name=" + userDbName + "&locationId=" + this.locationId;
                        return [2 /*return*/];
                }
            });
        });
    };
    CaseDetailsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-case-details',
            template: __webpack_require__(/*! ./case-details.component.html */ "./src/app/case-management/case-details/case-details.component.html"),
            styles: [__webpack_require__(/*! ./case-details.component.css */ "./src/app/case-management/case-details/case-details.component.css")]
        }),
        __metadata("design:paramtypes", [_core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_1__["UserService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]])
    ], CaseDetailsComponent);
    return CaseDetailsComponent;
}());



/***/ }),

/***/ "./src/app/case-management/case-management-routing.module.ts":
/*!*******************************************************************!*\
  !*** ./src/app/case-management/case-management-routing.module.ts ***!
  \*******************************************************************/
/*! exports provided: CaseManagementRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CaseManagementRoutingModule", function() { return CaseManagementRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _core_auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/auth/_guards/login-guard.service */ "./src/app/core/auth/_guards/login-guard.service.ts");
/* harmony import */ var _user_profile_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../user-profile/create-profile-guard.service */ "./src/app/user-profile/create-profile-guard.service.ts");
/* harmony import */ var _form_list_form_list_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./form-list/form-list.component */ "./src/app/case-management/form-list/form-list.component.ts");
/* harmony import */ var _case_details_case_details_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./case-details/case-details.component */ "./src/app/case-management/case-details/case-details.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [{
        path: 'case-details',
        component: _case_details_case_details_component__WEBPACK_IMPORTED_MODULE_5__["CaseDetailsComponent"],
        canActivate: [_core_auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_2__["LoginGuard"], _user_profile_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_3__["CreateProfileGuardService"]]
    }, {
        path: 'forms-list',
        component: _form_list_form_list_component__WEBPACK_IMPORTED_MODULE_4__["FormListComponent"],
        canActivate: [_core_auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_2__["LoginGuard"], _user_profile_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_3__["CreateProfileGuardService"]]
    }];
var CaseManagementRoutingModule = /** @class */ (function () {
    function CaseManagementRoutingModule() {
    }
    CaseManagementRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
            declarations: []
        })
    ], CaseManagementRoutingModule);
    return CaseManagementRoutingModule;
}());



/***/ }),

/***/ "./src/app/case-management/case-management.module.ts":
/*!***********************************************************!*\
  !*** ./src/app/case-management/case-management.module.ts ***!
  \***********************************************************/
/*! exports provided: CaseManagementModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CaseManagementModule", function() { return CaseManagementModule; });
/* harmony import */ var _angular_cdk_table__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/cdk/table */ "./node_modules/@angular/cdk/esm5/table.es5.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _services_case_management_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_services/case-management.service */ "./src/app/case-management/_services/case-management.service.ts");
/* harmony import */ var _case_management_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./case-management-routing.module */ "./src/app/case-management/case-management-routing.module.ts");
/* harmony import */ var _form_list_form_list_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./form-list/form-list.component */ "./src/app/case-management/form-list/form-list.component.ts");
/* harmony import */ var _schools_visited_schools_visited_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./schools-visited/schools-visited.component */ "./src/app/case-management/schools-visited/schools-visited.component.ts");
/* harmony import */ var _case_details_case_details_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./case-details/case-details.component */ "./src/app/case-management/case-details/case-details.component.ts");
/* harmony import */ var _observations_by_location_observations_by_location_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./observations-by-location/observations-by-location.component */ "./src/app/case-management/observations-by-location/observations-by-location.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};












var CaseManagementModule = /** @class */ (function () {
    function CaseManagementModule() {
    }
    CaseManagementModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _case_management_routing_module__WEBPACK_IMPORTED_MODULE_7__["CaseManagementRoutingModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatTabsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatInputModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatCardModule"],
                _angular_cdk_table__WEBPACK_IMPORTED_MODULE_0__["CdkTableModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatTableModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatSelectModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__["SharedModule"]
            ],
            declarations: [_form_list_form_list_component__WEBPACK_IMPORTED_MODULE_8__["FormListComponent"], _schools_visited_schools_visited_component__WEBPACK_IMPORTED_MODULE_9__["SchoolsVisitedComponent"],
                _case_details_case_details_component__WEBPACK_IMPORTED_MODULE_10__["CaseDetailsComponent"], _observations_by_location_observations_by_location_component__WEBPACK_IMPORTED_MODULE_11__["ObservationsByLocationComponent"]],
            providers: [_services_case_management_service__WEBPACK_IMPORTED_MODULE_6__["CaseManagementService"]]
        })
    ], CaseManagementModule);
    return CaseManagementModule;
}());



/***/ }),

/***/ "./src/app/case-management/form-list/form-list.component.css":
/*!*******************************************************************!*\
  !*** ./src/app/case-management/form-list/form-list.component.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".tangy-foreground-primary {\n    font-weight: 700;\n    font-size: 18px;\n    text-transform: capitalize;\n  }\n  \n  .tangy-location-list-icon {\n    color: #f26f10;\n    font-weight: 700;\n    font-size: 20px;\n  }\n  \n  .mat-title {\n    color: #3c5b8d;\n    font-size: 1.75em;\n    font-weight: 400;\n    font-family: Roboto, \"Helvetica Nue\", sans-serif;\n    margin:.75em;\n  }\n  \n  mat-form-field.tangy-half-width {\n    display:inline-block;\n    float:right;\n    position: relative;\n    top: 5px;\n  }\n  \n  mat-list {\n    display:block;\n    width: 100%;\n  }\n  \n  "

/***/ }),

/***/ "./src/app/case-management/form-list/form-list.component.html":
/*!********************************************************************!*\
  !*** ./src/app/case-management/form-list/form-list.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-tab-group>\n  <mat-tab label=\"{{'My Forms'|translate}}\">\n    <mat-card class=\"tangy-card-content-container\">\n      <mat-list>\n        <mat-list-item class=\"tangy-location-list\">\n          <span class=\"tangy-foreground-primary\">{{'Select Form Name'|translate}}</span>\n        </mat-list-item>\n        <mat-list-item class=\"tangy-location-list\" *ngFor=\"let form of formList; let formIndex=index\">\n          <a class=\"tangy-foreground-primary\" [routerLink]=\"['/tangy-forms-player/']\" [queryParams]={formIndex:formIndex}>\n            <i class=\"material-icons md-24 tangy-location-list-icon\">play_circle_filled</i>\n          </a>\n          <span>{{form.title}}</span>\n        </mat-list-item>\n      </mat-list>\n\n      <p *ngIf=\"!formList\" class=\"mat-h3\">{{'No Forms Currently Defined'|translate}}</p>\n    </mat-card>\n\n  </mat-tab>\n  <mat-tab label=\"{{'Visits'|translate}}\">\n    <br>\n    <mat-card class=\"tangy-card-content-container\">\n      <app-schools-visited></app-schools-visited>\n    </mat-card>\n  </mat-tab>\n</mat-tab-group>"

/***/ }),

/***/ "./src/app/case-management/form-list/form-list.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/case-management/form-list/form-list.component.ts ***!
  \******************************************************************/
/*! exports provided: FormListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormListComponent", function() { return FormListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_case_management_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/case-management.service */ "./src/app/case-management/_services/case-management.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var FormListComponent = /** @class */ (function () {
    function FormListComponent(caseManagementService) {
        this.caseManagementService = caseManagementService;
    }
    FormListComponent.prototype.ngOnInit = function () {
        this.getFormList();
    };
    FormListComponent.prototype.getFormList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = this;
                        return [4 /*yield*/, this.caseManagementService.getFormList()];
                    case 1:
                        _a.formList = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('search'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], FormListComponent.prototype, "search", void 0);
    FormListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-form-list',
            template: __webpack_require__(/*! ./form-list.component.html */ "./src/app/case-management/form-list/form-list.component.html"),
            styles: [__webpack_require__(/*! ./form-list.component.css */ "./src/app/case-management/form-list/form-list.component.css")]
        }),
        __metadata("design:paramtypes", [_services_case_management_service__WEBPACK_IMPORTED_MODULE_1__["CaseManagementService"]])
    ], FormListComponent);
    return FormListComponent;
}());



/***/ }),

/***/ "./src/app/case-management/observations-by-location/observations-by-location.component.css":
/*!*************************************************************************************************!*\
  !*** ./src/app/case-management/observations-by-location/observations-by-location.component.css ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "* { \n    word-wrap:break-word;\n  }\n  \n  table { \n    table-layout:fixed;\n    width:100%;\n  }\n  \n  table.observations {\n    border: 0px solid #1C6EA4;\n    background-color: #EEEEEE;\n    width: 100%;\n    text-align: left;\n    border-collapse: collapse;\n  }\n  \n  table.observations td, table.observations th {\n    border: 0px solid #AAAAAA;\n    padding: 3px 2px;\n  }\n  \n  table.observations tbody td {\n    font-size: 13px;\n  }\n  \n  table.observations tr:nth-child(even) {\n    background: #D0E4F5;\n  }\n  \n  table.observations thead {\n    background: #F26F10;\n    background: linear-gradient(to bottom, #f5934c 0%, #f37d28 66%, #F26F10 100%);\n    border-bottom: 0px solid #3C5B8D;\n  }\n  \n  table.observations thead th {\n    font-size: 13px;\n    font-weight: normal;\n    color: #FFFFFF;\n  }\n  \n  table.observations tfoot {\n    font-size: 14px;\n    font-weight: bold;\n    color: #FFFFFF;\n    background: #D0E4F5;\n    background: linear-gradient(to bottom, #dcebf7 0%, #d4e6f6 66%, #D0E4F5 100%);\n    border-top: 0px solid #3C5B8D;\n  }\n  \n  table.observations tfoot td {\n    font-size: 14px;\n  }\n  \n  table.observations tfoot .links {\n    text-align: right;\n  }\n  \n  table.observations tfoot .links a{\n    display: inline-block;\n    background: #1C6EA4;\n    color: #FFFFFF;\n    padding: 2px 8px;\n    border-radius: 5px;\n  }"

/***/ }),

/***/ "./src/app/case-management/observations-by-location/observations-by-location.component.html":
/*!**************************************************************************************************!*\
  !*** ./src/app/case-management/observations-by-location/observations-by-location.component.html ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<select name=\"datefilter\" id=\"datefiler\" (change)=\"onSelectDate($event)\">\n  <option value=\"_\">{{'Filter'|translate}}</option>\n  <option *ngFor=\"let date of filterValuesForDates\" [value]=\"date.value\">{{date.label}}</option>\n</select>\n<br>\n<br>\n<table class=\"observations\">\n  <thead>\n    <tr>\n      <th>{{'Form Name'|translate}}</th>\n      <th *ngFor=\"let col of columns\">\n        {{col.name}}\n      </th>\n      <th>{{'Date and Time'|translate}}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr *ngFor=\"let observation of observations\">\n      <td>\n        <a class=\"tangy-foreground-primary\" [routerLink]=\"['/tangy-forms-player']\" [queryParams]=\"{formIndex:observation.formIndex, 'responseId':observation._id}\">\n          <i class=\"material-icons mat-18 tangy-location-list-icon\">open_in_new</i>\n        </a>\n        {{observation.formTitle}}\n      </td>\n      <td *ngFor=\"let col of observation.columns\">\n        {{col.value|json}}\n      </td>\n      <td>\n        {{observation.startDatetime| date:'MMM d, y, h:mm a'}}\n      </td>\n    </tr>\n  </tbody>\n</table>"

/***/ }),

/***/ "./src/app/case-management/observations-by-location/observations-by-location.component.ts":
/*!************************************************************************************************!*\
  !*** ./src/app/case-management/observations-by-location/observations-by-location.component.ts ***!
  \************************************************************************************************/
/*! exports provided: ObservationsByLocationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObservationsByLocationComponent", function() { return ObservationsByLocationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_case_management_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/case-management.service */ "./src/app/case-management/_services/case-management.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var ObservationsByLocationComponent = /** @class */ (function () {
    function ObservationsByLocationComponent(caseManagementService, route) {
        this.caseManagementService = caseManagementService;
        this.route = route;
        this.observations = [];
    }
    ObservationsByLocationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.queryParams.subscribe(function (params) {
            _this.locationId = params['locationId'];
            _this.getObservations(_this.locationId);
        });
    };
    ObservationsByLocationComponent.prototype.getObservations = function (locationId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.caseManagementService.getFilterDatesForAllFormResponsesByLocationId(locationId)];
                    case 1:
                        _a.filterValuesForDates = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.caseManagementService.getResponsesByLocationId(locationId)];
                    case 2:
                        _b.observations = _c.sent();
                        this.columns = this.observations[0]['columns'];
                        return [2 /*return*/];
                }
            });
        });
    };
    ObservationsByLocationComponent.prototype.onSelectDate = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var dateParts, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dateParts = event.target.value;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        if (dateParts === '_') {
                            dateParts = this.filterValuesForDates[0].value;
                        }
                        _a = this;
                        return [4 /*yield*/, this.caseManagementService.getResponsesByLocationId(this.locationId, dateParts)];
                    case 2:
                        _a.observations =
                            _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.error(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ObservationsByLocationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-observations-by-location',
            template: __webpack_require__(/*! ./observations-by-location.component.html */ "./src/app/case-management/observations-by-location/observations-by-location.component.html"),
            styles: [__webpack_require__(/*! ./observations-by-location.component.css */ "./src/app/case-management/observations-by-location/observations-by-location.component.css")]
        }),
        __metadata("design:paramtypes", [_services_case_management_service__WEBPACK_IMPORTED_MODULE_1__["CaseManagementService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]])
    ], ObservationsByLocationComponent);
    return ObservationsByLocationComponent;
}());



/***/ }),

/***/ "./src/app/case-management/schools-visited/schools-visited.component.css":
/*!*******************************************************************************!*\
  !*** ./src/app/case-management/schools-visited/schools-visited.component.css ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/case-management/schools-visited/schools-visited.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/case-management/schools-visited/schools-visited.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- The month value is 0 indexed to correspond to Javascript's zero index on date.getMonth()-->\n<select name=\"datefilter\" id=\"datefiler\" (change)=\"onSelectDate($event)\">\n  <option value=\"_\">{{'Filter'|translate}}</option>\n  <option *ngFor=\"let date of filterValuesForDates\" [value]=\"date.value\">{{date.label}}</option>\n</select>\n<mat-list>\n  <mat-list-item class=\"tangy-location-list\">\n    <span class=\"tangy-foreground-primary\">{{'School'|translate}}</span>\n    <span class=\"tangy-spacer\"></span>\n    <span class=\"tangy-foreground-primary\">{{'Visits'|translate}}</span>\n  </mat-list-item>\n  <mat-list-item class=\"tangy-location-list\" *ngFor=\"let location of visits\">\n    <a class=\"tangy-foreground-primary\" [routerLink]=\"['/case-details']\" [queryParams]=\"{locationId:location.id}\">\n      <i class=\"material-icons mat-18 tangy-location-list-icon\">open_in_new</i>\n    </a>\n    <span>{{location.location}}</span>\n    <span class=\"tangy-spacer\"></span>\n    <span>{{location.visits}}</span>\n  </mat-list-item>\n  <mat-list-item *ngIf=\"visits.length<=0\" class=\"tangy-location-list\">{{'No Data for'|translate}} {{currentDate|date:'MMM, yyyy'}}</mat-list-item>\n</mat-list>"

/***/ }),

/***/ "./src/app/case-management/schools-visited/schools-visited.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/case-management/schools-visited/schools-visited.component.ts ***!
  \******************************************************************************/
/*! exports provided: SchoolsVisitedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SchoolsVisitedComponent", function() { return SchoolsVisitedComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_case_management_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/case-management.service */ "./src/app/case-management/_services/case-management.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var SchoolsVisitedComponent = /** @class */ (function () {
    function SchoolsVisitedComponent(caseManagementService) {
        this.caseManagementService = caseManagementService;
        this.visits = [];
    }
    SchoolsVisitedComponent.prototype.ngOnInit = function () {
        this.getMyLocations();
    };
    SchoolsVisitedComponent.prototype.getMyLocations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.currentDate = new Date();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        _a = this;
                        return [4 /*yield*/, this.caseManagementService.getMyLocationVisits(this.currentDate.getMonth(), this.currentDate.getFullYear())];
                    case 2:
                        _a.visits =
                            _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.caseManagementService.getFilterDatesForAllFormResponses()];
                    case 3:
                        _b.filterValuesForDates = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _c.sent();
                        console.error(error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SchoolsVisitedComponent.prototype.onSelectDate = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var dateParts, _a, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dateParts = event.target.value;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        if (dateParts === '_') {
                            dateParts = this.filterValuesForDates[0].value;
                        }
                        dateParts = dateParts.split('-');
                        _a = this;
                        return [4 /*yield*/, this.caseManagementService.getMyLocationVisits(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10))];
                    case 2:
                        _a.visits =
                            _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        console.error(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SchoolsVisitedComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-schools-visited',
            template: __webpack_require__(/*! ./schools-visited.component.html */ "./src/app/case-management/schools-visited/schools-visited.component.html"),
            styles: [__webpack_require__(/*! ./schools-visited.component.css */ "./src/app/case-management/schools-visited/schools-visited.component.css")]
        }),
        __metadata("design:paramtypes", [_services_case_management_service__WEBPACK_IMPORTED_MODULE_1__["CaseManagementService"]])
    ], SchoolsVisitedComponent);
    return SchoolsVisitedComponent;
}());



/***/ }),

/***/ "./src/app/core/auth/_guards/login-guard.service.ts":
/*!**********************************************************!*\
  !*** ./src/app/core/auth/_guards/login-guard.service.ts ***!
  \**********************************************************/
/*! exports provided: LoginGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginGuard", function() { return LoginGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../_services/authentication.service */ "./src/app/core/auth/_services/authentication.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LoginGuard = /** @class */ (function () {
    function LoginGuard(router, authenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
    }
    LoginGuard.prototype.canActivate = function (route, state) {
        if (this.authenticationService.isLoggedIn()) {
            return true;
        }
        //  else if (!this.authenticationService.isLoggedIn() && this.authenticationService.isNoPasswordMode()) {
        //   this.router.navigate(['/login-nopassword'], { queryParams: { returnUrl: state.url } });
        //   return true;
        // }
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        return false;
    };
    LoginGuard = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _services_authentication_service__WEBPACK_IMPORTED_MODULE_2__["AuthenticationService"]])
    ], LoginGuard);
    return LoginGuard;
}());



/***/ }),

/***/ "./src/app/core/auth/_services/authentication.service.ts":
/*!***************************************************************!*\
  !*** ./src/app/core/auth/_services/authentication.service.ts ***!
  \***************************************************************/
/*! exports provided: AuthenticationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthenticationService", function() { return AuthenticationService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var pouchdb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pouchdb */ "./node_modules/pouchdb/lib/index-browser.es.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/_services/app-config.service */ "./src/app/shared/_services/app-config.service.ts");
/* harmony import */ var _user_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./user.service */ "./src/app/core/auth/_services/user.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

//import * as bcrypt from 'bcryptjs';




var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(userService, appConfigService) {
        this.userService = userService;
        this.appConfigService = appConfigService;
        this.DB = new pouchdb__WEBPACK_IMPORTED_MODULE_1__["default"]('users');
        this.currentUserLoggedIn$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.userShouldResetPassword$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
    }
    AuthenticationService.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var isCredentialsValid, userExists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isCredentialsValid = false;
                        return [4 /*yield*/, this.userService.doesUserExist(username)];
                    case 1:
                        userExists = _a.sent();
                        if (!userExists) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.confirmPassword(username, password)];
                    case 2:
                        /**
                         *@TODO if Security policy require password is false, then no need to check password. Just login the user
                         */
                        isCredentialsValid = _a.sent();
                        if (isCredentialsValid) {
                            localStorage.setItem('currentUser', username);
                            this._currentUserLoggedIn = true;
                            this.currentUserLoggedIn$.next(this._currentUserLoggedIn);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, isCredentialsValid];
                }
            });
        });
    };
    AuthenticationService.prototype.resetPassword = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var userExists, doesAnswerMatch, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.userService.doesUserExist(user.username)];
                    case 1:
                        userExists = _b.sent();
                        return [4 /*yield*/, this.confirmSecurityQuestion(user)];
                    case 2:
                        doesAnswerMatch = _b.sent();
                        _a = userExists && doesAnswerMatch;
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.userService.changeUserPassword(user)];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4:
                        if (_a) {
                            localStorage.setItem('currentUser', user.username);
                            this._currentUserLoggedIn = true;
                            this.currentUserLoggedIn$.next(this._currentUserLoggedIn);
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthenticationService.prototype.confirmPassword = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var doesPasswordMatch, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doesPasswordMatch = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.DB.find({ selector: { username: username } })];
                    case 2:
                        result = _a.sent();
                        if (result.docs.length > 0) {
                            //doesPasswordMatch = await bcrypt.compare(password, result.docs[0].password);
                            doesPasswordMatch = (password === result.docs[0].password) ? true : false;
                            if (doesPasswordMatch) {
                                /**
                                 * @TODO we will probably need to save the current timestamp when the user logged in for security policy use
                                 * Security policy Example: 1) Expire user after 5 minutes or 2) never
                                 * @TODO Refactor for Redux send Action to Current User store. Dont do this until our ngrx stores are backed up by local storage
                                 */
                            }
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, doesPasswordMatch];
                }
            });
        });
    };
    ;
    AuthenticationService.prototype.confirmSecurityQuestion = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var doesAnswerMatch, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doesAnswerMatch = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.DB.find({ selector: { username: user.username } })];
                    case 2:
                        result = _a.sent();
                        if (result.docs.length > 0) {
                            //doesAnswerMatch = result.docs[0].hashSecurityQuestionResponse ?
                            //await bcrypt.compare(user.securityQuestionResponse, result.docs[0].securityQuestionResponse) :
                            // user.securityQuestionResponse === result.docs[0].securityQuestionResponse;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, doesAnswerMatch];
                }
            });
        });
    };
    AuthenticationService.prototype.logout = function () {
        localStorage.removeItem('currentUser');
        this._currentUserLoggedIn = false;
        this.currentUserLoggedIn$.next(this._currentUserLoggedIn);
    };
    AuthenticationService.prototype.isLoggedIn = function () {
        this._currentUserLoggedIn = false;
        this._currentUserLoggedIn = !!localStorage.getItem('currentUser');
        this.currentUserLoggedIn$.next(this._currentUserLoggedIn);
        return this._currentUserLoggedIn;
    };
    AuthenticationService.prototype.shouldResetPassword = function () {
        this._userShouldResetPassword = false;
        this._userShouldResetPassword = !!localStorage.getItem('userShouldResetPassword');
        this.userShouldResetPassword$.next(this._userShouldResetPassword);
        return this._userShouldResetPassword;
    };
    AuthenticationService.prototype.getSecurityPolicy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var appConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.appConfigService.getAppConfig()];
                    case 1:
                        appConfig = _a.sent();
                        return [2 /*return*/, appConfig.securityPolicy];
                }
            });
        });
    };
    AuthenticationService.prototype.isNoPasswordMode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var policy, isNoPasswordMode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSecurityPolicy()];
                    case 1:
                        policy = _a.sent();
                        return [4 /*yield*/, policy.find(function (p) { return p === 'noPassword'; })];
                    case 2:
                        isNoPasswordMode = _a.sent();
                        return [2 /*return*/, isNoPasswordMode === 'noPassword'];
                }
            });
        });
    };
    AuthenticationService.prototype.getCurrentUser = function () {
        return localStorage.getItem('currentUser');
    };
    AuthenticationService.prototype.getCurrentUserDBPath = function () {
        return localStorage.getItem('currentUser');
    };
    AuthenticationService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_user_service__WEBPACK_IMPORTED_MODULE_4__["UserService"],
            _shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_3__["AppConfigService"]])
    ], AuthenticationService);
    return AuthenticationService;
}());



/***/ }),

/***/ "./src/app/core/auth/_services/user.service.ts":
/*!*****************************************************!*\
  !*** ./src/app/core/auth/_services/user.service.ts ***!
  \*****************************************************/
/*! exports provided: UserService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var pouchdb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! pouchdb */ "./node_modules/pouchdb/lib/index-browser.es.js");
/* harmony import */ var pouchdb_find__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! pouchdb-find */ "./node_modules/pouchdb-find/lib/index-browser.es.js");
/* harmony import */ var pouchdb_upsert__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! pouchdb-upsert */ "./node_modules/pouchdb-upsert/index.js");
/* harmony import */ var pouchdb_upsert__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(pouchdb_upsert__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _tangy_forms_tangy_form_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../tangy-forms/tangy-form-service */ "./src/app/tangy-forms/tangy-form-service.ts");
/* harmony import */ var _update_update_updates__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../update/update/updates */ "./src/app/core/update/update/updates.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



//import { uuid as Uuid } from 'js-uuid';





var UserService = /** @class */ (function () {
    //constructor(private uuid: Uuid) { }
    function UserService() {
        this.userData = {};
        this.DB = new pouchdb__WEBPACK_IMPORTED_MODULE_3__["default"]('users');
        this.LOGGED_IN_USER_DATABASE_NAME = 'currentUser';
    }
    UserService.prototype.create = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var userUUID, hashedPassword, _a, _b, _c, postUserdata, userDb, result, tangyFormService, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        userUUID = this.getUuid();
                        return [4 /*yield*/, this.hashValue(payload.password)];
                    case 1:
                        hashedPassword = _d.sent();
                        this.userData = payload;
                        this.userData['userUUID'] = userUUID;
                        this.userData['password'] = hashedPassword;
                        _a = this.userData;
                        _b = 'securityQuestionResponse';
                        if (!this.userData['hashSecurityQuestionResponse']) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.hashValue(payload.securityQuestionResponse)];
                    case 2:
                        _c = _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _c = this.userData['securityQuestionResponse'];
                        _d.label = 4;
                    case 4:
                        _a[_b] = _c;
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 11, , 12]);
                        return [4 /*yield*/, this.DB.post(this.userData)];
                    case 6:
                        postUserdata = _d.sent();
                        userDb = new pouchdb__WEBPACK_IMPORTED_MODULE_3__["default"](this.userData['username']);
                        if (!postUserdata) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.initUserProfile(this.userData['username'], userUUID)];
                    case 7:
                        result = _d.sent();
                        tangyFormService = new _tangy_forms_tangy_form_service__WEBPACK_IMPORTED_MODULE_6__["TangyFormService"]({ databaseName: this.userData['username'] });
                        return [4 /*yield*/, tangyFormService.initialize()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, userDb.put({
                                _id: 'info',
                                atUpdateIndex: _update_update_updates__WEBPACK_IMPORTED_MODULE_7__["updates"].length - 1
                            })];
                    case 9:
                        _d.sent();
                        return [2 /*return*/, result];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_1 = _d.sent();
                        console.error(error_1);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.initUserProfile = function (userDBPath, profileId) {
        return __awaiter(this, void 0, void 0, function () {
            var userDB, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userDBPath) return [3 /*break*/, 4];
                        userDB = new pouchdb__WEBPACK_IMPORTED_MODULE_3__["default"](userDBPath);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, userDB.put({
                                _id: profileId,
                                collection: 'user-profile'
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_2 = _a.sent();
                        console.error(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUserProfile = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var databaseName, _a, tangyFormService, results;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = username;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getUserDatabase()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        databaseName = _a;
                        tangyFormService = new _tangy_forms_tangy_form_service__WEBPACK_IMPORTED_MODULE_6__["TangyFormService"]({ databaseName: databaseName });
                        return [4 /*yield*/, tangyFormService.getResponsesByFormId('user-profile')];
                    case 3:
                        results = _b.sent();
                        return [2 /*return*/, results[0]];
                }
            });
        });
    };
    UserService.prototype.doesUserExist = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var userExists, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!username) return [3 /*break*/, 5];
                        pouchdb__WEBPACK_IMPORTED_MODULE_3__["default"].plugin(pouchdb_find__WEBPACK_IMPORTED_MODULE_4__["default"]);
                        /**
                         * @TODO We may want to run this on the first time when the app runs.
                         */
                        this.DB.createIndex({
                            index: { fields: ['username'] }
                        })
                            .then(function (data) { return console.log('Indexing Succesful'); })
                            .catch(function (err) { return console.error(err); });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.DB.find({ selector: { username: username } })];
                    case 2:
                        result = _a.sent();
                        if (result.docs.length > 0) {
                            userExists = true;
                        }
                        else {
                            userExists = false;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        userExists = true;
                        console.error(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        userExists = true;
                        return [2 /*return*/, userExists];
                    case 6: return [2 /*return*/, userExists];
                }
            });
        });
    };
    UserService.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, users_1, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.DB.allDocs({ include_docs: true })];
                    case 1:
                        result = _a.sent();
                        users_1 = [];
                        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["from"])(result.rows).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["map"])(function (doc) { return doc; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["filter"])(function (doc) { return !doc['id'].startsWith('_design'); })).subscribe(function (doc) {
                            users_1.push({
                                username: doc['doc'].username
                            });
                        });
                        return [2 /*return*/, users_1];
                    case 2:
                        error_4 = _a.sent();
                        console.error(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.getUsernames = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllUsers()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response
                                .filter(function (user) { return user.hasOwnProperty('username'); })
                                .map(function (user) { return user.username; })];
                }
            });
        });
    };
    UserService.prototype.changeUserPassword = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var DB, password, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pouchdb__WEBPACK_IMPORTED_MODULE_3__["default"].plugin(pouchdb_upsert__WEBPACK_IMPORTED_MODULE_5__);
                        DB = new pouchdb__WEBPACK_IMPORTED_MODULE_3__["default"]('users');
                        return [4 /*yield*/, this.hashValue(user.newPassword)];
                    case 1:
                        password = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.DB.find({ selector: { username: user.username } })];
                    case 3:
                        result = _a.sent();
                        if (!(result.docs.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, DB.upsert(result.docs[0]._id, function (doc) {
                                doc.password = password;
                                return doc;
                            })];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_5 = _a.sent();
                        console.error(error_5);
                        return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.hashValue = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Bcrypt issue https://github.com/dcodeIO/bcrypt.js/issues/71j
                //const salt = bcrypt.genSaltSync(10);
                //return bcrypt.hashSync(value, salt);
                return [2 /*return*/, value];
            });
        });
    };
    UserService.prototype.setUserDatabase = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, localStorage.setItem(this.LOGGED_IN_USER_DATABASE_NAME, username)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.prototype.getUserDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, localStorage.getItem(this.LOGGED_IN_USER_DATABASE_NAME)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.prototype.removeUserDatabase = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                localStorage.removeItem(this.LOGGED_IN_USER_DATABASE_NAME);
                return [2 /*return*/];
            });
        });
    };
    // Example from https://gist.github.com/vbfox/1987edc194626c12d9c0dc31da084744
    UserService.prototype.getUuid = function () {
        function getRandomFromMathRandom() {
            var result = new Array(16);
            var r = 0;
            for (var i = 0; i < 16; i++) {
                if ((i & 0x03) === 0) {
                    r = Math.random() * 0x100000000;
                }
                result[i] = r >>> ((i & 0x03) << 3) & 0xff;
            }
            return result;
        }
        function getRandomFunction() {
            // tslint:disable-next-line:no-string-literal
            var browserCrypto = window.crypto || window["msCrypto"];
            if (browserCrypto && browserCrypto.getRandomValues) {
                // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
                //
                // Moderately fast, high quality
                try {
                    return function getRandomFromCryptoRandom() {
                        var result = new Uint8Array(16);
                        browserCrypto.getRandomValues(result);
                        return result;
                    };
                }
                catch (e) { }
            }
            // Math.random()-based (RNG)
            //
            // If all else fails, use Math.random().  It's fast, but is of unspecified
            // quality.
            return getRandomFromMathRandom;
        }
        var getRandom = getRandomFunction();
        var ByteHexMappings = /** @class */ (function () {
            function ByteHexMappings() {
                this.byteToHex = [];
                this.hexToByte = {};
                for (var i = 0; i < 256; i++) {
                    this.byteToHex[i] = (i + 0x100).toString(16).substr(1);
                    this.hexToByte[this.byteToHex[i]] = i;
                }
            }
            return ByteHexMappings;
        }());
        var byteHexMappings = new ByteHexMappings();
        function getUuidV4() {
            var result = getRandom();
            // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
            result[6] = (result[6] & 0x0f) | 0x40;
            result[8] = (result[8] & 0x3f) | 0x80;
            return result;
        }
        function uuidToString(buf, offset) {
            if (offset === void 0) { offset = 0; }
            var i = offset;
            var bth = byteHexMappings.byteToHex;
            return bth[buf[i++]] + bth[buf[i++]] +
                bth[buf[i++]] + bth[buf[i++]] + "-" +
                bth[buf[i++]] + bth[buf[i++]] + "-" +
                bth[buf[i++]] + bth[buf[i++]] + "-" +
                bth[buf[i++]] + bth[buf[i++]] + "-" +
                bth[buf[i++]] + bth[buf[i++]] +
                bth[buf[i++]] + bth[buf[i++]] +
                bth[buf[i++]] + bth[buf[i++]];
        }
        function getUuidV4String() {
            return uuidToString(getUuidV4());
        }
        return getUuidV4String();
    };
    UserService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])(),
        __metadata("design:paramtypes", [])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "./src/app/core/auth/auth-routing.module.ts":
/*!**************************************************!*\
  !*** ./src/app/core/auth/auth-routing.module.ts ***!
  \**************************************************/
/*! exports provided: AuthRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthRoutingModule", function() { return AuthRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./login/login.component */ "./src/app/core/auth/login/login.component.ts");
/* harmony import */ var _registration_registration_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./registration/registration.component */ "./src/app/core/auth/registration/registration.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




// @TODO Add edit-profile component.
// import { EditProfileComponent } from './edit-profile/edit-profile.component';
var routes = [{
        path: 'login',
        component: _login_login_component__WEBPACK_IMPORTED_MODULE_2__["LoginComponent"]
    }, {
        path: 'register',
        component: _registration_registration_component__WEBPACK_IMPORTED_MODULE_3__["RegistrationComponent"]
    }
];
var AuthRoutingModule = /** @class */ (function () {
    function AuthRoutingModule() {
    }
    AuthRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], AuthRoutingModule);
    return AuthRoutingModule;
}());



/***/ }),

/***/ "./src/app/core/auth/auth.module.ts":
/*!******************************************!*\
  !*** ./src/app/core/auth/auth.module.ts ***!
  \******************************************/
/*! exports provided: AuthModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthModule", function() { return AuthModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _guards_login_guard_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_guards/login-guard.service */ "./src/app/core/auth/_guards/login-guard.service.ts");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_services/authentication.service */ "./src/app/core/auth/_services/authentication.service.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
/* harmony import */ var _auth_routing_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./auth-routing.module */ "./src/app/core/auth/auth-routing.module.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./login/login.component */ "./src/app/core/auth/login/login.component.ts");
/* harmony import */ var _registration_registration_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./registration/registration.component */ "./src/app/core/auth/registration/registration.component.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../shared/shared.module */ "./src/app/shared/shared.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};












var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSelectModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
                _auth_routing_module__WEBPACK_IMPORTED_MODULE_8__["AuthRoutingModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_11__["SharedModule"]
            ],
            providers: [_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_5__["LoginGuard"], _services_authentication_service__WEBPACK_IMPORTED_MODULE_6__["AuthenticationService"], _services_user_service__WEBPACK_IMPORTED_MODULE_7__["UserService"]],
            declarations: [_login_login_component__WEBPACK_IMPORTED_MODULE_9__["LoginComponent"], _registration_registration_component__WEBPACK_IMPORTED_MODULE_10__["RegistrationComponent"]]
        })
    ], AuthModule);
    return AuthModule;
}());



/***/ }),

/***/ "./src/app/core/auth/login/login.component.css":
/*!*****************************************************!*\
  !*** ./src/app/core/auth/login/login.component.css ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mat-title {\n    color: #3c5b8d;\n    font-size: 1.5em;\n    font-weight: 400;\n    font-family: Roboto, \"Helvetica Nue\", sans-serif;\n  }\n  \n  mat-placeholder i {\n    margin-right:.075em;\n  \n  }\n  \n  input.mat-input-element {\n    margin-top: 1em;\n  }\n  \n  .mat-placeholder-required.mat-form-field-required-marker.ng-tns-c6-2 .mat-form-field-invalid .mat-form-field-placeholder.mat-accent, .mat-form-field-invalid .mat-form-field-placeholder .mat-form-field-required-marker {\n  position:relative;\n    bottom: 1em !important;\n  }\n  \n  .mat-form-field {\n    width: 76%;\n  }\n  "

/***/ }),

/***/ "./src/app/core/auth/login/login.component.html":
/*!******************************************************!*\
  !*** ./src/app/core/auth/login/login.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"login-app-content\">\n  <div class=\"group\">\n    <form role=\"form\" #login='ngForm' novalidate>\n      <h3 class=\"mat-title\">{{'LOGIN'|translate}}</h3>\n      <br>\n      <br>\n      <select *ngIf=\"listUsernamesOnLoginScreen\" name=\"usernames\" id=\"usernames\" (change)=\"onSelectUsername($event)\">\n        <option value=\"_\">{{'Select your Username'|translate}}</option>\n        <option *ngFor=\"let username of allUsernames\" [value]=\"username\">{{username}}</option>\n      </select>\n      <mat-form-field *ngIf=\"!listUsernamesOnLoginScreen\">\n        <input matInput type=\"text\" required [(ngModel)]=\"user.username\" id=\"username\" name=\"username\">\n        <mat-placeholder>\n          <i class=\"material-icons app-input-icon\">face</i>\n          <span>{{'Username'|translate}}</span>\n        </mat-placeholder>\n      </mat-form-field>\n      <br>\n      <br>\n      <mat-form-field *ngIf=\"!showRecoveryInput\">\n        <input matInput type=\"password\" required [(ngModel)]=\"user.password\" id=\"password\" name=\"password\">\n        <mat-placeholder>\n          <i class=\"material-icons app-input-icon\">lock_open</i>\n          <span>{{'Password'|translate}}</span>\n        </mat-placeholder>\n      </mat-form-field>\n      <div *ngIf=\"showRecoveryInput\">\n        <mat-form-field>\n          <input matInput type=\"text\" required [(ngModel)]=\"user.securityQuestionResponse\" id=\"securityQuestionResponse\" name=\"securityQuestionResponse\">\n          <mat-placeholder>\n            <i class=\"material-icons app-input-icon\">security</i>\n            <span>{{securityQuestionText}}</span>\n          </mat-placeholder>\n        </mat-form-field>\n        <br>\n        <br>\n        <mat-form-field>\n          <input name=\"newPassword\" matInput [(ngModel)]=\"user.newPassword\" type=\"password\" required>\n          <mat-placeholder>\n            <i class=\"material-icons mat-11 app-input-icon\">lock_open</i>{{'New Password'|translate}}\n          </mat-placeholder>\n        </mat-form-field>\n        <mat-form-field>\n          <input name=\"confirmNewPassword\" matInput [(ngModel)]=\"user.confirmNewPassword\" type=\"password\" required>\n          <mat-placeholder>\n            <i class=\"material-icons mat-11 app-input-icon\">lock_open</i>{{'Confirm New Password'|translate}}\n          </mat-placeholder>\n        </mat-form-field>\n      </div>\n      <br>\n      <br>\n      <span>\n        <small>\n          <a href=\"#\" *ngIf=\"!showRecoveryInput\" (click)=\"toggleRecoveryInput()\">{{'RESET PASSWORD'|translate}}</a>\n          <a href=\"#\" *ngIf=\"showRecoveryInput\" (click)=\"toggleRecoveryInput()\">{{'LOGIN'|translate}}</a>\n        </small>\n      </span>\n      <br>\n      <br>\n      <br>\n      <br>\n\n      <button *ngIf=\"!showRecoveryInput\" (click)=\"loginUser()\" mat-raised-button color=\"accent\" name=\"action\">{{'LOGIN'|translate}}</button>\n      <button [disabled]=\"user.newPassword!==user.confirmNewPassword\" *ngIf=\"showRecoveryInput\" (click)=\"resetPassword()\" mat-raised-button\n        color=\"accent\" name=\"action\">{{'RECOVER ACCOUNT'|translate}}</button>\n      <a class=\"register-link\" href=\"#/register\">{{'REGISTER'|translate}}</a>\n      <br>\n      <br>\n      <span id=\"err\">\n        <small>{{errorMessage}}</small>\n      </span>\n    </form>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/core/auth/login/login.component.ts":
/*!****************************************************!*\
  !*** ./src/app/core/auth/login/login.component.ts ***!
  \****************************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/_services/app-config.service */ "./src/app/shared/_services/app-config.service.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../_services/authentication.service */ "./src/app/core/auth/_services/authentication.service.ts");
/* harmony import */ var _shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/translation-marker */ "./src/app/shared/translation-marker.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







var LoginComponent = /** @class */ (function () {
    function LoginComponent(authenticationService, route, router, usersService, appConfigService) {
        this.authenticationService = authenticationService;
        this.route = route;
        this.router = router;
        this.usersService = usersService;
        this.appConfigService = appConfigService;
        this.errorMessage = '';
        this.user = { username: '', password: '' };
        this.users = [];
        this.showRecoveryInput = false;
    }
    LoginComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var appConfig, homeUrl, _a, isNoPasswordMode;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.appConfigService.getAppConfig()];
                    case 1:
                        appConfig = _b.sent();
                        homeUrl = appConfig.homeUrl;
                        this.securityQuestionText = appConfig.securityQuestionText;
                        this.listUsernamesOnLoginScreen = appConfig.listUsernamesOnLoginScreen;
                        if (!this.listUsernamesOnLoginScreen) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, this.usersService.getUsernames()];
                    case 2:
                        _a.allUsernames = _b.sent();
                        _b.label = 3;
                    case 3:
                        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || homeUrl;
                        isNoPasswordMode = this.authenticationService.isNoPasswordMode();
                        // TODO List users on login page
                        // Observable.fromPromise(this.usersService.getAllUsers()).subscribe(data => {
                        //   this.users = data;
                        // });
                        if (this.authenticationService.isLoggedIn() || isNoPasswordMode) {
                            this.router.navigate([this.returnUrl]);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginComponent.prototype.toggleRecoveryInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.showRecoveryInput = !this.showRecoveryInput;
                return [2 /*return*/];
            });
        });
    };
    LoginComponent.prototype.onSelectUsername = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.user.username = event.target.value;
                return [2 /*return*/];
            });
        });
    };
    LoginComponent.prototype.resetPassword = function () {
        var _this = this;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["from"])(this.authenticationService.resetPassword(this.user)).subscribe(function (data) {
            if (data) {
                _this.router.navigate([_this.returnUrl]);
            }
            else {
                _this.errorMessage = Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__["_TRANSLATE"])('Password Reset Unsuccesful');
            }
        }, function (error) {
            _this.errorMessage = Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__["_TRANSLATE"])('Password Reset Unsuccesful');
        });
    };
    LoginComponent.prototype.loginUser = function () {
        var _this = this;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["from"])(this.authenticationService.login(this.user.username, this.user.password)).subscribe(function (data) {
            if (data) {
                _this.router.navigate(['' + _this.returnUrl]);
            }
            else {
                _this.errorMessage = Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__["_TRANSLATE"])('Login Unsuccesful');
            }
        }, function (error) {
            _this.errorMessage = Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__["_TRANSLATE"])('Login Unsuccesful');
        });
    };
    LoginComponent.prototype.register = function () {
        this.router.navigate(['/register']);
    };
    LoginComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/core/auth/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/core/auth/login/login.component.css")]
        }),
        __metadata("design:paramtypes", [_services_authentication_service__WEBPACK_IMPORTED_MODULE_5__["AuthenticationService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services_user_service__WEBPACK_IMPORTED_MODULE_4__["UserService"],
            _shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_3__["AppConfigService"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/core/auth/registration/registration.component.css":
/*!*******************************************************************!*\
  !*** ./src/app/core/auth/registration/registration.component.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mat-title {\n    color: #3c5b8d;\n    font-size: 1.5em;\n    font-weight: 400;\n    font-family: Roboto, \"Helvetica Nue\", sans-serif;\n  }\n  \n  mat-placeholder i {\n    margin-right:.075em;\n  \n  }\n  \n  input.mat-input-element {\n    margin-top: 1em;\n  }\n  \n  .mat-placeholder-required.mat-form-field-required-marker.ng-tns-c6-2 .mat-form-field-invalid .mat-form-field-placeholder.mat-accent, .mat-form-field-invalid .mat-form-field-placeholder .mat-form-field-required-marker {\n  position:relative;\n    bottom: 1em !important;\n  }\n  \n  .mat-form-field {\n    width: 76%;\n  }\n  "

/***/ }),

/***/ "./src/app/core/auth/registration/registration.component.html":
/*!********************************************************************!*\
  !*** ./src/app/core/auth/registration/registration.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"login-app-content\">\n  <div class=\"group\">\n\n    <form role=\"form\" #registration='ngForm' novalidate (submit)=\"register()\">\n      <br>\n      <h3 class=\"mat-title\">{{'REGISTER'|translate}}</h3>\n      <mat-form-field>\n        <input name=\"username\" type=\"text\" matInput [(ngModel)]=\"user.username\" (blur)=\"doesUserExist(user.username)\" required>\n        <mat-placeholder>\n          <i class=\"material-icons app-input-icon\">face</i>{{'Username'|translate}}\n        </mat-placeholder>\n      </mat-form-field>\n      <br>\n      <mat-form-field>\n        <input name=\"password\" matInput [(ngModel)]=\"user.password\" type=\"password\" required>\n        <mat-placeholder>\n          <i class=\"material-icons app-input-icon\">lock_open</i>{{'Password'|translate}}\n        </mat-placeholder>\n      </mat-form-field>\n      <br>\n      <mat-form-field>\n        <input name=\"confirmPassword\" matInput [(ngModel)]=\"user.confirmPassword\" type=\"password\" required>\n        <mat-placeholder>\n          <i class=\"material-icons app-input-icon\">lock_open</i>{{'Confirm Password'|translate}}\n        </mat-placeholder>\n      </mat-form-field>\n      <br>\n      <mat-form-field>\n        <input name=\"securityQuestionResponse\" type=\"text\" matInput [(ngModel)]=\"user.securityQuestionResponse\" required>\n        <mat-placeholder>\n          <i class=\"material-icons app-input-icon\">security</i>{{securityQuestionText}}\n        </mat-placeholder>\n      </mat-form-field>\n      <br>\n      <button mat-raised-button color=\"accent\" type=\"submit\" [disabled]=\"registration.invalid||user.password!==user.confirmPassword\">{{'REGISTER'|translate}}</button>\n      <a href=\"#/login\">{{'LOGIN'|translate}}</a>\n      <span [id]=\"statusMessage.type\">\n        <small>{{statusMessage.message}}</small>\n      </span>\n    </form>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/core/auth/registration/registration.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/core/auth/registration/registration.component.ts ***!
  \******************************************************************/
/*! exports provided: RegistrationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegistrationComponent", function() { return RegistrationComponent; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/_services/app-config.service */ "./src/app/shared/_services/app-config.service.ts");
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_services/authentication.service */ "./src/app/core/auth/_services/authentication.service.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
/* harmony import */ var _shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/translation-marker */ "./src/app/shared/translation-marker.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







var RegistrationComponent = /** @class */ (function () {
    function RegistrationComponent(userService, authenticationService, route, router, appConfigService) {
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.route = route;
        this.router = router;
        this.appConfigService = appConfigService;
        this.user = {
            username: '',
            password: '',
            confirmPassword: '',
            securityQuestionResponse: '',
            hashSecurityQuestionResponse: true
        };
        this.userNameUnavailableMessage = { type: 'error', message: Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__["_TRANSLATE"])('Username Unavailable') };
        this.userNameAvailableMessage = { type: 'success', message: Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__["_TRANSLATE"])('Username Available') };
        this.loginUnsucessfulMessage = { type: 'error', message: Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__["_TRANSLATE"])('Login Unsuccesful') };
        this.couldNotCreateUserMessage = { type: 'error', message: Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__["_TRANSLATE"])('Could Not Create User') };
        this.statusMessage = { type: '', message: '' };
    }
    RegistrationComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var appConfig, homeUrl, isNoPasswordMode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.appConfigService.getAppConfig()];
                    case 1:
                        appConfig = _a.sent();
                        homeUrl = appConfig.homeUrl;
                        this.securityQuestionText = appConfig.securityQuestionText;
                        this.user.hashSecurityQuestionResponse = appConfig.hashSecurityQuestionResponse;
                        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || homeUrl;
                        return [4 /*yield*/, this.authenticationService.isNoPasswordMode()];
                    case 2:
                        isNoPasswordMode = _a.sent();
                        if (isNoPasswordMode) {
                        }
                        if (this.authenticationService.isLoggedIn() || isNoPasswordMode) {
                            this.router.navigate([this.returnUrl]);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RegistrationComponent.prototype.register = function () {
        var _this = this;
        delete this.user.confirmPassword;
        var userData = Object.assign({}, this.user);
        if (!this.isUsernameTaken) {
            Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["from"])(this.userService.create(userData)).subscribe(function (data) {
                _this.loginUserAfterRegistration(userData.username, _this.user.password);
            }, function (error) {
                console.log(error);
                _this.statusMessage = _this.couldNotCreateUserMessage;
            });
        }
        else {
            this.statusMessage = this.userNameUnavailableMessage;
        }
    };
    RegistrationComponent.prototype.doesUserExist = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.user.username = user.replace(/\s/g, ''); // Remove all whitespaces including spaces and tabs
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.userService.doesUserExist(user.replace(/\s/g, ''))];
                    case 2:
                        data = _a.sent();
                        this.isUsernameTaken = data;
                        this.isUsernameTaken ?
                            this.statusMessage = this.userNameUnavailableMessage :
                            this.statusMessage = this.userNameAvailableMessage;
                        return [2 /*return*/, this.isUsernameTaken];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RegistrationComponent.prototype.loginUserAfterRegistration = function (username, password) {
        var _this = this;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["from"])(this.authenticationService.login(username, password)).subscribe(function (data) {
            if (data) {
                _this.router.navigate(['' + '/manage-user-profile']);
            }
            else {
                _this.statusMessage = _this.loginUnsucessfulMessage;
            }
        }, function (error) {
            _this.statusMessage = _this.loginUnsucessfulMessage;
        });
    };
    RegistrationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-registration',
            template: __webpack_require__(/*! ./registration.component.html */ "./src/app/core/auth/registration/registration.component.html"),
            styles: [__webpack_require__(/*! ./registration.component.css */ "./src/app/core/auth/registration/registration.component.css")]
        }),
        __metadata("design:paramtypes", [_services_user_service__WEBPACK_IMPORTED_MODULE_5__["UserService"],
            _services_authentication_service__WEBPACK_IMPORTED_MODULE_4__["AuthenticationService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_3__["AppConfigService"]])
    ], RegistrationComponent);
    return RegistrationComponent;
}());



/***/ }),

/***/ "./src/app/core/export-data/export-data-routing.module.ts":
/*!****************************************************************!*\
  !*** ./src/app/core/export-data/export-data-routing.module.ts ***!
  \****************************************************************/
/*! exports provided: ExportDataRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExportDataRoutingModule", function() { return ExportDataRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _export_data_export_data_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./export-data/export-data.component */ "./src/app/core/export-data/export-data/export-data.component.ts");
/* harmony import */ var _auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../auth/_guards/login-guard.service */ "./src/app/core/auth/_guards/login-guard.service.ts");
/* harmony import */ var _user_profile_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../user-profile/create-profile-guard.service */ "./src/app/user-profile/create-profile-guard.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var routes = [{
        path: 'export-data',
        component: _export_data_export_data_component__WEBPACK_IMPORTED_MODULE_2__["ExportDataComponent"],
        canActivate: [_auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_3__["LoginGuard"], _user_profile_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_4__["CreateProfileGuardService"]]
    }];
var ExportDataRoutingModule = /** @class */ (function () {
    function ExportDataRoutingModule() {
    }
    ExportDataRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
            declarations: []
        })
    ], ExportDataRoutingModule);
    return ExportDataRoutingModule;
}());



/***/ }),

/***/ "./src/app/core/export-data/export-data.module.ts":
/*!********************************************************!*\
  !*** ./src/app/core/export-data/export-data.module.ts ***!
  \********************************************************/
/*! exports provided: ExportDataModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExportDataModule", function() { return ExportDataModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _export_data_export_data_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./export-data/export-data.component */ "./src/app/core/export-data/export-data/export-data.component.ts");
/* harmony import */ var _export_data_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./export-data-routing.module */ "./src/app/core/export-data/export-data-routing.module.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/shared.module */ "./src/app/shared/shared.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var ExportDataModule = /** @class */ (function () {
    function ExportDataModule() {
    }
    ExportDataModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _export_data_routing_module__WEBPACK_IMPORTED_MODULE_3__["ExportDataRoutingModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatButtonModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_5__["SharedModule"]
            ],
            declarations: [_export_data_export_data_component__WEBPACK_IMPORTED_MODULE_2__["ExportDataComponent"]]
        })
    ], ExportDataModule);
    return ExportDataModule;
}());



/***/ }),

/***/ "./src/app/core/export-data/export-data/export-data.component.css":
/*!************************************************************************!*\
  !*** ./src/app/core/export-data/export-data/export-data.component.css ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/core/export-data/export-data/export-data.component.html":
/*!*************************************************************************!*\
  !*** ./src/app/core/export-data/export-data/export-data.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<br>\n<br>\n<br>\n<button color=\"primary\" mat-raised-button (click)=\"exportAllRecords()\">{{'EXPORT DATA FOR ALL USERS'|translate}}</button>"

/***/ }),

/***/ "./src/app/core/export-data/export-data/export-data.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/core/export-data/export-data/export-data.component.ts ***!
  \***********************************************************************/
/*! exports provided: ExportDataComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExportDataComponent", function() { return ExportDataComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _auth_services_user_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../auth/_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
/* harmony import */ var _sync_records_services_syncing_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../sync-records/_services/syncing.service */ "./src/app/core/sync-records/_services/syncing.service.ts");
/* harmony import */ var _shared_translation_marker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../shared/translation-marker */ "./src/app/shared/translation-marker.ts");
/* harmony import */ var _core_window_ref_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../core/window-ref.service */ "./src/app/core/window-ref.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var ExportDataComponent = /** @class */ (function () {
    function ExportDataComponent(windowRef, userService, syncingService) {
        this.windowRef = windowRef;
        this.userService = userService;
        this.syncingService = syncingService;
        this.window = this.windowRef.nativeWindow;
    }
    ExportDataComponent.prototype.ngOnInit = function () {
    };
    ExportDataComponent.prototype.exportAllRecords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var usernames, data, file, currentUser, now, fileName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUsernames()];
                    case 1:
                        usernames = _a.sent();
                        return [4 /*yield*/, Promise.all(usernames.map(function (databaseName) { return __awaiter(_this, void 0, void 0, function () {
                                var docs;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.syncingService.getAllUsersDocs(databaseName)];
                                        case 1:
                                            docs = _a.sent();
                                            return [2 /*return*/, {
                                                    databaseName: databaseName,
                                                    docs: docs
                                                }];
                                    }
                                });
                            }); }))];
                    case 2:
                        data = _a.sent();
                        file = new Blob([JSON.stringify(data)], { type: 'application/json' });
                        return [4 /*yield*/, localStorage.getItem('currentUser')];
                    case 3:
                        currentUser = _a.sent();
                        now = new Date();
                        fileName = currentUser + "-" + now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + "-" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds() + ".json";
                        if (this.window.isCordovaApp) {
                            document.addEventListener('deviceready', function () {
                                _this.window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (directoryEntry) {
                                    directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                                        fileEntry.createWriter(function (fileWriter) {
                                            fileWriter.onwriteend = function (data) {
                                                alert(Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_3__["_TRANSLATE"])('File Stored At') + " " + cordova.file.externalDataDirectory + fileName);
                                            };
                                            fileWriter.onerror = function (e) {
                                                alert("" + Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_3__["_TRANSLATE"])('Write Failed') + e.toString());
                                            };
                                            fileWriter.write(file);
                                        });
                                    });
                                });
                            }, false);
                        }
                        else {
                            downloadData(file, fileName, 'application/json');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ExportDataComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-export-data',
            template: __webpack_require__(/*! ./export-data.component.html */ "./src/app/core/export-data/export-data/export-data.component.html"),
            styles: [__webpack_require__(/*! ./export-data.component.css */ "./src/app/core/export-data/export-data/export-data.component.css")]
        }),
        __metadata("design:paramtypes", [_core_window_ref_service__WEBPACK_IMPORTED_MODULE_4__["WindowRef"], _auth_services_user_service__WEBPACK_IMPORTED_MODULE_1__["UserService"], _sync_records_services_syncing_service__WEBPACK_IMPORTED_MODULE_2__["SyncingService"]])
    ], ExportDataComponent);
    return ExportDataComponent;
}());

function downloadData(content, fileName, type) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = fileName;
    a.click();
}


/***/ }),

/***/ "./src/app/core/location.service.ts":
/*!******************************************!*\
  !*** ./src/app/core/location.service.ts ***!
  \******************************************/
/*! exports provided: Loc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Loc", function() { return Loc; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var Loc = /** @class */ (function () {
    function Loc() {
    }
    Loc.prototype.query = function (levels, criteria, locationList) {
        var currentLevelIndex, i, j, len, level, levelIDs, levelMap, locationLevels, locations, targetLevelIndex;
        if (criteria == null) {
            criteria = {};
        }
        locations = locationList.locations;
        locationLevels = locationList.locationsLevels;
        targetLevelIndex = 0;
        levelIDs = [];
        levelMap = [];
        for (i = j = 0, len = locationLevels.length; j < len; i = ++j) {
            level = locationLevels[i];
            if (levels.indexOf(function (aLevel) { return aLevel === level; }) === -1) {
                levelMap[i] = null;
            }
            else {
                levelMap[i] = level;
            }
        }
        // currentLevelIndex = this.getCurrentLevelIndex(levels, criteria, levelMap);
        // return this._query(0, currentLevelIndex, locations, levelMap, criteria);
        return this._query(0, 2, locations, levels, criteria);
    };
    Loc.prototype._query = function (depth, targetDepth, data, levelMap, criteria) {
        var allChildren, i, j, len, levelData, v;
        if (depth === targetDepth) {
            return data.map(function (obj) {
                return {
                    id: obj.id,
                    label: obj.label
                };
            });
        }
        if ((levelMap[depth] != null) && (depth < targetDepth)) {
            if (criteria[levelMap[depth]] && data[criteria[levelMap[depth]]] && data[criteria[levelMap[depth]]].hasOwnProperty('children')) {
                return this._query(depth + 1, targetDepth, data[criteria[levelMap[depth]]].children, levelMap, criteria);
            }
        }
        if ((levelMap[depth] == null) && (depth < targetDepth)) {
            levelData = {};
            allChildren = data.map(function (loc) {
                return loc.children;
            });
            for (i = j = 0, len = allChildren.length; j < len; i = ++j) {
                v = allChildren[i];
                Object.assign(levelData, v);
            }
            return this._query(depth + 1, targetDepth, levelData, levelMap, criteria);
        }
        return {};
    };
    Loc.prototype.getCurrentLevelIndex = function (levels, criteria, levelMap) {
        var i, j, len, level;
        for (i = j = 0, len = levels.length; j < len; i = ++j) {
            level = levels[i];
            if (criteria[level] == null) {
                return levelMap.indexOf(level);
            }
        }
        return levelMap.indexOf((function (levelItem) { return levelItem === levels[levels.length - 1]; }));
    };
    Loc = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], Loc);
    return Loc;
}());



/***/ }),

/***/ "./src/app/core/sync-records/_services/syncing.service.ts":
/*!****************************************************************!*\
  !*** ./src/app/core/sync-records/_services/syncing.service.ts ***!
  \****************************************************************/
/*! exports provided: SyncingService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SyncingService", function() { return SyncingService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var pouchdb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pouchdb */ "./node_modules/pouchdb/lib/index-browser.es.js");
/* harmony import */ var pouchdb_upsert__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! pouchdb-upsert */ "./node_modules/pouchdb-upsert/index.js");
/* harmony import */ var pouchdb_upsert__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(pouchdb_upsert__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var pako__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! pako */ "./node_modules/pako/index.js");
/* harmony import */ var pako__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(pako__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/_services/app-config.service */ "./src/app/shared/_services/app-config.service.ts");
/* harmony import */ var _auth_services_user_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../auth/_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







var SyncingService = /** @class */ (function () {
    function SyncingService(appConfigService, http, userService) {
        this.appConfigService = appConfigService;
        this.http = http;
        this.userService = userService;
    }
    SyncingService.prototype.getLoggedInUser = function () {
        return localStorage.getItem('currentUser');
    };
    SyncingService.prototype.getRemoteHost = function () {
        return __awaiter(this, void 0, void 0, function () {
            var appConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.appConfigService.getAppConfig()];
                    case 1:
                        appConfig = _a.sent();
                        return [2 /*return*/, appConfig.uploadUrl];
                }
            });
        });
    };
    SyncingService.prototype.pushAllrecords = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var userProfile, remoteHost, DB, doc_ids, _i, doc_ids_1, doc_id, doc, body, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, this.userService.getUserProfile(username)];
                    case 1:
                        userProfile = _a.sent();
                        return [4 /*yield*/, this.getRemoteHost()];
                    case 2:
                        remoteHost = _a.sent();
                        DB = new pouchdb__WEBPACK_IMPORTED_MODULE_2__["default"](username);
                        return [4 /*yield*/, this.getIDsFormsLockedAndNotUploaded(username)];
                    case 3:
                        doc_ids = _a.sent();
                        if (!(doc_ids && doc_ids.length > 0)) return [3 /*break*/, 10];
                        _i = 0, doc_ids_1 = doc_ids;
                        _a.label = 4;
                    case 4:
                        if (!(_i < doc_ids_1.length)) return [3 /*break*/, 9];
                        doc_id = doc_ids_1[_i];
                        return [4 /*yield*/, DB.get(doc_id)];
                    case 5:
                        doc = _a.sent();
                        doc['items'][0]['inputs'].push({ name: 'userProfileId', value: userProfile._id });
                        doc['items'].forEach(function (item) {
                            item['inputs'].forEach(function (input) {
                                if (input.private) {
                                    input.value = '';
                                }
                            });
                        });
                        body = pako__WEBPACK_IMPORTED_MODULE_4__["deflate"](JSON.stringify({ doc: doc }), { to: 'string' });
                        return [4 /*yield*/, this.http.post(remoteHost, body).toPromise()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.markDocsAsUploaded([doc_id], username)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 4];
                    case 9: return [2 /*return*/, true]; // Sync Successful
                    case 10: return [2 /*return*/, false]; // No Items to Sync
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        error_1 = _a.sent();
                        throw (error_1);
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SyncingService.prototype.getIDsFormsLockedAndNotUploaded = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var userDB, _a, DB, results, docIds;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = username;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getLoggedInUser()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        userDB = _a;
                        DB = new pouchdb__WEBPACK_IMPORTED_MODULE_2__["default"](userDB);
                        return [4 /*yield*/, DB.query('tangy-form/responsesLockedAndNotUploaded')];
                    case 3:
                        results = _b.sent();
                        docIds = results.rows.map(function (row) { return row.key; });
                        return [2 /*return*/, docIds];
                }
            });
        });
    };
    SyncingService.prototype.getFormsLockedAndUploaded = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var userDB, _a, DB, results;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = username;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getLoggedInUser()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        userDB = _a;
                        DB = new pouchdb__WEBPACK_IMPORTED_MODULE_2__["default"](userDB);
                        return [4 /*yield*/, DB.query('tangy-form/responsesLockedAndUploaded')];
                    case 3:
                        results = _b.sent();
                        return [2 /*return*/, results.rows];
                }
            });
        });
    };
    SyncingService.prototype.getNumberOfFormsLockedAndUploaded = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!username) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getFormsLockedAndUploaded(username)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.getFormsLockedAndUploaded()];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        result = _a;
                        return [2 /*return*/, result.length || 0];
                }
            });
        });
    };
    SyncingService.prototype.getAllUsersDocs = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var userDB, _a, DB, result, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = username;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getLoggedInUser()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        userDB = _a;
                        DB = new pouchdb__WEBPACK_IMPORTED_MODULE_2__["default"](userDB);
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, DB.allDocs({
                                include_docs: true,
                                attachments: true
                            })];
                    case 4:
                        result = _b.sent();
                        return [2 /*return*/, result];
                    case 5:
                        err_1 = _b.sent();
                        console.log(err_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SyncingService.prototype.markDocsAsUploaded = function (replicatedDocIds, username) {
        return __awaiter(this, void 0, void 0, function () {
            var userDB, DB;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pouchdb__WEBPACK_IMPORTED_MODULE_2__["default"].plugin(pouchdb_upsert__WEBPACK_IMPORTED_MODULE_3__);
                        userDB = username;
                        DB = new pouchdb__WEBPACK_IMPORTED_MODULE_2__["default"](userDB);
                        return [4 /*yield*/, Promise.all(replicatedDocIds.map(function (docId) {
                                DB.upsert(docId, function (doc) {
                                    doc.uploadDatetime = new Date();
                                    return doc;
                                });
                            }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SyncingService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_5__["AppConfigService"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"],
            _auth_services_user_service__WEBPACK_IMPORTED_MODULE_6__["UserService"]])
    ], SyncingService);
    return SyncingService;
}());



/***/ }),

/***/ "./src/app/core/sync-records/sync-records-routing.module.ts":
/*!******************************************************************!*\
  !*** ./src/app/core/sync-records/sync-records-routing.module.ts ***!
  \******************************************************************/
/*! exports provided: SyncRecodsRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SyncRecodsRoutingModule", function() { return SyncRecodsRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _user_profile_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../user-profile/create-profile-guard.service */ "./src/app/user-profile/create-profile-guard.service.ts");
/* harmony import */ var _auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../auth/_guards/login-guard.service */ "./src/app/core/auth/_guards/login-guard.service.ts");
/* harmony import */ var _sync_records_sync_records_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sync-records/sync-records.component */ "./src/app/core/sync-records/sync-records/sync-records.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var routes = [{
        path: 'sync-records',
        component: _sync_records_sync_records_component__WEBPACK_IMPORTED_MODULE_4__["SyncRecordsComponent"],
        canActivate: [_auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_3__["LoginGuard"], _user_profile_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_2__["CreateProfileGuardService"]]
    }];
var SyncRecodsRoutingModule = /** @class */ (function () {
    function SyncRecodsRoutingModule() {
    }
    SyncRecodsRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
            declarations: []
        })
    ], SyncRecodsRoutingModule);
    return SyncRecodsRoutingModule;
}());



/***/ }),

/***/ "./src/app/core/sync-records/sync-records.module.ts":
/*!**********************************************************!*\
  !*** ./src/app/core/sync-records/sync-records.module.ts ***!
  \**********************************************************/
/*! exports provided: SyncRecordsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SyncRecordsModule", function() { return SyncRecordsModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/expansion */ "./node_modules/@angular/material/esm5/expansion.es5.js");
/* harmony import */ var _services_syncing_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_services/syncing.service */ "./src/app/core/sync-records/_services/syncing.service.ts");
/* harmony import */ var _sync_records_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./sync-records-routing.module */ "./src/app/core/sync-records/sync-records-routing.module.ts");
/* harmony import */ var _sync_records_sync_records_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./sync-records/sync-records.component */ "./src/app/core/sync-records/sync-records/sync-records.component.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/shared.module */ "./src/app/shared/shared.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










var SyncRecordsModule = /** @class */ (function () {
    function SyncRecordsModule() {
    }
    SyncRecordsModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"],
                _sync_records_routing_module__WEBPACK_IMPORTED_MODULE_7__["SyncRecodsRoutingModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatCardModule"],
                _angular_material_expansion__WEBPACK_IMPORTED_MODULE_5__["MatExpansionModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_9__["SharedModule"]
            ],
            declarations: [_sync_records_sync_records_component__WEBPACK_IMPORTED_MODULE_8__["SyncRecordsComponent"]],
            providers: [_services_syncing_service__WEBPACK_IMPORTED_MODULE_6__["SyncingService"], _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClientModule"]],
        })
    ], SyncRecordsModule);
    return SyncRecordsModule;
}());



/***/ }),

/***/ "./src/app/core/sync-records/sync-records/sync-records.component.css":
/*!***************************************************************************!*\
  !*** ./src/app/core/sync-records/sync-records/sync-records.component.css ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/core/sync-records/sync-records/sync-records.component.html":
/*!****************************************************************************!*\
  !*** ./src/app/core/sync-records/sync-records/sync-records.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<br>\n<br>\n<mat-card>\n    <mat-card-content>\n        <p class=\"mat-headline\">{{'Syncing Status Summary'|translate}}</p>\n        <span *ngIf=\"isSyncSuccesful\">{{'Sync Successful'|translate}}</span>\n        <span *ngIf=\"!isSyncSuccesful&&isSyncSuccesful!==undefined\">{{'Sync Unsuccessful. Please Retry'|translate}}</span>\n        <br/>\n        <br>\n        <p>{{'Last Successful Sync Timestamp'|translate}}:</p>\n        <p>{{'Total Docs Uploaded'|translate}} {{docsUploaded}}</p>\n        <p>{{'Total Docs not Uploaded'|translate}} {{docsNotUploaded}}</p>\n        <p>{{'Total Percentage Complete'|translate}} {{syncPercentageComplete|number:'1.2-2'}}%</p>\n    </mat-card-content>\n    <mat-card-actions>\n        <button color=\"primary\" mat-raised-button (click)=\"pushAllRecords()\">{{'SYNC DATA FOR ALL USERS'|translate}}</button>\n    </mat-card-actions>\n</mat-card>\n<br>\n<br>\n<p class=\"mat-headline\">{{'Syncing Status By User'|translate}}</p>\n<mat-accordion>\n    <mat-expansion-panel *ngFor=\"let syncData of allUsersSyncData\">\n        <mat-expansion-panel-header>\n            {{'Username'|translate}}: {{syncData.username}}\n        </mat-expansion-panel-header>\n\n        <p>{{'Docs Uploaded'|translate}} {{syncData.docsUploaded}}</p>\n        <p>{{'Docs Not Uploaded'|translate}} {{syncData.docsNotUploaded}}</p>\n        <p>{{'Percentage Complete'|translate}}: {{syncData.syncPercentageComplete|number:'1.2-2'}}%</p>\n\n    </mat-expansion-panel>\n\n</mat-accordion>"

/***/ }),

/***/ "./src/app/core/sync-records/sync-records/sync-records.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/core/sync-records/sync-records/sync-records.component.ts ***!
  \**************************************************************************/
/*! exports provided: SyncRecordsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SyncRecordsComponent", function() { return SyncRecordsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_syncing_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_services/syncing.service */ "./src/app/core/sync-records/_services/syncing.service.ts");
/* harmony import */ var _auth_services_user_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../auth/_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var SyncRecordsComponent = /** @class */ (function () {
    function SyncRecordsComponent(syncingService, userService) {
        this.syncingService = syncingService;
        this.userService = userService;
        this.isSyncSuccesful = undefined;
        this.syncStatus = '';
    }
    SyncRecordsComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.getUploadProgress();
                return [2 /*return*/];
            });
        });
    };
    SyncRecordsComponent.prototype.getUploadProgress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var usernames, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.userService.getUsernames()];
                    case 1:
                        usernames = _b.sent();
                        _a = this;
                        return [4 /*yield*/, Promise.all(usernames.map(function (username) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.calculateUsersUploadProgress(username)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.allUsersSyncData = _b.sent();
                        this.docsNotUploaded = this.allUsersSyncData.reduce(function (acc, val) { return acc + val.docsNotUploaded; }, 0);
                        this.docsUploaded = this.allUsersSyncData.reduce(function (acc, val) { return acc + val.docsUploaded; }, 0);
                        this.syncPercentageComplete =
                            ((this.docsUploaded / (this.docsNotUploaded + this.docsUploaded)) * 100) || 0;
                        return [2 /*return*/];
                }
            });
        });
    };
    SyncRecordsComponent.prototype.calculateUsersUploadProgress = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var result, docsNotUploaded, docsUploaded, syncPercentageComplete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.syncingService.getIDsFormsLockedAndNotUploaded(username)];
                    case 1:
                        result = _a.sent();
                        docsNotUploaded = result ? result.length : 0;
                        return [4 /*yield*/, this.syncingService.getNumberOfFormsLockedAndUploaded(username)];
                    case 2:
                        docsUploaded = _a.sent();
                        syncPercentageComplete = ((docsUploaded / (docsNotUploaded + docsUploaded)) * 100) || 0;
                        return [2 /*return*/, {
                                username: username,
                                docsNotUploaded: docsNotUploaded,
                                docsUploaded: docsUploaded,
                                syncPercentageComplete: syncPercentageComplete
                            }];
                }
            });
        });
    };
    SyncRecordsComponent.prototype.pushAllRecords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var usernames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isSyncSuccesful = undefined;
                        return [4 /*yield*/, this.userService.getUsernames()];
                    case 1:
                        usernames = _a.sent();
                        usernames.map(function (username) { return __awaiter(_this, void 0, void 0, function () {
                            var result, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, this.syncingService.pushAllrecords(username)];
                                    case 1:
                                        result = _a.sent();
                                        if (result) {
                                            this.isSyncSuccesful = true;
                                            this.getUploadProgress();
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_1 = _a.sent();
                                        console.error(error_1);
                                        this.isSyncSuccesful = false;
                                        this.getUploadProgress();
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    SyncRecordsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-sync-records',
            template: __webpack_require__(/*! ./sync-records.component.html */ "./src/app/core/sync-records/sync-records/sync-records.component.html"),
            styles: [__webpack_require__(/*! ./sync-records.component.css */ "./src/app/core/sync-records/sync-records/sync-records.component.css")]
        }),
        __metadata("design:paramtypes", [_services_syncing_service__WEBPACK_IMPORTED_MODULE_1__["SyncingService"],
            _auth_services_user_service__WEBPACK_IMPORTED_MODULE_2__["UserService"]])
    ], SyncRecordsComponent);
    return SyncRecordsComponent;
}());



/***/ }),

/***/ "./src/app/core/update/update-routing.module.ts":
/*!******************************************************!*\
  !*** ./src/app/core/update/update-routing.module.ts ***!
  \******************************************************/
/*! exports provided: UpdateRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateRoutingModule", function() { return UpdateRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _update_update_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./update/update.component */ "./src/app/core/update/update/update.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var routes = [
    {
        path: 'update',
        component: _update_update_component__WEBPACK_IMPORTED_MODULE_2__["UpdateComponent"]
    }
];
var UpdateRoutingModule = /** @class */ (function () {
    function UpdateRoutingModule() {
    }
    UpdateRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], UpdateRoutingModule);
    return UpdateRoutingModule;
}());



/***/ }),

/***/ "./src/app/core/update/update.module.ts":
/*!**********************************************!*\
  !*** ./src/app/core/update/update.module.ts ***!
  \**********************************************/
/*! exports provided: UpdateModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateModule", function() { return UpdateModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _update_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./update-routing.module */ "./src/app/core/update/update-routing.module.ts");
/* harmony import */ var _update_update_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./update/update.component */ "./src/app/core/update/update/update.component.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/shared.module */ "./src/app/shared/shared.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var UpdateModule = /** @class */ (function () {
    function UpdateModule() {
    }
    UpdateModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _update_routing_module__WEBPACK_IMPORTED_MODULE_2__["UpdateRoutingModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_4__["SharedModule"]
            ],
            declarations: [_update_update_component__WEBPACK_IMPORTED_MODULE_3__["UpdateComponent"]]
        })
    ], UpdateModule);
    return UpdateModule;
}());



/***/ }),

/***/ "./src/app/core/update/update/update.component.css":
/*!*********************************************************!*\
  !*** ./src/app/core/update/update/update.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/core/update/update/update.component.html":
/*!**********************************************************!*\
  !*** ./src/app/core/update/update/update.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<br>\n<br>\n\n<h1>\n  {{message}}\n</h1>\n<h1 *ngIf=\"needsUpdating\">\n  {{'Total Updates Applied'|translate}} {{totalUpdatesApplied}}\n</h1>"

/***/ }),

/***/ "./src/app/core/update/update/update.component.ts":
/*!********************************************************!*\
  !*** ./src/app/core/update/update/update.component.ts ***!
  \********************************************************/
/*! exports provided: UpdateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UpdateComponent", function() { return UpdateComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _window_ref_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../window-ref.service */ "./src/app/core/window-ref.service.ts");
/* harmony import */ var _tangy_forms_tangy_form_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../tangy-forms/tangy-form-service */ "./src/app/tangy-forms/tangy-form-service.ts");
/* harmony import */ var _updates__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./updates */ "./src/app/core/update/update/updates.ts");
/* harmony import */ var pouchdb__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! pouchdb */ "./node_modules/pouchdb/lib/index-browser.es.js");
/* harmony import */ var _auth_services_user_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../auth/_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
/* harmony import */ var _shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/translation-marker */ "./src/app/shared/translation-marker.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







var UpdateComponent = /** @class */ (function () {
    function UpdateComponent(windowRef, userService) {
        this.windowRef = windowRef;
        this.userService = userService;
        this.message = Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__["_TRANSLATE"])('Checking For Updates...');
        this.totalUpdatesApplied = 0;
        this.needsUpdating = false;
    }
    UpdateComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var window, usernames, _i, usernames_1, username, userDb, infoDoc, e_1, atUpdateIndex, lastUpdateIndex, requiresViewsRefresh, tangyFormService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window = this.windowRef.nativeWindow;
                        return [4 /*yield*/, this.userService.getUsernames()];
                    case 1:
                        usernames = _a.sent();
                        _i = 0, usernames_1 = usernames;
                        _a.label = 2;
                    case 2:
                        if (!(_i < usernames_1.length)) return [3 /*break*/, 17];
                        username = usernames_1[_i];
                        return [4 /*yield*/, new pouchdb__WEBPACK_IMPORTED_MODULE_4__["default"](username)];
                    case 3:
                        userDb = _a.sent();
                        infoDoc = { _id: '', atUpdateIndex: 0 };
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 9]);
                        return [4 /*yield*/, userDb.get('info')];
                    case 5:
                        infoDoc = _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        e_1 = _a.sent();
                        return [4 /*yield*/, userDb.put({ _id: 'info', atUpdateIndex: 0 })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, userDb.get('info')];
                    case 8:
                        infoDoc = _a.sent();
                        return [3 /*break*/, 9];
                    case 9:
                        atUpdateIndex = infoDoc.hasOwnProperty('atUpdateIndex') ? infoDoc.atUpdateIndex : 0;
                        lastUpdateIndex = _updates__WEBPACK_IMPORTED_MODULE_3__["updates"].length - 1;
                        if (!(lastUpdateIndex !== atUpdateIndex)) return [3 /*break*/, 16];
                        this.needsUpdating = true;
                        this.message = Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__["_TRANSLATE"])('Applying Updates...');
                        requiresViewsRefresh = false;
                        _a.label = 10;
                    case 10:
                        if (!(lastUpdateIndex >= atUpdateIndex)) return [3 /*break*/, 12];
                        if (_updates__WEBPACK_IMPORTED_MODULE_3__["updates"][atUpdateIndex].requiresViewsUpdate) {
                            requiresViewsRefresh = true;
                        }
                        return [4 /*yield*/, _updates__WEBPACK_IMPORTED_MODULE_3__["updates"][atUpdateIndex].script(userDb)];
                    case 11:
                        _a.sent();
                        this.totalUpdatesApplied++;
                        atUpdateIndex++;
                        return [3 /*break*/, 10];
                    case 12:
                        atUpdateIndex--;
                        if (!requiresViewsRefresh) return [3 /*break*/, 14];
                        tangyFormService = new _tangy_forms_tangy_form_service__WEBPACK_IMPORTED_MODULE_2__["TangyFormService"](username);
                        return [4 /*yield*/, tangyFormService.initialize()];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        infoDoc.atUpdateIndex = atUpdateIndex;
                        return [4 /*yield*/, userDb.put(infoDoc)];
                    case 15:
                        _a.sent();
                        _a.label = 16;
                    case 16:
                        _i++;
                        return [3 /*break*/, 2];
                    case 17:
                        this.message = Object(_shared_translation_marker__WEBPACK_IMPORTED_MODULE_6__["_TRANSLATE"])('✓ Yay! You are up to date.');
                        return [2 /*return*/];
                }
            });
        });
    };
    UpdateComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-update',
            template: __webpack_require__(/*! ./update.component.html */ "./src/app/core/update/update/update.component.html"),
            styles: [__webpack_require__(/*! ./update.component.css */ "./src/app/core/update/update/update.component.css")]
        }),
        __metadata("design:paramtypes", [_window_ref_service__WEBPACK_IMPORTED_MODULE_1__["WindowRef"],
            _auth_services_user_service__WEBPACK_IMPORTED_MODULE_5__["UserService"]])
    ], UpdateComponent);
    return UpdateComponent;
}());



/***/ }),

/***/ "./src/app/core/update/update/updates.ts":
/*!***********************************************!*\
  !*** ./src/app/core/update/update/updates.ts ***!
  \***********************************************/
/*! exports provided: updates */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updates", function() { return updates; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = undefined;
var updates = [
    {
        requiresViewsUpdate: true,
        script: function (userDb) {
            return new Promise(function (resolve) {
                console.log("This update will never run :-).");
                resolve();
            });
        }
    },
    // Transform array style input.value from ['foo', 'bar'] to [{name: 'foo', value: 'on'}, {name: 'bar', value: 'on'}]
    {
        requiresViewsUpdate: false,
        script: function (userDb) {
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var res, responseDocs, _i, responseDocs_1, responseDoc, _loop_1, _a, _b, input;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, userDb.allDocs({ include_docs: true })];
                        case 1:
                            res = _c.sent();
                            responseDocs = res.rows
                                .map(function (row) { return row.doc; })
                                .filter(function (doc) {
                                if (doc.hasOwnProperty('collection') && doc.collection === 'TangyFormResponse') {
                                    return doc;
                                }
                            });
                            _i = 0, responseDocs_1 = responseDocs;
                            _c.label = 2;
                        case 2:
                            if (!(_i < responseDocs_1.length)) return [3 /*break*/, 5];
                            responseDoc = responseDocs_1[_i];
                            _loop_1 = function (input) {
                                if (input['tagName'] === 'TANGY-LOCATION') {
                                    if (input['value'] && Array.isArray(input['value'])) {
                                        var newValue_1 = [];
                                        input['value'].forEach(function (subInput) { return newValue_1.push({ name: subInput['level'], value: subInput['value'] }); });
                                        input['value'] = newValue_1;
                                    }
                                    else {
                                        input['value'] = [];
                                    }
                                }
                                if (input['tagName'] === 'TANGY-GPS') {
                                    if (input['value']) {
                                        var newValue = [];
                                        if (input['value']['recordedLatitude']) {
                                            newValue.push({ name: 'recordedLatitude', value: input['value']['recordedLatitude'] });
                                        }
                                        if (input['value']['recordedLongitude']) {
                                            newValue.push({ name: 'recordedLongitude', value: input['value']['recordedLongitude'] });
                                        }
                                        if (input['value']['recordedAccuracy']) {
                                            newValue.push({ name: 'recordedAccuracy', value: input['value']['recordedAccuracy'] });
                                        }
                                        input['value'] = newValue;
                                    }
                                    else {
                                        input['value'] = [];
                                    }
                                }
                                if (input['tagName'] === 'TANGY-RADIO-BUTTONS') {
                                    if (input['value']) {
                                        var newValue = [];
                                        newValue.push({ name: input['value'], value: 'on' });
                                        input['value'] = newValue;
                                    }
                                    else {
                                        input['value'] = [];
                                    }
                                }
                                if (input['tagName'] === 'TANGY-CHECKBOXES' || input['tagName'] === 'TANGY-TIMED') {
                                    var newValue_2 = [];
                                    if (Array.isArray(input['value'])) {
                                        input['value'].forEach(function (subinputName) { return newValue_2.push({ name: subinputName, value: 'on' }); });
                                        input['value'] = newValue_2;
                                    }
                                    else {
                                        input['value'] = [];
                                    }
                                }
                            };
                            for (_a = 0, _b = responseDoc['inputs']; _a < _b.length; _a++) {
                                input = _b[_a];
                                _loop_1(input);
                            }
                            return [4 /*yield*/, userDb.put(responseDoc)];
                        case 3:
                            _c.sent();
                            _c.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5:
                            resolve();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    },
    // Move inputs from TangyFormResponse.inputs to TangyFormResponse.items[index].inputs.
    {
        requiresViewsUpdate: false,
        script: function (userDb) {
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var res, responseDocs, _loop_2, _i, responseDocs_2, responseDoc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, userDb.allDocs({ include_docs: true })];
                        case 1:
                            res = _a.sent();
                            responseDocs = res.rows
                                .map(function (row) { return row.doc; })
                                .filter(function (doc) {
                                if (doc.hasOwnProperty('collection') && doc.collection === 'TangyFormResponse') {
                                    return doc;
                                }
                            });
                            _loop_2 = function (responseDoc) {
                                var _loop_3, _i, _a, item;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _loop_3 = function (item) {
                                                if (item['inputs'] && Array.isArray(item['inputs'])) {
                                                    item['inputs'].forEach(function (inputName, itemInputIndex) {
                                                        if (typeof inputName === 'string') {
                                                            var input = responseDoc['inputs'].find(function (input) { return (inputName === input['name']); });
                                                            if (input) {
                                                                item['inputs'][itemInputIndex] = Object.assign({}, input);
                                                            }
                                                        }
                                                    });
                                                }
                                            };
                                            for (_i = 0, _a = responseDoc['items']; _i < _a.length; _i++) {
                                                item = _a[_i];
                                                _loop_3(item);
                                            }
                                            return [4 /*yield*/, userDb.put(responseDoc)];
                                        case 1:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            _i = 0, responseDocs_2 = responseDocs;
                            _a.label = 2;
                        case 2:
                            if (!(_i < responseDocs_2.length)) return [3 /*break*/, 5];
                            responseDoc = responseDocs_2[_i];
                            return [5 /*yield**/, _loop_2(responseDoc)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5:
                            resolve();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    },
    {
        requiresViewsUpdate: true,
        script: function (userDb) {
            console.log('Updating views...');
        }
    },
    {
        requiresViewsUpdate: true,
        script: function (userDb) {
            console.log('Updating views...');
        }
    }
];


/***/ }),

/***/ "./src/app/core/window-ref.service.ts":
/*!********************************************!*\
  !*** ./src/app/core/window-ref.service.ts ***!
  \********************************************/
/*! exports provided: WindowRef */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WindowRef", function() { return WindowRef; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

function _window() {
    // return the global native browser window object
    var foo = window;
    return foo;
}
var WindowRef = /** @class */ (function () {
    function WindowRef() {
    }
    Object.defineProperty(WindowRef.prototype, "nativeWindow", {
        get: function () {
            return _window();
        },
        enumerable: true,
        configurable: true
    });
    WindowRef = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], WindowRef);
    return WindowRef;
}());



/***/ }),

/***/ "./src/app/shared/_components/redirect-to-default-route/redirect-to-default-route.component.css":
/*!******************************************************************************************************!*\
  !*** ./src/app/shared/_components/redirect-to-default-route/redirect-to-default-route.component.css ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/shared/_components/redirect-to-default-route/redirect-to-default-route.component.html":
/*!*******************************************************************************************************!*\
  !*** ./src/app/shared/_components/redirect-to-default-route/redirect-to-default-route.component.html ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n\n</p>"

/***/ }),

/***/ "./src/app/shared/_components/redirect-to-default-route/redirect-to-default-route.component.ts":
/*!*****************************************************************************************************!*\
  !*** ./src/app/shared/_components/redirect-to-default-route/redirect-to-default-route.component.ts ***!
  \*****************************************************************************************************/
/*! exports provided: RedirectToDefaultRouteComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RedirectToDefaultRouteComponent", function() { return RedirectToDefaultRouteComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_app_config_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../_services/app-config.service */ "./src/app/shared/_services/app-config.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var RedirectToDefaultRouteComponent = /** @class */ (function () {
    function RedirectToDefaultRouteComponent(router, appConfigService, activatedRoute) {
        this.router = router;
        this.appConfigService = appConfigService;
        this.activatedRoute = activatedRoute;
    }
    RedirectToDefaultRouteComponent.prototype.ngOnInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var defaultUrl, home_url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultUrl = '/forms-list';
                        return [4 /*yield*/, this.appConfigService.getDefaultURL()];
                    case 1:
                        home_url = _a.sent();
                        this.router.navigate([home_url]).then(function (data) {
                            /**
                             * When the user has supplied a route that cannot be matched from the
                             * app-config.json redirect the user to the default url
                             * It checks if the  current route after the  first router.navigate
                             * call is still the register route and redirects to the default url
                             */
                            if (_this.router.url === '/redirect') {
                                _this.router.navigate([defaultUrl]);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    RedirectToDefaultRouteComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-redirect-to-default-route',
            template: __webpack_require__(/*! ./redirect-to-default-route.component.html */ "./src/app/shared/_components/redirect-to-default-route/redirect-to-default-route.component.html"),
            styles: [__webpack_require__(/*! ./redirect-to-default-route.component.css */ "./src/app/shared/_components/redirect-to-default-route/redirect-to-default-route.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _services_app_config_service__WEBPACK_IMPORTED_MODULE_2__["AppConfigService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"]])
    ], RedirectToDefaultRouteComponent);
    return RedirectToDefaultRouteComponent;
}());



/***/ }),

/***/ "./src/app/shared/_components/tangy-svg-logo/tangy-svg-logo.component.css":
/*!********************************************************************************!*\
  !*** ./src/app/shared/_components/tangy-svg-logo/tangy-svg-logo.component.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/shared/_components/tangy-svg-logo/tangy-svg-logo.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/shared/_components/tangy-svg-logo/tangy-svg-logo.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<svg [ngStyle]=\"tangyLogoStyle\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 83.41 83.43\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: #fcb814;\n      }\n\n      .cls-2 {\n        fill: #f8f185;\n      }\n\n      .cls-3 {\n        fill: #f2682c;\n      }\n\n      .cls-4 {\n        fill: #f47820;\n      }\n\n      .cls-5 {\n        fill: #f2672b;\n      }\n\n      .cls-6 {\n        fill: #fff;\n      }\n    </style>\n  </defs>\n  <g id=\"Layer_2\" data-name=\"Layer 2\">\n    <g id=\"Layer_1-2\" data-name=\"Layer 1\">\n      <path d=\"M35.79 6.93a3.24 3.24 0 0 1 4.62 3.15l.71 25.74c.07 2.62-1.2 3.09-2.83 1l-16-20.22a3.23 3.23 0 0 1 1.52-5.36z\" class=\"cls-1\"\n      />\n      <circle cx=\"41.71\" cy=\"41.72\" r=\"40.28\" class=\"cls-2\" transform=\"rotate(-44.86 41.725 41.72)\" />\n      <path d=\"M41.72 83.43a41.72 41.72 0 0 1-29.43-71.28 41.72 41.72 0 1 1 58.85 59.13 41.45 41.45 0 0 1-29.42 12.15zm0-80.57a38.85 38.85 0 0 0-27.54 66.26 38.85 38.85 0 1 0 55.07-54.81A38.59 38.59 0 0 0 41.71 2.86z\"\n        class=\"cls-3\" />\n      <path d=\"M35.12 78.08a3.25 3.25 0 0 1-3.26-4.54L40 49.11c.83-2.49 2.19-2.49 3 0l8.15 24.49a3.23 3.23 0 0 1-3.26 4.52z\" class=\"cls-4\"\n      />\n      <path d=\"M59.5 74a3.24 3.24 0 0 1-5.42-1.38L44.61 48.7c-1-2.44.07-3.31 2.31-1.94l22 13.52a3.23 3.23 0 0 1 .4 5.56z\" class=\"cls-1\"\n      />\n      <path d=\"M75.56 55.24a3.25 3.25 0 0 1-5 2.43L47.88 45.41c-2.31-1.25-2.07-2.58.52-3l25.52-3.77a3.23 3.23 0 0 1 3.88 4z\" class=\"cls-5\"\n      />\n      <path d=\"M75.8 30.53a3.25 3.25 0 0 1-2.3 5.09l-25.23 5.17c-2.57.53-3.25-.65-1.51-2.61l17.13-19.29a3.23 3.23 0 0 1 5.54.57z\"\n        class=\"cls-4\" />\n      <path d=\"M60.09 11.45a3.24 3.24 0 0 1 1.52 5.38L45.6 37c-1.63 2.06-2.9 1.59-2.83-1l.72-25.79a3.23 3.23 0 0 1 4.61-3.15z\"\n        class=\"cls-5\" />\n      <path d=\"M35.79 6.93a3.24 3.24 0 0 1 4.62 3.15l.71 25.74c.07 2.62-1.2 3.09-2.83 1l-16-20.22a3.23 3.23 0 0 1 1.52-5.36z\" class=\"cls-1\"\n      />\n      <path d=\"M14.28 19.08a3.24 3.24 0 0 1 5.56-.56l17.09 19.27c1.74 2 1.06 3.14-1.51 2.61l-25.27-5.19a3.23 3.23 0 0 1-2.28-5.09z\"\n        class=\"cls-5\" />\n      <path d=\"M5.6 42.23a3.24 3.24 0 0 1 3.9-4L35 42c2.6.38 2.83 1.72.52 3L12.81 57.24a3.23 3.23 0 0 1-5-2.43z\" class=\"cls-4\"\n      />\n      <path d=\"M13.84 65.53a3.24 3.24 0 0 1 .41-5.53l21.94-13.53c2.24-1.37 3.27-.5 2.31 1.94l-9.5 24a3.23 3.23 0 0 1-5.41 1.36z\"\n        class=\"cls-1\" />\n      <path d=\"M26 74.83a3.84 3.84 0 0 1-2.46-1l-9.76-8.23a3.36 3.36 0 0 1 .43-5.77l21.92-13.46A3.73 3.73 0 0 1 38 45.7a1 1 0 0 1 .83.39c.32.46.26 1.28-.17 2.36l-9.5 24A3.42 3.42 0 0 1 26 74.83zm12-28.89a3.56 3.56 0 0 0-1.7.63L14.31 60.06a3.13 3.13 0 0 0-.4 5.38l9.76 8.23a3.6 3.6 0 0 0 2.3.93 3.19 3.19 0 0 0 2.91-2.24l9.5-24c.39-1 .46-1.75.2-2.14a.71.71 0 0 0-.58-.28z\"\n        class=\"cls-1\" />\n      <circle cx=\"41.72\" cy=\"42.53\" r=\"2.06\" class=\"cls-5\" transform=\"rotate(-44.86 41.72 42.527)\" />\n      <path d=\"M10.36 30.55c.42-.9 1.7-.75 2.84.33s.8 1.82-.77 1.64-2.5-1.06-2.07-1.97zm14.99 1.14c.42-.9 1.7-.75 2.85.33s.8 1.82-.77 1.64-2.5-1.07-2.08-1.97zm-1.5 36.02c-.83-.55-.5-1.79.74-2.77s1.91-.53 1.51 1-1.42 2.32-2.25 1.77zM54.39 57.6c-.82.56-1.85-.22-2.28-1.73s.24-2 1.49-1 1.61 2.13.79 2.73z\"\n        class=\"cls-6\" />\n    </g>\n  </g>\n</svg>\n"

/***/ }),

/***/ "./src/app/shared/_components/tangy-svg-logo/tangy-svg-logo.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/shared/_components/tangy-svg-logo/tangy-svg-logo.component.ts ***!
  \*******************************************************************************/
/*! exports provided: TangySvgLogoComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TangySvgLogoComponent", function() { return TangySvgLogoComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TangySvgLogoComponent = /** @class */ (function () {
    function TangySvgLogoComponent() {
    }
    TangySvgLogoComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Object)
    ], TangySvgLogoComponent.prototype, "tangyLogoStyle", void 0);
    TangySvgLogoComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-tangy-svg-logo',
            template: __webpack_require__(/*! ./tangy-svg-logo.component.html */ "./src/app/shared/_components/tangy-svg-logo/tangy-svg-logo.component.html"),
            styles: [__webpack_require__(/*! ./tangy-svg-logo.component.css */ "./src/app/shared/_components/tangy-svg-logo/tangy-svg-logo.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], TangySvgLogoComponent);
    return TangySvgLogoComponent;
}());



/***/ }),

/***/ "./src/app/shared/_directives/seamless-with-window.directive.ts":
/*!**********************************************************************!*\
  !*** ./src/app/shared/_directives/seamless-with-window.directive.ts ***!
  \**********************************************************************/
/*! exports provided: SeamlessWithWindowDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SeamlessWithWindowDirective", function() { return SeamlessWithWindowDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_window_ref_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/window-ref.service */ "./src/app/core/window-ref.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SeamlessWithWindowDirective = /** @class */ (function () {
    function SeamlessWithWindowDirective(el, windowRef) {
        this.el = el;
        this.windowRef = windowRef;
        this.setIframeDimensions();
    }
    SeamlessWithWindowDirective.prototype.onResize = function (event) {
        this.setIframeDimensions();
    };
    SeamlessWithWindowDirective.prototype.setIframeDimensions = function () {
        this.el.nativeElement.style.width = this.windowRef.nativeWindow.innerWidth + 'px';
        this.el.nativeElement.style.position = 'fixed';
        this.el.nativeElement.style.height = this.windowRef.nativeWindow.innerHeight - 73 + 'px';
        this.el.nativeElement.style.left = 0;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["HostListener"])('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], SeamlessWithWindowDirective.prototype, "onResize", null);
    SeamlessWithWindowDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[appSeamlessWithWindow]'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"], _core_window_ref_service__WEBPACK_IMPORTED_MODULE_1__["WindowRef"]])
    ], SeamlessWithWindowDirective);
    return SeamlessWithWindowDirective;
}());



/***/ }),

/***/ "./src/app/shared/_pipes/truncate-value.pipe.ts":
/*!******************************************************!*\
  !*** ./src/app/shared/_pipes/truncate-value.pipe.ts ***!
  \******************************************************/
/*! exports provided: TruncateValuePipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TruncateValuePipe", function() { return TruncateValuePipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var TruncateValuePipe = /** @class */ (function () {
    function TruncateValuePipe() {
    }
    /**
     * @ngModule SharedModule
     * @whatItDoes Transforms text by truncating it
     * @howToUse `value | truncateString[:characters:[ellipsis]]`
     *
     * @param value is any valid JavaScript Value
     * @param characters is the number of characters to show
     * @param ellipsis is the text that is appended to the transformed value to show that
     *  the value is truncated
     * @returns {string} the transformed text
     * @TODO: add examples
     *
     */
    TruncateValuePipe.prototype.transform = function (value, characters, ellipsis) {
        value = value ? value.toString() : '';
        characters = characters ? characters : value.length;
        if (value.length <= characters || value.characters < 1) {
            return value.toString();
        }
        ellipsis = ellipsis ? ellipsis : '...';
        value = value.slice(0, characters);
        return value + ellipsis;
    };
    TruncateValuePipe = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Pipe"])({
            name: 'truncateValuePipe'
        })
    ], TruncateValuePipe);
    return TruncateValuePipe;
}());



/***/ }),

/***/ "./src/app/shared/_services/app-config.service.ts":
/*!********************************************************!*\
  !*** ./src/app/shared/_services/app-config.service.ts ***!
  \********************************************************/
/*! exports provided: AppConfigService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppConfigService", function() { return AppConfigService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var AppConfigService = /** @class */ (function () {
    function AppConfigService(http) {
        this.http = http;
    }
    AppConfigService.prototype.getAppConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, appConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.get('./assets/app-config.json').toPromise()];
                    case 1:
                        res = _a.sent();
                        appConfig = res;
                        return [2 /*return*/, appConfig];
                }
            });
        });
    };
    AppConfigService.prototype.getDefaultURL = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAppConfig()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.homeUrl];
                }
            });
        });
    };
    AppConfigService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], AppConfigService);
    return AppConfigService;
}());



/***/ }),

/***/ "./src/app/shared/shared.module.ts":
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/*! exports provided: SharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedModule", function() { return SharedModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/tooltip */ "./node_modules/@angular/material/esm5/tooltip.es5.js");
/* harmony import */ var _shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/_services/app-config.service */ "./src/app/shared/_services/app-config.service.ts");
/* harmony import */ var _tangy_forms_safe_url_pipe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../tangy-forms/safe-url.pipe */ "./src/app/tangy-forms/safe-url.pipe.ts");
/* harmony import */ var _components_redirect_to_default_route_redirect_to_default_route_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_components/redirect-to-default-route/redirect-to-default-route.component */ "./src/app/shared/_components/redirect-to-default-route/redirect-to-default-route.component.ts");
/* harmony import */ var _components_tangy_svg_logo_tangy_svg_logo_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_components/tangy-svg-logo/tangy-svg-logo.component */ "./src/app/shared/_components/tangy-svg-logo/tangy-svg-logo.component.ts");
/* harmony import */ var _directives_seamless_with_window_directive__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_directives/seamless-with-window.directive */ "./src/app/shared/_directives/seamless-with-window.directive.ts");
/* harmony import */ var _pipes_truncate_value_pipe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_pipes/truncate-value.pipe */ "./src/app/shared/_pipes/truncate-value.pipe.ts");
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/core */ "./node_modules/@ngx-translate/core/fesm5/ngx-translate-core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
                _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_2__["MatTooltipModule"]
            ],
            providers: [_shared_services_app_config_service__WEBPACK_IMPORTED_MODULE_3__["AppConfigService"]],
            declarations: [_tangy_forms_safe_url_pipe__WEBPACK_IMPORTED_MODULE_4__["SafeUrlPipe"],
                _directives_seamless_with_window_directive__WEBPACK_IMPORTED_MODULE_7__["SeamlessWithWindowDirective"], _components_tangy_svg_logo_tangy_svg_logo_component__WEBPACK_IMPORTED_MODULE_6__["TangySvgLogoComponent"],
                _pipes_truncate_value_pipe__WEBPACK_IMPORTED_MODULE_8__["TruncateValuePipe"],
                _components_redirect_to_default_route_redirect_to_default_route_component__WEBPACK_IMPORTED_MODULE_5__["RedirectToDefaultRouteComponent"]],
            exports: [_components_redirect_to_default_route_redirect_to_default_route_component__WEBPACK_IMPORTED_MODULE_5__["RedirectToDefaultRouteComponent"], _tangy_forms_safe_url_pipe__WEBPACK_IMPORTED_MODULE_4__["SafeUrlPipe"],
                _directives_seamless_with_window_directive__WEBPACK_IMPORTED_MODULE_7__["SeamlessWithWindowDirective"], _components_tangy_svg_logo_tangy_svg_logo_component__WEBPACK_IMPORTED_MODULE_6__["TangySvgLogoComponent"],
                _pipes_truncate_value_pipe__WEBPACK_IMPORTED_MODULE_8__["TruncateValuePipe"], _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__["TranslateModule"]]
        })
    ], SharedModule);
    return SharedModule;
}());



/***/ }),

/***/ "./src/app/shared/translation-marker.ts":
/*!**********************************************!*\
  !*** ./src/app/shared/translation-marker.ts ***!
  \**********************************************/
/*! exports provided: _TRANSLATE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_TRANSLATE", function() { return _TRANSLATE; });
function _TRANSLATE(str) {
    return str;
}


/***/ }),

/***/ "./src/app/tangy-forms/safe-url.pipe.ts":
/*!**********************************************!*\
  !*** ./src/app/tangy-forms/safe-url.pipe.ts ***!
  \**********************************************/
/*! exports provided: SafeUrlPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SafeUrlPipe", function() { return SafeUrlPipe; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SafeUrlPipe = /** @class */ (function () {
    function SafeUrlPipe(sanitizer) {
        this.sanitizer = sanitizer;
    }
    SafeUrlPipe.prototype.transform = function (url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };
    SafeUrlPipe = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            name: 'safeUrl'
        }),
        __metadata("design:paramtypes", [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["DomSanitizer"]])
    ], SafeUrlPipe);
    return SafeUrlPipe;
}());



/***/ }),

/***/ "./src/app/tangy-forms/tangy-form-service.ts":
/*!***************************************************!*\
  !*** ./src/app/tangy-forms/tangy-form-service.ts ***!
  \***************************************************/
/*! exports provided: TangyFormService, tangyFormDesignDoc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TangyFormService", function() { return TangyFormService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tangyFormDesignDoc", function() { return tangyFormDesignDoc; });
/* harmony import */ var pouchdb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pouchdb */ "./node_modules/pouchdb/lib/index-browser.es.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

// A dummy function so TS does not complain about our use of emit in our pouchdb queries.
var emit = function (key, value) {
    return true;
};
var TangyFormService = /** @class */ (function () {
    function TangyFormService(props) {
        this.databaseName = 'tangy-forms';
        Object.assign(this, props);
        this.db = new pouchdb__WEBPACK_IMPORTED_MODULE_0__["default"](this.databaseName);
    }
    TangyFormService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var designDoc, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.db.get('_design/tangy-form')];
                    case 1:
                        designDoc = _a.sent();
                        if (!(designDoc.version !== tangyFormDesignDoc.version)) return [3 /*break*/, 4];
                        console.log('Time to update _design/tangy-form');
                        console.log('Removing _design/tangy-form');
                        return [4 /*yield*/, this.db.remove(designDoc)];
                    case 2:
                        _a.sent();
                        console.log('Cleaning up view indexes');
                        // @TODO This causes conflicts with open databases. How to avoid??
                        //await this.db.viewCleanup()
                        console.log('Creating _design/tangy-form');
                        return [4 /*yield*/, this.db.put(tangyFormDesignDoc)
                            //let updatedDesignDoc = Object.assign({}, designDoc, tangyFormDesignDoc)
                            //await this.db.put(updatedDesignDoc)
                        ];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        this.loadDesignDoc();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TangyFormService.prototype.loadDesignDoc = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.put(tangyFormDesignDoc)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TangyFormService.prototype.getForm = function (formId) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query('tangy-form/formByFormId', { key: formId, include_docs: true })];
                    case 1:
                        results = _a.sent();
                        if (results.rows.length == 0) {
                            return [2 /*return*/, false];
                        }
                        else {
                            return [2 /*return*/, results.rows[0].doc];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TangyFormService.prototype.saveForm = function (formDoc) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!formDoc._id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.post(formDoc)];
                    case 1:
                        r = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.db.put(formDoc)];
                    case 3:
                        r = _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.db.get(r.id)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Would be nice if this was queue based so if two saves get called at the same time, the differentials are sequentials updated
    // into the database. Using a getter and setter for property fields, this would be one way to queue.
    TangyFormService.prototype.saveResponse = function (responseDoc) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!responseDoc._id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.db.post(responseDoc)];
                    case 1:
                        r = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.db.put(responseDoc)];
                    case 3:
                        r = _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.db.get(r.id)];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TangyFormService.prototype.getResponse = function (responseId) {
        return __awaiter(this, void 0, void 0, function () {
            var doc, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.get(responseId)];
                    case 1:
                        doc = _a.sent();
                        return [2 /*return*/, doc];
                    case 2:
                        e_2 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TangyFormService.prototype.getResponsesByFormId = function (formId) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query('tangy-form/responsesByFormId', { key: formId, include_docs: true })];
                    case 1:
                        r = _a.sent();
                        return [2 /*return*/, r.rows.map(function (row) { return row.doc; })];
                }
            });
        });
    };
    TangyFormService.prototype.getResponsesByLocationId = function (locationId) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query('tangy-form/responsesByLocationId', { key: locationId, include_docs: true })];
                    case 1:
                        r = _a.sent();
                        return [2 /*return*/, r.rows.map(function (row) { return row.doc; })];
                }
            });
        });
    };
    return TangyFormService;
}());

var tangyFormDesignDoc = {
    _id: '_design/tangy-form',
    version: '31',
    views: {
        responsesByFormId: {
            map: function (doc) {
                if (doc.collection !== 'TangyFormResponse')
                    return;
                emit("" + doc.form.id, true);
            }.toString()
        },
        responsesLockedAndNotUploaded: {
            map: function (doc) {
                if ((doc.collection === 'TangyFormResponse' && doc.complete === true && !doc.uploadDatetime ||
                    (doc.collection === 'TangyFormResponse' && doc.form.id === 'user-profile' && !doc.uploadDatetime))) {
                    emit(doc._id, true);
                }
            }.toString()
        },
        responsesLockedAndUploaded: {
            map: function (doc) {
                if (doc.collection === 'TangyFormResponse' && doc.complete === true && !!doc.uploadDatetime) {
                    emit(doc._id, true);
                }
            }.toString()
        },
        responsesByLocationId: {
            map: function (doc) {
                if (doc.hasOwnProperty('collection') && doc.collection === 'TangyFormResponse') {
                    if (doc.form.id === 'user-profile' || doc.form.id === 'reports')
                        return;
                    var inputs_1 = [];
                    doc.items.forEach(function (item) { return inputs_1 = inputs_1.concat(item.inputs); });
                    var location_1 = inputs_1.find(function (input) { return (input.tagName === 'TANGY-LOCATION') ? true : false; });
                    if (location_1) {
                        var lowestLevelLocation = location_1.value.pop();
                        emit(lowestLevelLocation.value, true);
                    }
                }
            }.toString()
        },
        responsesByYearMonthLocationId: {
            map: function (doc) {
                if (doc.hasOwnProperty('collection') && doc.collection === 'TangyFormResponse') {
                    if (doc.form.id === 'user-profile' || doc.form.id === 'reports')
                        return;
                    var startDatetime = new Date(doc.startDatetime);
                    var inputs_2 = [];
                    doc.items.forEach(function (item) { return inputs_2 = inputs_2.concat(item.inputs); });
                    var location_2 = inputs_2.find(function (input) { return (input.tagName === 'TANGY-LOCATION') ? true : false; });
                    if (location_2) {
                        var lowestLevelLocation = location_2.value.pop();
                        var thisLocationId = lowestLevelLocation.value;
                        emit(thisLocationId + "-" + startDatetime.getDate() + "-" + startDatetime.getMonth() + "-" + startDatetime.getFullYear(), true);
                    }
                }
            }.toString()
        },
        responsesByFormIdAndStartDatetime: {
            map: function (doc) {
                if (doc.collection !== 'TangyFormResponse')
                    return;
                emit(doc.form.id + "-" + doc.startDatetime, true);
            }.toString()
        },
        responseByUploadDatetime: {
            map: function (doc) {
                if (doc.collection !== 'TangyFormResponse')
                    return;
                emit(doc.uploadDatetime, true);
            }.toString()
        }
    }
};



/***/ }),

/***/ "./src/app/tangy-forms/tangy-forms-player/tangy-forms-player.component.css":
/*!*********************************************************************************!*\
  !*** ./src/app/tangy-forms/tangy-forms-player/tangy-forms-player.component.css ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "iframe {\n    border: none;\n    /* position: fixed; */\n    /* top: 80px; */\n    /* left: 0px; */\n    width: 100%;\n    height: 100vh;\n}\n"

/***/ }),

/***/ "./src/app/tangy-forms/tangy-forms-player/tangy-forms-player.component.html":
/*!**********************************************************************************!*\
  !*** ./src/app/tangy-forms/tangy-forms-player/tangy-forms-player.component.html ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div #container> </div>"

/***/ }),

/***/ "./src/app/tangy-forms/tangy-forms-player/tangy-forms-player.component.ts":
/*!********************************************************************************!*\
  !*** ./src/app/tangy-forms/tangy-forms-player/tangy-forms-player.component.ts ***!
  \********************************************************************************/
/*! exports provided: TangyFormsPlayerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TangyFormsPlayerComponent", function() { return TangyFormsPlayerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _case_management_services_case_management_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../case-management/_services/case-management.service */ "./src/app/case-management/_services/case-management.service.ts");
/* harmony import */ var _core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/auth/_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
/* harmony import */ var _core_window_ref_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core/window-ref.service */ "./src/app/core/window-ref.service.ts");
/* harmony import */ var _tangy_form_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../tangy-form-service */ "./src/app/tangy-forms/tangy-form-service.ts");
/* harmony import */ var tangy_form_tangy_form_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! tangy-form/tangy-form.js */ "./node_modules/tangy-form/tangy-form.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};








var sleep = function (milliseconds) { return new Promise(function (res) { return setTimeout(function () { return res(true); }, milliseconds); }); };
var TangyFormsPlayerComponent = /** @class */ (function () {
    function TangyFormsPlayerComponent(caseManagementService, route, http, userService, windowRef) {
        this.caseManagementService = caseManagementService;
        this.route = route;
        this.http = http;
        this.userService = userService;
        this.windowRef = windowRef;
    }
    TangyFormsPlayerComponent.prototype.ngAfterContentInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.route.queryParams.subscribe(function (params) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    var formInfo, userDbName, tangyFormService, formResponse, container, formHtml, formEl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.formIndex = +params['formIndex'] || 0;
                                this.responseId = params['responseId'];
                                return [4 /*yield*/, this.getFormInfoByIndex(this.formIndex)];
                            case 1:
                                formInfo = _a.sent();
                                return [4 /*yield*/, this.userService.getUserDatabase()];
                            case 2:
                                userDbName = _a.sent();
                                tangyFormService = new _tangy_form_service__WEBPACK_IMPORTED_MODULE_6__["TangyFormService"]({ databaseName: userDbName });
                                this.service = tangyFormService;
                                return [4 /*yield*/, tangyFormService.getResponse(this.responseId)];
                            case 3:
                                formResponse = _a.sent();
                                container = this.container.nativeElement;
                                return [4 /*yield*/, this.http.get(formInfo.src, { responseType: 'text' }).toPromise()];
                            case 4:
                                formHtml = _a.sent();
                                container.innerHTML = formHtml;
                                formEl = container.querySelector('tangy-form');
                                // Put a response in the store by issuing the FORM_OPEN action.
                                if (formResponse) {
                                    formEl.store.dispatch({ type: 'FORM_OPEN', response: formResponse });
                                }
                                else {
                                    //formEl.store.dispatch({ type: 'FORM_OPEN', response: {} })
                                }
                                // Listen up, save in the db.
                                formEl.addEventListener('TANGY_FORM_UPDATE', function (_) {
                                    var response = _.target.store.getState();
                                    _this.throttledSaveResponse(response);
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    // Prevent parallel saves which leads to race conditions. Only save the first and then last state of the store.
    // Everything else in between we can ignore.
    TangyFormsPlayerComponent.prototype.throttledSaveResponse = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // If already loaded, return.
                        if (this.throttledSaveLoaded)
                            return [2 /*return*/];
                        if (!this.throttledSaveFiring) return [3 /*break*/, 4];
                        this.throttledSaveLoaded = true;
                        _a.label = 1;
                    case 1:
                        if (!this.throttledSaveFiring) return [3 /*break*/, 3];
                        return [4 /*yield*/, sleep(200)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        this.throttledSaveLoaded = false;
                        _a.label = 4;
                    case 4:
                        // Fire it.
                        this.throttledSaveFiring = true;
                        return [4 /*yield*/, this.saveResponse(response)];
                    case 5:
                        _a.sent();
                        this.throttledSaveFiring = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    TangyFormsPlayerComponent.prototype.saveResponse = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var stateDoc, e_1, r, newStateDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stateDoc = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 6]);
                        return [4 /*yield*/, this.service.getResponse(state._id)];
                    case 2:
                        stateDoc = _a.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        e_1 = _a.sent();
                        return [4 /*yield*/, this.service.saveResponse(state)];
                    case 4:
                        r = _a.sent();
                        return [4 /*yield*/, this.service.getResponse(state._id)];
                    case 5:
                        stateDoc = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        newStateDoc = Object.assign({}, state, { _rev: stateDoc['_rev'] });
                        return [4 /*yield*/, this.service.saveResponse(newStateDoc)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TangyFormsPlayerComponent.prototype.getFormInfoByIndex = function (index) {
        if (index === void 0) { index = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var userDB, form, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.userService.getUserDatabase()];
                    case 1:
                        userDB = _a.sent();
                        return [4 /*yield*/, this.caseManagementService.getFormList()];
                    case 2:
                        form = _a.sent();
                        if (!(index >= form.length)) {
                            // Relative path to tangy forms app.
                            return [2 /*return*/, form[index]];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('container'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], TangyFormsPlayerComponent.prototype, "container", void 0);
    TangyFormsPlayerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-tangy-forms-player',
            template: __webpack_require__(/*! ./tangy-forms-player.component.html */ "./src/app/tangy-forms/tangy-forms-player/tangy-forms-player.component.html"),
            styles: [__webpack_require__(/*! ./tangy-forms-player.component.css */ "./src/app/tangy-forms/tangy-forms-player/tangy-forms-player.component.css")]
        }),
        __metadata("design:paramtypes", [_case_management_services_case_management_service__WEBPACK_IMPORTED_MODULE_3__["CaseManagementService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"],
            _core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_4__["UserService"],
            _core_window_ref_service__WEBPACK_IMPORTED_MODULE_5__["WindowRef"]])
    ], TangyFormsPlayerComponent);
    return TangyFormsPlayerComponent;
}());



/***/ }),

/***/ "./src/app/tangy-forms/tangy-forms-routing.module.ts":
/*!***********************************************************!*\
  !*** ./src/app/tangy-forms/tangy-forms-routing.module.ts ***!
  \***********************************************************/
/*! exports provided: TangyFormsRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TangyFormsRoutingModule", function() { return TangyFormsRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _user_profile_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../user-profile/create-profile-guard.service */ "./src/app/user-profile/create-profile-guard.service.ts");
/* harmony import */ var _core_auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/auth/_guards/login-guard.service */ "./src/app/core/auth/_guards/login-guard.service.ts");
/* harmony import */ var _tangy_forms_player_tangy_forms_player_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tangy-forms-player/tangy-forms-player.component */ "./src/app/tangy-forms/tangy-forms-player/tangy-forms-player.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var routes = [{
        path: 'tangy-forms-player',
        component: _tangy_forms_player_tangy_forms_player_component__WEBPACK_IMPORTED_MODULE_4__["TangyFormsPlayerComponent"],
        canActivate: [_core_auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_3__["LoginGuard"], _user_profile_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_2__["CreateProfileGuardService"]]
    }
];
var TangyFormsRoutingModule = /** @class */ (function () {
    function TangyFormsRoutingModule() {
    }
    TangyFormsRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], TangyFormsRoutingModule);
    return TangyFormsRoutingModule;
}());



/***/ }),

/***/ "./src/app/tangy-forms/tangy-forms.module.ts":
/*!***************************************************!*\
  !*** ./src/app/tangy-forms/tangy-forms.module.ts ***!
  \***************************************************/
/*! exports provided: TangyFormsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TangyFormsModule", function() { return TangyFormsModule; });
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _tangy_forms_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tangy-forms-routing.module */ "./src/app/tangy-forms/tangy-forms-routing.module.ts");
/* harmony import */ var _tangy_forms_player_tangy_forms_player_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tangy-forms-player/tangy-forms-player.component */ "./src/app/tangy-forms/tangy-forms-player/tangy-forms-player.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var TangyFormsModule = /** @class */ (function () {
    function TangyFormsModule() {
    }
    TangyFormsModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _tangy_forms_routing_module__WEBPACK_IMPORTED_MODULE_3__["TangyFormsRoutingModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_0__["SharedModule"]
            ],
            declarations: [_tangy_forms_player_tangy_forms_player_component__WEBPACK_IMPORTED_MODULE_4__["TangyFormsPlayerComponent"]]
        })
    ], TangyFormsModule);
    return TangyFormsModule;
}());



/***/ }),

/***/ "./src/app/user-profile/create-profile-guard.service.ts":
/*!**************************************************************!*\
  !*** ./src/app/user-profile/create-profile-guard.service.ts ***!
  \**************************************************************/
/*! exports provided: CreateProfileGuardService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateProfileGuardService", function() { return CreateProfileGuardService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/auth/_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
/* harmony import */ var pouchdb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! pouchdb */ "./node_modules/pouchdb/lib/index-browser.es.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var CreateProfileGuardService = /** @class */ (function () {
    function CreateProfileGuardService(router, userService) {
        this.router = router;
        this.userService = userService;
    }
    CreateProfileGuardService.prototype.canActivate = function (route, state) {
        return __awaiter(this, void 0, void 0, function () {
            var isProfileComplete, _a, results, responseDoc;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isProfileComplete = false;
                        _a = this;
                        return [4 /*yield*/, this.userService.getUserDatabase()];
                    case 1:
                        _a.userDatabase = _b.sent();
                        this.DB = new pouchdb__WEBPACK_IMPORTED_MODULE_3__["default"](this.userDatabase);
                        return [4 /*yield*/, this.DB.query('tangy-form/responsesByFormId', {
                                key: 'user-profile',
                                include_docs: true
                            })];
                    case 2:
                        results = _b.sent();
                        if (results.rows.length === 0) {
                            isProfileComplete = false;
                        }
                        else {
                            responseDoc = results.rows[0].doc;
                            isProfileComplete = responseDoc.items.find(function (item) {
                                return (item.incomplete === true);
                            }) ? false : true;
                        }
                        if (!isProfileComplete) {
                            this.router.navigate(['/manage-user-profile'], { queryParams: { returnUrl: state.url } });
                        }
                        return [2 /*return*/, isProfileComplete];
                }
            });
        });
    };
    CreateProfileGuardService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_2__["UserService"]])
    ], CreateProfileGuardService);
    return CreateProfileGuardService;
}());



/***/ }),

/***/ "./src/app/user-profile/user-profile-routing.module.ts":
/*!*************************************************************!*\
  !*** ./src/app/user-profile/user-profile-routing.module.ts ***!
  \*************************************************************/
/*! exports provided: UserProfileRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserProfileRoutingModule", function() { return UserProfileRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _core_auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/auth/_guards/login-guard.service */ "./src/app/core/auth/_guards/login-guard.service.ts");
/* harmony import */ var _user_profile_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./user-profile.component */ "./src/app/user-profile/user-profile.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var routes = [{
        path: 'manage-user-profile',
        component: _user_profile_component__WEBPACK_IMPORTED_MODULE_3__["UserProfileComponent"],
        canActivate: [_core_auth_guards_login_guard_service__WEBPACK_IMPORTED_MODULE_2__["LoginGuard"]]
    }];
var UserProfileRoutingModule = /** @class */ (function () {
    function UserProfileRoutingModule() {
    }
    UserProfileRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
            declarations: []
        })
    ], UserProfileRoutingModule);
    return UserProfileRoutingModule;
}());



/***/ }),

/***/ "./src/app/user-profile/user-profile.component.css":
/*!*********************************************************!*\
  !*** ./src/app/user-profile/user-profile.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "iframe {\n    border: none;\n    /* position: fixed; */\n    /* top: 80px; */\n    /* left: 0px; */\n  \n    position: absolute; height:100%; width:100%;\n}\n"

/***/ }),

/***/ "./src/app/user-profile/user-profile.component.html":
/*!**********************************************************!*\
  !*** ./src/app/user-profile/user-profile.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div #container> </div>"

/***/ }),

/***/ "./src/app/user-profile/user-profile.component.ts":
/*!********************************************************!*\
  !*** ./src/app/user-profile/user-profile.component.ts ***!
  \********************************************************/
/*! exports provided: UserProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserProfileComponent", function() { return UserProfileComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/auth/_services/user.service */ "./src/app/core/auth/_services/user.service.ts");
/* harmony import */ var _tangy_forms_tangy_form_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../tangy-forms/tangy-form-service */ "./src/app/tangy-forms/tangy-form-service.ts");
/* harmony import */ var tangy_form_tangy_form_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tangy-form/tangy-form.js */ "./node_modules/tangy-form/tangy-form.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






var UserProfileComponent = /** @class */ (function () {
    function UserProfileComponent(route, router, http, userService) {
        this.route = route;
        this.router = router;
        this.http = http;
        this.userService = userService;
    }
    UserProfileComponent.prototype.ngAfterContentInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var userDbName, tangyFormService, profileDocs, container, formHtml, formEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserDatabase()];
                    case 1:
                        userDbName = _a.sent();
                        tangyFormService = new _tangy_forms_tangy_form_service__WEBPACK_IMPORTED_MODULE_4__["TangyFormService"]({ databaseName: userDbName });
                        return [4 /*yield*/, tangyFormService.getResponsesByFormId('user-profile')];
                    case 2:
                        profileDocs = _a.sent();
                        container = this.container.nativeElement;
                        return [4 /*yield*/, this.http.get('./assets/user-profile/form.html', { responseType: 'text' }).toPromise()];
                    case 3:
                        formHtml = _a.sent();
                        container.innerHTML = formHtml;
                        formEl = container.querySelector('tangy-form');
                        formEl.addEventListener('ALL_ITEMS_CLOSED', function () { return __awaiter(_this, void 0, void 0, function () {
                            var profileDoc;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        profileDoc = formEl.store.getState();
                                        return [4 /*yield*/, tangyFormService.saveResponse(profileDoc)];
                                    case 1:
                                        _a.sent();
                                        this.router.navigate(['/forms-list']);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        // Put a response in the store by issuing the FORM_OPEN action.
                        if (profileDocs.length > 0) {
                            formEl.store.dispatch({ type: 'FORM_OPEN', response: profileDocs[0] });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('container'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], UserProfileComponent.prototype, "container", void 0);
    UserProfileComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-user-profile',
            template: __webpack_require__(/*! ./user-profile.component.html */ "./src/app/user-profile/user-profile.component.html"),
            styles: [__webpack_require__(/*! ./user-profile.component.css */ "./src/app/user-profile/user-profile.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"],
            _core_auth_services_user_service__WEBPACK_IMPORTED_MODULE_3__["UserService"]])
    ], UserProfileComponent);
    return UserProfileComponent;
}());



/***/ }),

/***/ "./src/app/user-profile/user-profile.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/user-profile/user-profile.module.ts ***!
  \*****************************************************/
/*! exports provided: UserProfileModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserProfileModule", function() { return UserProfileModule; });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _create_profile_guard_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./create-profile-guard.service */ "./src/app/user-profile/create-profile-guard.service.ts");
/* harmony import */ var _user_profile_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./user-profile-routing.module */ "./src/app/user-profile/user-profile-routing.module.ts");
/* harmony import */ var _user_profile_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./user-profile.component */ "./src/app/user-profile/user-profile.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var UserProfileModule = /** @class */ (function () {
    function UserProfileModule() {
    }
    UserProfileModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            providers: [_create_profile_guard_service__WEBPACK_IMPORTED_MODULE_4__["CreateProfileGuardService"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"],
                _user_profile_routing_module__WEBPACK_IMPORTED_MODULE_5__["UserProfileRoutingModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatListModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_3__["SharedModule"]
            ],
            declarations: [_user_profile_component__WEBPACK_IMPORTED_MODULE_6__["UserProfileComponent"]]
        })
    ], UserProfileModule);
    return UserProfileModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");





if (_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/rjsteinert/Git/tangerine-community/tangerine/client/app/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map