const fs = require("fs");
const parse = require("csv-parse");
const transform = require("stream-transform");

const parseCsv = async () => {
  const occparser = parse({
    delimiter: "\t",
    columns: true,
    ltrim: true,
    rtrim: true,
    quote: null
  });

  const imgparser = parse({
    delimiter: "\t",
    columns: true,
    ltrim: true,
    rtrim: true,
    quote: null
  });

  let occMap = new Map();

  occparser.on("readable", function() {
    let record;
    while ((record = this.read())) {
      //Only use data identified to species or variety to avoid mixed categories
      if(['sp.', 'var.'].includes(record.taxonRank)){
        occMap.set(record.gbifID, {
          scientificName: record.scientificName,
          taxonID: record.taxonID
        });
      }
      
    }
  });

  const imgTransformer = transform(
    function(record, callback) {
      if (occMap.has(record.gbifID)) {
        const occ = occMap.get(record.gbifID);
        callback(
          null,
          `${occ.taxonID}\t${occ.scientificName}\t${record.identifier}\n`
        );
      } else {
        callback(null, "");
      }
    },
    {
      parallel: 5
    }
  );

  const occReadStream = fs.createReadStream(__dirname + `/data/verbatim.txt`);
  occReadStream.pipe(occparser).on("end", function() {
    const imgReadStream = fs.createReadStream(
      __dirname + `/data/multimedia.txt`
    );
    imgReadStream
      .pipe(imgparser)
      .pipe(imgTransformer)
      .pipe(fs.createWriteStream(__dirname + `/parsed.txt`));
  });
};

parseCsv();
