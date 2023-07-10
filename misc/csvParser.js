const fs = require("fs");
const csv = require("csv-parser");

function readCSVBuffer(buffer) {
  const rows = [];

  const readableStream = require("stream").Readable;
  const stream = new readableStream();
  stream.push(buffer);
  stream.push(null);

  stream
    .pipe(csv())
    .on("data", (row) => {
      const { username, email, password } = row;
      if (username && email && password) {
        rows.push({ username, email, password });
      } else {
        console.log(`Invalid row: ${JSON.stringify(row)}`);
      }
    })
    .on("end", () => {
      console.log(rows);
    });
}

// Usage
readCSVBuffer("misc/Book1.csv");
