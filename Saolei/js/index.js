/**
 * 扫雷
 * 游戏逻辑及 DOM 控制
 *
 * @author 郑保乐
 * @date 2018-06-06
 */

// 表格
table = $ ('#table');

// 预设有雷的位置
var mined = [];

// 雷区宽度
var tableWidth = 9;

// 类数量
var mineLimits = tableWidth * tableWidth / 5;

// 还没有被排除或标记过的位置
var items = [];

var cells;

//	初始化
$ (function () {
	initMine ();
	initTable ();
});

/**
 * 初始化雷区
 */
initMine = function () {
	var i = 0;
	while (i < mineLimits) {
		var mine = Math.floor (Math.random () * tableWidth * tableWidth);
		console.log (mine);
		if (!inArray (mine, mined)) {
			mined.push (mine);
			i++;
		}
	}
};


/**
 * 初始化表格
 */
initTable = function () {
	for (var i = 0; i < tableWidth * tableWidth; i++) {
		items.push (i)
	}

	for (var m = 0; m < tableWidth; m++) {
		table.append ('<tr>');
		for (var j = 0; j < tableWidth; j++) {
			table.append ('<td></td>')
		}
		table.append ('</tr>')
	}

	cells = $ ('td');

	$.each (cells, function (index, cell) {
		// 绑定点击事件
		cell.test = function () {
			var cellIndex = $ (cells).index ($ (this));
			if (inArray (cellIndex, items)) {
				// 判断是否有雷
				$ (this).removeClass ();
				$ (this).addClass ('nomine');
				remove (index, items);
				var count = mineCount (cellIndex);
				$ (this).html (count);

				if (count == 0) {
					var surround = getSurroundLocations (index);
					console.log (surround);
					$ (surround).each (function (i) {
						var cell = cells[surround[i]];
						try {
							cell.test ()
						} catch (e) {
						}
					});
				}
			}
		};

		$ (cell).on ('mousedown', function (e) {
			var cellIndex = $ (cells).index ($ (this));
			if (e.which == 1) {
				if (-1 != $.inArray (cellIndex, mined)) {
					// 游戏结束
					explode (1);
					return;
				}
				this.test ();
			} else if (e.which == 3) {
				if (inArray (cellIndex, items)) {
					$ (this).addClass ('flagged');
					$ (this).html ('');
				}
				var count2 = mineCount (cellIndex);
			}

			if (items.sort ().toString () == mined.sort ().toString ()) {
				explode (0);
			}
		})
	})
};

/**
 * 被雷炸到，游戏结束
 */
explode = function (result) {
	$.each (cells, function (index, cell) {
		if (-1 != $.inArray (index, mined)) {
			$ (this).removeClass ();
			$ (this).addClass ('mine');
		}
	});

	setTimeout (function () {
		var str = '';
		if (result == 0) {
			str += '你赢了'
		} else {
			str += '你输了'
		}
		str += '，点击任意位置重新开始';
		alert (str);
		$ ('body').on ('click', function () {
			window.location.reload ()
		});
	}, 200);
};

/**
 * 判定某个位置周围有多少雷
 *
 * @param index
 */
mineCount = function (index) {
	var count = 0;
	var surroundCells = getSurroundLocations (index);
	$ (surroundCells).each (function (i) {
		var cell = surroundCells[i];
		if (hasMined (cell)) {
			count++
		}
	});

	console.log (items);
	return count;
};

/**
 * 判断元素是否在数组中
 *
 * @param element 元素
 * @param array 数组
 * @returns {boolean}
 */
inArray = function (element, array) {
	return -1 != $.inArray (element, array)
};

/**
 * 判断某个位置是否有雷
 *
 * @param index 位置
 * @returns {boolean}
 */
hasMined = function (index) {
	return index > -1 && index < tableWidth * tableWidth - 1 && inArray (index, mined)
};

/**
 * 从数组中移除某个元素
 *
 * @param element 元素
 * @param array 数组
 */
remove = function (element, array) {
	var index = $.inArray (element, array);
	if (index != -1) {
		array.splice ($.inArray (element, array), 1);
	}
};

getSurroundLocations = function (index) {
	const UP = 0;
	const RIGHT = 1;
	const DOWN = 2;
	const LEFT = 3;
	// 位置
	var location = [];
	//	位于上边界
	if (index - tableWidth < 0) {
		location.push (UP);
	}

	//	位于下边界
	if (index + tableWidth > tableWidth * tableWidth - 1) {
		location.push (DOWN)
	}

	//	位于左边界
	if (index % tableWidth == 0) {
		location.push (LEFT)
	}

	//	位于右边界
	if ((index + 1) % tableWidth == 0) {
		location.push (RIGHT)
	}

	console.log (location);

	//	未处于边界
	if (location.length < 1) {
		var locations1 = [];
		locations1.push (index - tableWidth);
		locations1.push (index - tableWidth - 1);
		locations1.push (index - tableWidth + 1);
		locations1.push (index + tableWidth);
		locations1.push (index + tableWidth + 1);
		locations1.push (index + tableWidth - 1);
		locations1.push (index - 1);
		locations1.push (index + 1);

		return locations1;
	}

	//	处于边界但不处于角落
	else if (location.length == 1) {
		var locations2 = [];
		locations2.push (index - tableWidth);
		locations2.push (index - tableWidth - 1);
		locations2.push (index - tableWidth + 1);
		locations2.push (index + tableWidth);
		locations2.push (index + tableWidth + 1);
		locations2.push (index + tableWidth - 1);
		locations2.push (index - 1);
		locations2.push (index + 1);

		if (inArray (UP, location)) {
			remove (index - tableWidth, locations2);
			remove (index - tableWidth - 1, locations2);
			remove (index - tableWidth + 1, locations2);
		}

		if (inArray (DOWN, location)) {
			remove (index + tableWidth, locations2);
			remove (index + tableWidth - 1, locations2);
			remove (index + tableWidth + 1, locations2);
		}

		if (inArray (LEFT, location)) {
			remove (index - 1, locations2);
			remove (index - tableWidth - 1, locations2);
			remove (index + tableWidth - 1, locations2);
		}

		if (inArray (RIGHT, location)) {
			remove (index + 1, locations2);
			remove (index - tableWidth + 1, locations2);
			remove (index + tableWidth + 1, locations2);
		}

		return locations2;
	}

	//	处于角落
	else {
		var locations3 = [];
		locations3.push (index - tableWidth);
		locations3.push (index - tableWidth - 1);
		locations3.push (index - tableWidth + 1);
		locations3.push (index + tableWidth);
		locations3.push (index + tableWidth + 1);
		locations3.push (index + tableWidth - 1);
		locations3.push (index - 1);
		locations3.push (index + 1);

		if (inArray (UP, location) && inArray (LEFT, location)) {
			remove (index - 1, locations3);
			remove (index - tableWidth + 1, locations3);
			remove (index - tableWidth - 1, locations3);
			remove (index - tableWidth, locations3);
			remove (index + tableWidth - 1, locations3);
		}

		if (inArray (DOWN, location) && inArray (LEFT, location)) {
			remove (index - 1, locations3);
			remove (index - tableWidth - 1, locations3);
			remove (index + tableWidth - 1, locations3);
			remove (index + tableWidth, locations3);
			remove (index + tableWidth - 1, locations3);
		}

		if (inArray (UP, location) && inArray (RIGHT, location)) {
			remove (index + 1, locations3);
			remove (index - tableWidth + 1, locations3);
			remove (index - tableWidth - 1, locations3);
			remove (index + tableWidth + 1, locations3);
			remove (index - tableWidth, locations3);
		}

		if (inArray (DOWN, location) && inArray (RIGHT, location)) {
			remove (index + 1, locations3);
			remove (index - tableWidth + 1, locations3);
			remove (index + tableWidth - 1, locations3);
			remove (index + tableWidth + 1, locations3);
			remove (index + tableWidth, locations3);
		}

		return locations3;
	}
};