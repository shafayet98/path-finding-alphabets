function removeFromArray(arr, elt) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b) {
    // let d = abs(a.i-b.i) + abs(a.j-b.j);
    let d = dist(a.i, a.j, b.i, b.j);
    return d;
}



let wallPositions = []

let cols = 15;
let rows = 15;
let alphabets = ['O', 'L', 'L', 'E', 'H'];

let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let start;
let ends = [];
let end;
let w, h;
let path = [];
let current;
let div;

let alphabetCount = 0;



function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if (random(1) < 0.05) {
        wallPositions.push([this.i, this.j]);
        this.wall = true;
    }

    this.show = function (clr) {
        fill(clr);
        if (this.wall) {
            fill(229, 229, 229);
        }
        noStroke();
        rect(this.i * w, this.j * h, w - 1, h - 1);
    }

    this.showAlphabet = function (grid, txt) {
        if (this.wall == false) {
            console.log(grid);
            textSize(25);
            noStroke();
            fill(255, 214, 10);
            strokeWeight(4);
            text(txt, this.i * w, this.j * h + 20);
        }
    }

    this.addNeighbors = function (grid) {
        let i = this.i;
        let j = this.j;
        if (i < cols - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
        if (i < cols - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1]);
        }
        if (i > 0 && j < rows - 1) {
            this.neighbors.push(grid[i - 1][j + 1]);
        }
        if (i < cols - 1 && j < rows - 1) {
            this.neighbors.push(grid[i + 1][j + 1]);
        }
    }

}

function setup() {

    createCanvas(400, 400);
    w = (width / cols)
    h = (height / rows)

    // take input
    // input = createInput('');
    // input.position(0, 100);


    // making the 2D grid
    // each col will have rows number of row
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    // create each spot
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    // print the wall locations
    // console.log(wallPositions);

    // create neighbors for each spot
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    // initialise the start and end spot
    start = grid[0][0];

    // console.log(alphabets.length);
    ends = [
        [grid[6][11], 'E'],
        [grid[8][7], 'B'],
        [grid[4][14], ' '],
        [grid[4][0], '0'],
        [grid[8][3], 'T'],
        [grid[4][14], ' '],
        [grid[12][6], 'T'],
        [grid[10][12], 'O'],
        [grid[11][14], 'N'],
        [grid[4][14], ' '],
        [grid[3][7], 'R'],
        [grid[0][3], 'O'],
        [grid[4][14], ' '],
        [grid[8][11], 'E'],
        [grid[6][5], 'B'],
        [grid[4][14], ' '],
        [grid[11][12], 'O'],
        [grid[14][14], 'T']
    ]

    
    
    getEnd = ends[4];
    
    end = getEnd[0];
    endText = getEnd[1];
    console.log(endText);
    start.wall = false;
    end.wall = false;
    // end = grid[20][3];
    // push the start in the openSet for the beginning
    openSet.push(start);
    div = createDiv('');
    div.size(600, 100);
    div.html('Writing: ');
    
}

function draw() {

    loop();

    // MAIN ALGORITHM STARTS HERE
    if (openSet.length > 0) {
        // the algo keep going
        // step 01:
        // go to the open set and find spot that has the lowest f score
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }

        current = openSet[winner];

        if (current === end) {
            noLoop();
            getEnd = ends.pop();
            end = getEnd[0];
            endText = getEnd[1];
            console.log(endText);

            // html stuff
            
            div.html(endText, true);
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        // get all the neighbors of current spot
        let neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            // get a single neighbor from the neighbors array
            let eachNeighbor = neighbors[i];

            // check if the neighbor is in the closed set, if not - then you can update the g value
            // not being in the closed set means you have to evaluate that
            if (!closedSet.includes(eachNeighbor) && !eachNeighbor.wall) {
                let tempG = current.g + 1;

                let newPath = false;
                if (openSet.includes(eachNeighbor)) {
                    if (tempG < eachNeighbor.g) {
                        eachNeighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    eachNeighbor.g = tempG;
                    newPath = true;
                    openSet.push(eachNeighbor);
                }

                if (newPath) {
                    eachNeighbor.h = heuristic(eachNeighbor, end);
                    eachNeighbor.f = eachNeighbor.g + eachNeighbor.h;
                    eachNeighbor.previous = current;
                }

            }
        }
    } else {
        // no solution found
    }
    // MAIN ALGORITHM ENDS HERE


    background(255);

    // draw all the spots and grids
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show(color(0));
        }
    }

    for (let i = 0; i < ends.length; i++) {
        getEnd = ends[i];
        end = getEnd[0];
        endText = getEnd[1];

        textSize(20);
        noStroke();
        fill(255, 214, 10);
        strokeWeight(4);
        text(endText, end.i * w + 5, end.j * h + 23);
    }

    // set color for open set
    for (let i = 0; i < openSet.length; i++) {
        openSet[i].show(color(167, 201, 87, 100));
    }

    // // set color for closed set
    for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(188, 71, 73, 100));
    }


    // find the path - each iteration
    path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }
    // show the path - at the end
    for (let i = 0; i < path.length; i++) {
        path[i].show(color(60, 9, 108, 100));
    }
}


// for(let i = 0 ; i < 3; i++){
//     redraw();
// }

function mousePressed() {
    openSet = [];
    closedSet = [];
    openSet.push(start);
    redraw();

}
