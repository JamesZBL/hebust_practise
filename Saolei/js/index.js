/**
 * 扫雷
 * 游戏逻辑及 DOM 控制
 *
 * @author 郑保乐
 * @date 2018-06-06
 */

// 表格
table = $ ('#table');
// 所有单元格
cells = $ ('td');
// 预设有雷的位置
//mined = [0, 1, 2, 3, 4];
mined = [];

$ (function () {
	initTable ();
});


/**
 * 初始化表格
 */
initTable = function () {
	$.each (cells, function (index, cell) {
		// 绑定点击事件
		$ (cell).on ('click', function () {
			// 判断是否有雷
			var cellIndex = $ (cells).index ($ (this));
			console.log (cellIndex);
			if (-1 != $.inArray (cellIndex, mined)) {
				// 游戏结束
				explode ();
				setTimeout (function () {
					alert ('呵呵，你输了！');
				}, 500);

			} else {
				$ (this).addClass ('nomine');
				var count = mineCount (cellIndex);
				$ (this).html (count);
			}
		})
	})
};

/**
 * 被雷炸到，游戏结束
 */
explode = function () {
	$.each (cells, function (index, cell) {
		if (-1 != $.inArray (index, mined)) {
			$ (this).addClass ('mine');
		}
	});
};

/**
 * 判定某个位置周围有多少雷
 * @param index
 */
mineCount = function (index) {
	return 0;
};

