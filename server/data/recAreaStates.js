const fs = require('fs');

const data = fs.readFileSync('./finalRecAreaData.json');
const content = JSON.parse(data);
const map = content.map((recArea) => recArea.state);
const set = [...new Set(map)];

fs.writeFile('statesData.json', JSON.stringify(set), (err) => console.log(err));
