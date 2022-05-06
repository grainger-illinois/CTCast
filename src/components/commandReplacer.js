function replaceCommands(text, map, marker) {
	let keys = [];
  
	for(const k of map.keys()) {
	    keys.push(k);
	}
	keys.sort((a, b) => b.length - a.length);
	for(let i = 0; i < map.size; i++){
	    if(text.indexOf(marker + keys[i]) > -1) {
		let newText = "";
		while(text !== newText) {
		    newText = text;
		    text = text.replace(marker + keys[i], map.get(keys[i]));
		}
	    }
	}
	return text;
}

module.exports = replaceCommands;
