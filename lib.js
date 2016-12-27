// -----------------------------------------------------------------------------
// Inspired from Numberphile.  https://www.youtube.com/watch?v=iFuR97YcSLM
// Author:  Butch Wesley
//
// Creates an Ulam spiral of the specified size and starting point.  It knows
// the first 10,000 primes which are hardcoded in primes.js.
// -----------------------------------------------------------------------------

function doIt(){
	size = parseInt(document.getElementById('txtSize').value)
	start = parseInt(document.getElementById('txtStart').value)
	console.log(size + '::' + start)

	var a = new UlamSpiralMaker(size, start)
}


class UlamSpiralMaker {
	constructor(size, start) {
		this.size = size;
		// Dang thing only works with odd numbers and I'm tired of trying to
		// understand why.  So we just always use the next highest odd.
		if(size % 2 == 0){
			this.size ++
		}
		this.start = start;
		this.center = (this.size -1) / 2
		this.filler = '..'

		this.primes = getPrimes()
		console.log(this.primes)
		this.createTable(this.size)
		this.fillTable()
	}

	createTable(size) {
			var body = document.getElementById("workArea");
			this.tbl     = document.createElement("table");
			var tblBody = document.createElement("tbody");

			for (var j = 0; j <= size; j++) {
				var row = document.createElement("tr");

				for (var i = 0; i < size; i++) {
					var cell = document.createElement("td");
					cell.innerHTML = this.filler
					cell.align="center"
					row.appendChild(cell);
				}
				tblBody.appendChild(row);
			}

			this.tbl.appendChild(tblBody);
			body.appendChild(this.tbl);
			this.tbl.setAttribute("border", "1px");
			this.tbl.setAttribute("border-spacing", "0px");
			this.tbl.setAttribute('border-collapse', 'separate');
			this.tbl.setAttribute('cellpadding', '0');
			this.tbl.setAttribute('cellspacing', '0');
	}

	// Checks a cell from x/y coordinates to see if it is a prime and then formats
	// the cell if it is.  Note that this is x and y and not row and cell.
	formatPrime(x, y){
		var cell = this.tbl.rows[y].cells[x]
		if(this.primes.includes(parseInt(cell.innerHTML))){
			cell.style.backgroundColor = "blue"
			cell.style.color = "white"
		}
	}
	// This method does a leg of the spiral.  The direction of the leg is
	// determined by the x and y values which are used to move from the starting
	// location.  x and y should be either 0, -1, 1 and only one of them should
	// be non-zero.
	//
	// loc is incremented by x and y until it runs into an "inner square" aligned
	// with the current square that does not have anything in it.  For example,
	// while traversing upwards (x = 0, y = -1) this method will continue to populate
	// numbers until it populates a cell that has an adjacent cell to its left
	// that contains nothing.
	//
	// The loc variable is updated as this method traverses around the table and
	// the last value that was popluated is returned.
	leg(loc, x, y, start_val){
		var cur_val = start_val
		var stop = false
		var check_loc = []
		while(!stop){
			loc[0] += x
			loc[1] += y

			// I'm sure there is a mathish way to do this.  I'm just lazy right now.
			// This sets up the cell coordinates to look at for an empty spot.
			if(y == -1){
				check_loc[0] = loc[0] - 1
				check_loc[1] = loc[1]
			}else if (x == -1) {
				check_loc[0] = loc[0]
				check_loc[1] = loc[1] + 1
			}else if (y == 1){
				check_loc[0] = loc[0] + 1
				check_loc[1] = loc[1]
			}else{
				check_loc[0] = loc[0]
				check_loc[1] = loc[1] - 1
			}

			cur_val += 1
			if(this.tbl.rows.length - 1 < loc[1] || this.tbl.rows[loc[1]].cells.length - 1 < loc[0]){
				throw new RangeError("outta room")
			}
			this.tbl.rows[loc[1]].cells[loc[0]].innerHTML = cur_val
			// give a faint crosshair so we can find the center on larger blocks.
			if(loc[0] == this.center || loc[1] == this.center){
				this.tbl.rows[loc[1]].cells[loc[0]].style.backgroundColor = "#DDDDDD"
			}
			this.formatPrime(loc[0], loc[1])
			stop = this.tbl.rows[check_loc[1]].cells[check_loc[0]].innerHTML == this.filler
		}

		return cur_val
	}

	fillTable(){
		var spiral = 2

		// This is initialized so it works for the first call to leg (one to the
		// right and down one).
		var here = [this.center + 1, this.center + 1]

		// format starting point
		var center_cell = this.tbl.rows[this.center].cells[this.center]
		center_cell.innerHTML = this.start
		center_cell.style.backgroundColor = "grey"
		this.formatPrime(this.center, this.center)

		// regardless of prime, still want it to be yellow
		center_cell.style.color = "cyan"

		var val = this.start

		// leg will throw a RangeError when it runs out of room to fill in
		// the numbers.  This is hackish but almost elegant.
		try {
			while(true){
				// up
				val = this.leg(here, 0, -1, val)
				// left
				val = this.leg(here, -1, 0, val)
				// down
				val = this.leg(here, 0, 1, val)
				// right
				val = this.leg(here, 1, 0, val)
			}
		}catch(e){
			if(e instanceof RangeError){
				//do nothing
			}else{
				throw e
			}
		}
	}
}
