# create-fungi-image-dataset
A script to create an image dataset from a GBIF download for training models

## Dependencies
[Node.js >= v8.9.4](https://nodejs.org/en/)

## Usage

1. Create a GBIF download of the Danish Fungal Atlas records containing images: https://www.gbif.org/occurrence/download?dataset_key=84d26682-f762-11e1-a439-00145eb45e9a&media_type=StillImage

2. The download will be named something like 0001512-200221144449610.zip - place it next to the file `parse.js` rename the archive to data.zip and unzip it. You should now have a directory named `data` containing files `verbatim.txt` and `multimedia.txt`

3. Run the script: `node parse.js`

This will produce the file `parsed.txt` tab delimited with 3 colums: `taxonID` (original fungal atlas id), `scientificName` (the species name) and `identifier` (the original URI of the image).
