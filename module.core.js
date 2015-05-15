(function (factory) {

	// 以其他全局变量替换
	window.Luobo = factory();

})(function () {

	var __modules = {};

	/*
	 * 定义具名模块，使得其他模块可以根据名称引用此模块
	 *
	 * 用法：
	 * 1. 构造函数：给出模块名称、依赖模块列表、模块构造函数，缓存模块构造函数的返回值
	 *   e.g.
	 *   define('mod2', ['mod1'], function (mod1) { ... return { ... }; })
	 *   特别地，当模块构造函数没有声明返回值时（如模块定义了一个 jQuery 插件），缓存模块名称时
	 *   对应 true，以便于查找时确定以定义过该名称的模块。
	 *   依赖模块数组及构造函数的使用，参考 require 函数的说明。
	 * 2. 直接声明模块：给出模块名称、模块“实体”，直接缓存模块实体
	 *   e.g.
	 *   define('mod1', { name: 'luobo', age: 18 })
	 *   注意：为避免混淆，模块“实体”只能是普通对象，不能是数组、函数
	 */
	function define(moduleName, deps, factory) {
		// 模块名称统一使用小写，避免出现大小写不同的同名模块
		moduleName = moduleName.toLowerCase();
		if (moduleName in __modules) {
			// 同名模块已定义时直接返回，避免重复声明
			return;
		}
		var module;
		if (isArrayOrFunction(deps)) {
			module = require(deps, factory);
		} else {
			module = deps;
		}
		__modules[moduleName] = module;
	}

	/*
	 * 声明依赖模块列表，基于依赖模块执行后续处理
	 *
	 * 用法：
	 * 1. 类 AMD：声明依赖的模块名称，作为参数使用
	 *   e.g.
	 *   require(['mod1', 'mod2'], function (mod1, mod2) { ... })
	 * 2. 类 CommonJS：不声明依赖模块，直接加载相应模块使用
	 *   e.g.
	 *   require(function (require) { var mod1 = require('mod1'); ... })
	 * 3. 匿名模块：声明位置非字符串情况下，作为模块定义
	 *   e.g.
	 *   require([{ name: 'luobo', age: 18 }, function () { ... }], function (obj, fn) { ... })
	 * 4. 获取单个模块：直接使用名称引用模块，更类似于 CommonJS 的写法
	 *   e.g.
	 *   var mod1 = require('mod1');
	 */
	function require(deps, factory) {
		if (typeof deps === 'string') {
			return getModule(deps);
		}
		if (typeof deps === 'function') {
			factory = deps;
			deps = ['require'];
		}
		if (typeof factory !== 'function') {
			throw 'no factory function';
		}
		for (var i = 0, module, len = deps.length; i < len; i++) {
			module = deps[i];
			if (typeof module === 'string') {
				deps[i] = getModule(module);
			}
		}
		return factory.apply(null, deps);
	}

	/*
	 * 获取缓存的已定义模块，试图获取未定义模块时抛出异常
	 */
	function getModule(name) {
		var module = __modules[name.toLowerCase()];
		if (!module) {
			throw 'module ' + name + ' not defined';
		}
		return  module;
	}

	function isArrayOrFunction(o) {
		return Object.prototype.toString.call(o) === '[object Array]' || typeof o === 'function';
	}

	// 缺省提供 require 模块，用于引用已定义模块
	__modules.require = getModule;

	return {
		define: define,
		require: require
	};
});