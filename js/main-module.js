app = window.angular.module("universumApp", [/*'ngAnimate'*/]);
app.controller('universumController', ['$scope', controller]);

// Контроллер
function controller($scope)
{
	window.scope = $scope;
	$scope.fields = [];
	$scope.score1 = 3;
	$scope.score2 = 5;
	$scope.currentPosition = 0;
	$scope.currentField = { id: 0 };
	$scope.currentText = 'Какой-то текст';
	$scope.pack = [
		{
			id: 6,
			title: 'Ресурсы',
			class: 'resource'
		},
		{
			id: 3,
			title: 'Эмоции',
			class: 'emotion'
		},
		{
			id: 7,
			title: 'Действия',
			class: 'action'
		},
		{
			id: 1,
			title: 'Убеждения',
			class: 'credo'
		},
		{
			id: 5,
			title: 'Качества',
			class: 'quality'
		},
		{
			id: 2,
			title: 'Вопросы',
			class: 'question'
		},
		{
			id: 4,
			title: 'Идеи',
			class: 'idea'
		}
	];

	calc();

	$scope.sartStep = function ()
	{
		$scope.stepInProgress = true;
		setTimeout(() =>
		{
			clearInterval($scope.interval);
			const newId = Math.min($scope.currentField.id + $scope.score1 + $scope.score2, 100);
			$scope.currentField = $scope.fields.find(w => w.id == newId);
			const pack = $scope.pack.find(w => w.id == $scope.currentField.type);
			$scope.currentText = 'Какой-то текст из колоды "' + pack.title + '"';
			$scope.stepInProgress = false;
			$scope.$apply();
		},
			5000);
		$scope.interval = setInterval(() =>
		{
			$scope.score1 = Math.floor(Math.random() * (7 - 1) + 1);
			$scope.score2 = Math.floor(Math.random() * (7 - 1) + 1);
		}, 5);
	}

	$scope.isShowCubePoints = function (index)
	{
		const value = $scope['score' + index];
		switch (value)
		{
			case 1:
				return { center: true };
			case 2:
				return { topLeft: true, bottomRight: true };
			case 3:
				return { topLeft: true, center: true, bottomRight: true };
			case 4:
				return { topLeft: true, bottomLeft: true, topRight: true, bottomRight: true };
			case 5:
				return { topLeft: true, bottomLeft: true, center: true, topRight: true, bottomRight: true };
			case 6:
				return { topLeft: true, centerLeft: true, bottomLeft: true, topRight: true, centerRight: true, bottomRight: true };
		}
		return {};
	}

	function calc()
	{
		const offsetX = 415;
		const offsetY = 404;
		const dSafe = 90;
		const a = -0.275 * dSafe;
		for (const direction of [-1, 1])
		{
			let _x = 55 * direction;
			let _y = 55 * direction;
			let _xx = _x;
			let _yy = _y;
			const color = { r: 255, g: 0, b: 0 };

			for (let _i = 0; _i < 51; ++_i)
			{
				const id = direction > 0 ? (50 - _i) : 50 + _i + 1;
				const type = ((id - 1) % 7 + 1);
				const iconClass = 'field-image ' + ' p' + type;
				$scope.fields.push({
					id: id,
					type: type,
					x: _xx,
					y: -_yy,
					containerClass: 'circle',
					iconClass: iconClass,
					color: Object.assign({}, color)
				});

				if (_i < 11)
					color.g += 23;
				if (_i >= 11 && _i < 22)
					color.r -= 23;
				if (_i >= 22 && _i < 33)
				{
					color.g -= 23;
					color.b += 23;
				}

				if (_i >= 33 && _i < 44)
				{
					color.r += 23;
					color.b += 23;
				}

				const r = Math.sqrt(_x * _x + _y * _y);
				const tx = a * _x + r * _y;
				const ty = a * _y - r * _x;
				const tLen = Math.sqrt(tx * tx + ty * ty);
				const k = dSafe / tLen;
				_x += tx * k;
				_y += ty * k;
				_xx = (_i < 47) ? _x : _xx + 20 * direction;
				_yy = _y;
				if (_i == 47) _yy = _y + 5 * direction;
				if (_i == 48) _yy = _y + 20 * direction;
				if (_i == 49) _yy = _y + 30 * direction;
			}

		}
		$scope.fields.sort((aa, bb) => aa.id - bb.id);

		const length = $scope.fields.length;
		for (let _index = 1; _index <= length; _index++)
		{
			const current = $scope.fields[_index - 1];
			const isRep = (current.id == 50 || current.id == 101);
			const next = $scope.fields[isRep ? _index - 2 : _index % length];
			const ang = angle(next.x - current.x, next.y - current.y);
			current.angle = (90 - ang) + (isRep ? 180 : 0);
			if (isRep || current.id == 0 || current.id == 100)
				current.containerClass += ' first';

			current.style = {
				left: current.x + offsetX + 'px',
				top: -current.y + offsetY + 'px',
				transform: 'rotate(' + current.angle + 'deg)',
				background: 'radial-gradient(white, rgb(' + current.color.r + ',' + current.color.g + ',' + current.color.b + '))'
			}
			if (current.id == 0 || current.id == 101)
			{
				current.containerClass = 'rocket';
				current.style.background = undefined;
			}

		}

	}

	function angle(x, y)
	{
		const lenL = Math.hypot(x, y);
		const dot = 1 * x + 0 * y;
		const cos = dot / (1 * lenL);
		const res = Math.acos(cos) * 180 / Math.PI;
		if (y > 0)
			return res;
		return - res;
	}
}
