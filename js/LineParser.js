function getContentFromLog(fileName,lines, logType='ALL'){

        console.log("getContentFromLog:" + fileName +"-" + logType);
		let i = 0;
		let  lineList1 = [ ];
		let  forkThread = [ ];
		let contentHTML = "";
		let deleteBtn = "&nbsp;&nbsp;<small><button type='button' class='btn btn-sm btn-danger pull-right' onclick='deleteLog()'>Delete</button></small>";
		contentHTML +=(
				"<h3>Report - " + fileName +  deleteBtn +"</h3>\n");

		
		
		let totalRows = 0;
		let totalTime = 0;
		let totalNonThreadRows = 0;
		let totalNonThreadTime = 0;
		let totalThreadRows = 0;
		let totalThreadTime = 0;
		let tbodyContent="";
		for (let line1 of lines) {
            if (logType == 'QUERIES_EXECUTED' && line1.indexOf("DEBUG  org.hibernate.stat.internal.StatisticsImpl.queryExecuted - HHH000117: HQL:") !=-1) {
				i++;
				let thread = line1.substring(1, line1.indexOf(",") - 1);
				line1 = line1.substring(line1.indexOf("HQL:") + 4);

				let timeIndex = line1.lastIndexOf("time:");
				let rowIndex = line1.indexOf("rows");
				let query = line1.substring(0, timeIndex - 2);
				let time = line1.substring(timeIndex + 6, rowIndex - 4);
				let rows = line1.substring(rowIndex + 6);
				totalTime += parseInt(time);
				totalRows += parseInt(rows);
				let timelet = parseInt(time);
				if (thread.indexOf("ForkJoinPool") != -1) {
					totalThreadTime += parseInt(time);
					totalThreadRows += parseInt(rows);

				} else {
					totalNonThreadTime += parseInt(time);
					totalNonThreadRows += parseInt(rows);
				}
				// System.out.println("|"+i + "|" + query + "|" + time +"|" +rows +"|");
				if (timelet > 10000) {
					tbodyContent +=("<tr style='background-color:red;color:white'>");
				} else if (timelet > 1000) {
					tbodyContent +=("<tr style='background-color:orange'>");
				} else {
					tbodyContent +=("<tr>");
				}
				tbodyContent +=("<td>" + i + "</td><td>" + thread + "</td><td><textarea cols=100 rows=1 readonly>"
						+ query + "</textarea></td><td>" + rows + "</td>");

				tbodyContent +=("<td>" + time + "</td></tr>");
				let lineObj = new Line(thread, query, time, rows, i);
				lineList1.push(lineObj);
//					break;
			}

		}


		let tableSummary = "<h5>Summary</h5>";
		tableSummary += "<table class='table table-bordered'><thead><tr><th>Thread</th><th>Rows</th><th>Time</th><th>% Time</th></tr></thead><tbody>";
		

		let mainThreadPercentage = (100*totalNonThreadTime/totalTime).toFixed(0);
		let forkThreadPercentage = (100*totalThreadTime/totalTime).toFixed(0);
		tableSummary +=("<tr><th> Main Thread </th><th>" + totalNonThreadRows + " Rows </th><th>"
				+ toTime(totalNonThreadTime)  + "</th><th>" + mainThreadPercentage + "%</th></tr>");
                
		/*Map<String, let > collect = lineList1.stream().filter(l -> l.thread.contains("ForkJoinPool"))
				.collect(Collectors.groupingBy(Line::getThread));
		for (let thread : collect.keys()) {
			let  threadLines = collect.get(thread);
			let totalRowsThread = 0;
			let totalTimeThread = 0;
			for (Line line : threadLines) {
				totalRowsThread += line.rows;
				totalTimeThread += line.time;
			}
			content +=("<tr><td colspan='3' align='center' > " + thread + "</td><td>" + totalRowsThread
					+ " Rows </td><td>" + toTime(totalTimeThread) +"</td></tr>");
		}
*/
		tableSummary +=("<tr><th> ForkJoin Thread Total</th><th>" + totalThreadRows + " Rows </th><th>"
				+ toTime(totalThreadTime) + "</th><th>"+ forkThreadPercentage + "%</th></tr>");
				
		tableSummary +=("<tr><th> Total </th><th>" + totalRows + " Rows </th><th>" + toTime(totalTime)
				+ "</th></tr>");

		tableSummary +=("</tbody></table>");

		let queryTable = ("<h5>Logs</h5><table class='table table-bordered'>\n<tr><th>Sno</th><th>Thread</th><th>Query</th><th>Rows</th><th>Time(ms)</th></tr><tbody>");
		queryTable+=tbodyContent;
		queryTable +=("</tbody></table>");

		contentHTML += tableSummary + queryTable;

		
		

/*
		content +=("<h3>Queries( called more than one time )</th>");
		content +=(
				"<table border='1'><thead><th>Sno</th><th>Query</th><th>Times</th><th>Rows</th><th>Time</th></tr></thead><tbody>");
		Map<String, let > queries = lineList1.stream().collect(Collectors.groupingBy(Line::getQuery));
		let z = 0;
		for (let query : queries.keySet()) {
			let  threadLines = queries.get(query);
			if (threadLines.size() > 1) {
				z++;
				let totalRowsThread = 0;
				let totalTimeThread = 0;
				for (Line line : threadLines) {
					totalRowsThread += line.rows;
					totalTimeThread += line.time;
				}

				content +=("<tr><td>" + z + "</td><td><textarea cols='140' rows=1> " + query
						+ "</textarea></td><td>" + threadLines.size() + "</td><td>" + totalRowsThread + "</td><td>"
						+ toTime(totalTimeThread) + "</td></tr>");
			}
		}

		content +=("</tbody></table>");*/
		

        return contentHTML;
    }
	

    function toTime(time) {
		if (time > 1000) {
			let seconds = time / 1000;
			if (seconds > 60) {
				let minutes = seconds / 60;
				seconds = seconds % 60;
				return "" + minutes.toFixed(0) + " m " + seconds.toFixed(1) + " s";
			} else {
				return "    " + seconds .toFixed(1)+ " s";
			}
		}
		else {
			let seconds = time/1000;
			return "    " + seconds.toFixed(1) + " s";
		}
	}
