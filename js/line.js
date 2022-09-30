class Line {
	
	constructor(thread, query, time, rows, lineNo) {
		this.thread = thread;
		this.query = query;
		this.time = parseInt(time);
		this.rows = parseInt(rows);
		this.lineNo = lineNo;
	}
}
