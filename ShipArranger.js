/**
* This Javascript package randomly arranges ships for sea battle game.
*
* Supports:
* - adjustable number of each type of ship
* - adjustable dimensions of board
* - if number of ships is too high or dimensions of board are too small
*   exception will be thrown
* - color scheme for sea, ships and superstructures
* - random orientation of the ships (vertical/horizontal)
*
* @author Mark Rolich <mark.rolich@gmail.com>
*/
var ShipArranger = function (width, height) {
    "use strict";
	var map     = [],
        xh      = height || 10,
        yh      = width || 10,
        init = function () {
            var i = 0,
                j = 0;

            for (i = 0; i < xh; i++) {
                map[i] = [];

                for (j = 0; j < yh; j++) {
                    map[i][j] = 0;
                }
            }
        },
        createShip = function (size) {
            var ship    = [],
                i       = 0,
                dir     = Math.floor(Math.random() * 10) % 2,
                x       = Math.floor(Math.random() * (xh - size + 1)),
                y       = Math.floor(Math.random() * (yh - size + 1));

            for (i; i < size; i++) {
                ship[i] = [];
                ship[i][0] = x;
                ship[i][1] = y;

                if (dir === 0) {
                    x++;
                } else {
                    y++;
                }
            }

            return ship;
        },
        isRegionFree = function (ship) {
            var i       = 0,
                res     = true,
                shipLen = ship.length;

            for (i = 0; i < shipLen; i++) {
                if (map[ship[i][0]][ship[i][1]] !== 0) {
                    res = false;
                }
            }

            return res;
        },
        placeShip = function (ship) {
            var x       = 0,
                y       = 0,
                startX  = ship[0][0],
                startY  = ship[0][1],
                finX    = ship[ship.length - 1][0],
                finY    = ship[ship.length - 1][1];

            for (x = startX - 1; x <= finX + 1; x++) {
                for (y = startY - 1; y <= finY + 1; y++) {
                    if (x >= 0 && y >= 0 && x <= xh - 1 && y <= yh - 1) {
                        map[x][y] = (x >= startX && x <= finX && y >= startY && y <= finY)
                                    ? 1 : 2;
                    }
                }
            }
        };

    this.render = function (map, playerId, colorScheme) {
        var player      = document.getElementById(playerId),
            tbl         = document.createElement('table'),
            tbody       = document.createElement('tbody'),
            colors      = colorScheme || ['#fff', '#ccc', '#fff'],
            row         = null,
            cell        = null,
            cellText    = document.createTextNode('\xA0'),
            i           = 0,
            j           = 0;

        for (i = 0; i < map.length; i++) {

            row = document.createElement('tr');

            for (j = 0; j < map[i].length; j++) {
                cell = document.createElement('td');
                cell.appendChild(cellText);
                cell.style.backgroundColor = colors[map[i][j]];

                row.appendChild(cell);
            }

            tbody.appendChild(row);
        }

        tbl.appendChild(tbody);

        if (player.hasChildNodes()) {
            player.replaceChild(tbl, player.childNodes[0]);
        } else {
            player.appendChild(tbl);
        }
    };

	this.arrange = function (ships) {
		var i           = 0,
            cnt         = 0,
            ship        = [],
            overflow    = 0;

		for (i = 0; i < ships.length; i++) {

			cnt = 0;

			do {
				ship = createShip(ships[i].size);

				if (isRegionFree(ship)) {
					placeShip(ship);
					cnt++;
				}

                overflow++;

                if (overflow > 100) {
                    throw ('The number of ships is too high or dimensions of board are too small');
                }

			} while (cnt < ships[i].cnt);

		}

		return map;
	};

	init();
};