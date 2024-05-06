function removeFromArray(arr, elt){
    for(let i = arr.length-1 ; i >= 0 ; i--){
        if (arr[i] == elt){
            arr.splice(i,1);
        }
    }
}

function heuristic(a,b){
    let d = abs(a.i-b.i) + abs(a.j-b.j);
    // let d = dist(a.i, a.j, b.i, b.j);
    return d;
}

let cols = 5;
let rows = 5;
let alphabets = ['A', 'B', 'C', 'D', 'E', 'F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let start;
let end;
let w, h;
let path = [];
let current;

let chosenAlphabet = [];
let countAlphabet = 0;




function Spot(i,j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if (random(1) < 0.3){
        this.wall = true;
    }

    this.show = function(clr){
        fill(clr);
        if(this.wall){
            fill(0);
        }
        noStroke();
        rect(this.i * w, this.j * h, w-1,h-1);
    }

    this.showAlphabet = function(grid){
        if(this.wall == false){
            textSize(20);
            stroke(0);
            fill(0);
            strokeWeight(2);
            text('A', (this.i)*w +cols, (this.j)*h +rows + 20);
        }
    }

    this.addNeighbors = function(grid){
        let i = this.i;
        let j = this.j;
        if (i < cols-1){
            this.neighbors.push(grid[i+1][j]);
        }
        if (i > 0){
            this.neighbors.push(grid[i-1][j]);
        }
        if (j < rows-1){
            this.neighbors.push(grid[i][j+1]);
        }
        if (j > 0){
            this.neighbors.push(grid[i][j-1]); 
        }
    }

}
  
function setup() {

    createCanvas(400,400);
    w = width / cols;
    h = height / rows;


    // making the 2D grid
    // each col will have rows number of row
    for (let i = 0 ; i<cols; i++){
        grid[i] = new Array(rows);
    }

    // create each spot
    for (let i = 0 ; i<cols; i++){
        for(let j = 0 ; j < rows; j++){
            grid[i][j] = new Spot(i,j);
        }
    }

    // create neighbors for each spot
    for (let i = 0 ; i<cols; i++){
        for(let j = 0 ; j < rows; j++){
            grid[i][j].addNeighbors(grid);
        }
    }

    // initialise the start and end spot
    start = grid[0][0];
    end = grid[cols-1][rows-1];
    start.wall = false;
    end.wall = false;
    
    // end = grid[20][3];

    // push the start in the openSet for the beginning
    openSet.push(start);

}

function draw() {

    
    

    // MAIN ALGORITHM STARTS HERE
    if (openSet.length > 0){
        // the algo keep going

        // step 01:
        // go to the open set and find spot that has the lowest f score
        let winner = 0;
        for(let i = 0 ; i < openSet.length ; i++){
            if (openSet[i].f < openSet[winner].f){
                winner = i;
            }
        }

        current = openSet[winner];

        if (current === end){

            noLoop();
            console.log("DONE");
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        // get all the neighbors of current spot
        let neighbors = current.neighbors;
        for(let i = 0 ; i < neighbors.length ; i++){
            // get a single neighbor from the neighbors array
            let eachNeighbor = neighbors[i];

            // check if the neighbor is in the closed set, if not - then you can update the g value
            // not being in the closed set means you have to evaluate that
            if(!closedSet.includes(eachNeighbor) && !eachNeighbor.wall){
                let tempG = current.g + 1;

                if(openSet.includes(eachNeighbor)){
                    if(tempG < eachNeighbor.g){
                        eachNeighbor.g = tempG;
                    }
                }else{
                    eachNeighbor.g = tempG;
                    openSet.push(eachNeighbor);
                }

                eachNeighbor.h = heuristic(eachNeighbor, end);
                eachNeighbor.f = eachNeighbor.g + eachNeighbor.h;
                eachNeighbor.previous = current;


            }

        }

        


    }else{
        // no solution found
    }

    background(0);

    // draw all the spots and grids
    for (let i = 0 ; i<cols; i++){
        for(let j = 0 ; j < rows; j++){
            grid[i][j].show(color(255));
            end.showAlphabet(end);
        }
    }

    

    // set color for open set
    for (let i = 0 ; i<openSet.length; i++){
        openSet[i].show(color(0,255,0,100));
    }

    // // set color for closed set
    for (let i = 0 ; i<closedSet.length; i++){
        closedSet[i].show(color(255,0,0,100));
    }

    
    // find the path - each iteration
    path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
    }
    // show the path - at the end
    for (let i = 0 ; i<path.length; i++){
        path[i].show(color(0,0,255,100));
    }
}