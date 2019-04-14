function Maze(width,height) {
	this.w = width||20;
	this.h = height||this.w;
	this.grid = []; // X=free, 0=path, 1=wall
	this.deltagrid=[]; // example: [72,'1'] => last step was: wall set at position 72
	this.trace=[]; // visited positions (path) that have one or more options to go to
	this.finished=false;
	this.start=new Date();
	this.end=0;
	for (var i=0; i<this.w*this.h; i++) {this.grid[i]='X'} // init maze
	this.setPath(Math.floor(Math.random()*this.w*this.h)); // start at random position
}

Maze.prototype.genstep = function () {
	// stop if there are no more options to draw paths => maze done
	if (!this.trace.length) {
		this.end=new Date();
		if (!this.finished) {alert('Finished! ('+(this.end-this.start)+'ms)')};
		this.finished=true;
		this.deltagrid=[];
		return 0;
	}

	// shuffle trace sometimes to get shorter paths
	if (Math.floor(Math.random()*(this.w+this.h)/8)<1) {shuffle(this.trace)}
	// reset delta-grid-information (nothing has changed so far)
	this.deltagrid=[];
	// resume at latest position
	var p=this.trace.pop();
	// determine possible moves
	var approaches=[];
	var real_approaches_counter=0;
	if (this.isFree([this.top(p)])) {approaches.push('top'); real_approaches_counter++} 
		else if (this.isPath([this.top(p)]) && this.isFree([this.bottom(p)])) {approaches.push('bottom')}; // zikzak avoiding system (make it more likely to not change direction)
	if (this.isFree([this.right(p)])) {approaches.push('right'); real_approaches_counter++}
		else if (this.isPath([this.right(p)]) && this.isFree([this.left(p)])) {approaches.push('left')}; // zikzak avoiding system (make it more likely to not change direction)
	if (this.isFree([this.bottom(p)])) {approaches.push('bottom'); real_approaches_counter++}
		else if (this.isPath([this.bottom(p)]) && this.isFree([this.top(p)])) {approaches.push('top')}; // zikzak avoiding system (make it more likely to not change direction)
	if (this.isFree([this.left(p)])) {approaches.push('left'); real_approaches_counter++}
		else if (this.isPath([this.left(p)]) && this.isFree([this.right(p)])) {approaches.push('right')}; // zikzak avoiding system (make it more likely to not change direction)
	// if there is more than one direction to approach from here, keep this position in trace
	if (real_approaches_counter>1) {this.trace.push(p)}
	// choose an approach
	var approach=approaches[Math.floor(Math.random()*approaches.length)];

	// check all positions that must not be a path in order to move that way (set a path) - else set a wall
	if (approach=='top') {
		if (!this.isPath([this.right(this.top(p)),this.left(this.top(p)),this.top(this.top(p)),this.left(this.top(this.top(p))),this.right(this.top(this.top(p)))])) {
			this.setPath(this.top(p));
		} else {this.setWall(this.top(p))}		
	}
	if (approach=='right') {
		if (!this.isPath([this.bottom(this.right(p)),this.top(this.right(p)),this.right(this.bottom(this.right(p))),this.right(this.top(this.right(p))),this.right(this.right(p))])) {
			this.setPath(this.right(p));
		} else {this.setWall(this.right(p))}		
	}
	if (approach=='bottom') {
		if (!this.isPath([this.right(this.bottom(p)),this.left(this.bottom(p)),this.bottom(this.bottom(p)),this.right(this.bottom(this.bottom(p))),this.left(this.bottom(this.bottom(p)))])) {
			this.setPath(this.bottom(p));
		} else {this.setWall(this.bottom(p))}		
	}
	if (approach=='left') {
		if (!this.isPath([this.left(this.left(p)),this.left(this.left(p)),this.top(this.left(p)),this.bottom(this.left(p)),this.left(this.bottom(this.left(p))),this.left(this.top(this.left(p)))])) {
			this.setPath(this.left(p));
		} else {this.setWall(this.left(p))}		
	}

	return this.grid;
}

Maze.prototype.isPath = function (plist) {return plist.some(function (p) {return this.grid[p]=='0'},this)}
Maze.prototype.isFree = function (plist) {return plist.some(function (p) {return this.grid[p]=='X'},this)}
Maze.prototype.setPath = function (p) {
	this.grid[p]='0';
	this.deltagrid=[p,'0'];
	debug('path:'+p+' trace:'+this.trace);
	this.trace.push(p);
}
Maze.prototype.setWall = function (p) {
	this.grid[p]='1';
	this.deltagrid=[p,'1'];
	debug('wall:'+p+' trace:'+this.trace);
}

Maze.prototype.top = function (p) {return (p<this.w*(this.h-1))?(p+this.w):undefined}
Maze.prototype.right = function (p) {return (p%this.w!=this.w-1)?(p+1):undefined}
Maze.prototype.bottom = function (p) {return (p>=this.w)?(p-this.w):undefined}
Maze.prototype.left = function (p) {return (p%this.w!=0)?(p-1):undefined}

function alert(a) {console.log(a)}
function debug(d) {}//{console.log(d)}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}