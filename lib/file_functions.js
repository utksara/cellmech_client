const req = require("fs");

const fs = req

let file_db_location = './db/';

const get_file_text = function(filename, some_function ) {
    try {
        let rel_file_path = file_db_location + filename;
        const data = fs.readFileSync(rel_file_path, 'utf8');
        console.log(data);
        some_function(data);
      } catch (err) {
        console.error(err)
      }      
}

module.exports ={
    get_file_text
}