import React, { useState } from "react";
import Button from 'react-bootstrap/Button';

function UploadFiles() {

	function replaceCommands(text, map, marker) {
		let keys = [];

		for (const k of map.keys()) {
			keys.push(k);
		}
		keys.sort((a, b) => b.length - a.length);
		console.log(keys);
		for (let i = 0; i < map.size; i++) {
			if (text.indexOf(marker + keys[i]) > -1) {
				let newText = "";
				while (text !== newText) {
					newText = text;
					text = text.replace(marker + keys[i], map.get(keys[i]));
				}
			}
		}
		return text;
	}


	function removeEmpty(word) {
		return word != '';
	}

	function findSuffix(word, map, len) {
		let suffLength = len - word.length;
		for (let i = 1; i < Math.pow(10, suffLength); i++) {
			if (map.get(word + i) == undefined) {
				return word + i;
			}
		}
		return null;
	}

	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
	const [marker, setMarker] = useState('@');
	const [map, setMap] = useState(new Map());

	const [currLongText, setCurrLongText] = useState("");
	const [currShortcut, setCurrShortcut] = useState("");

	const longTextHandler = (event) => {
		setCurrLongText(event.target.value);
	};

	const shortcutHandler = (event) => {
		setCurrShortcut(event.target.value);
	};

	const clearMap = (event) => {
		map.clear();
	};

	const fileChangeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	const addPairToMap = () => {
		if (currLongText !== "" && currShortcut !== "") {
			map.set(currShortcut, currLongText);
		}
		console.log(map);
	}

	const handleSubmission = () => {
		if (isFilePicked) {
			//console.log(map);
			let reader = new FileReader();

			reader.addEventListener('load', (e) => {
				let content = reader.result;

				let lines = content.split("\n");

				lines = lines.filter(removeEmpty);

				let unmatched = [];
				let malformedArgs = false;

				for (let line of lines) {
					let trimmedLine = line.trim();
					if (trimmedLine.indexOf(":") === 0) {
						malformedArgs = true;
						continue;
					}
					let words = trimmedLine.split(":").filter(removeEmpty);

					if (words.length == 1) {
						unmatched.push(words[0]);
					}
					else if (words.length == 2) {
						if (map.get(words[1]) != undefined) {
							malformedArgs = true;
							continue;
						}
						else {
							map.set(words[1], words[0]);
						}
					}
					else {
						malformedArgs = true;
					}
				}
				if (malformedArgs) {
					//alert("There were malformed or repeated arguments that have not been applied. Please review the short cuts list and make sure the short cuts you are expecting are there.");
				}

				for (let word of unmatched) {
					let wordContained = false;
					map.forEach(function (value, key) { if (value === word) wordContained = true; });

					if (wordContained)
						continue;

					let w = word.toLowerCase();
					if (map.get(w.charAt(0)) == undefined) {
						map.set(w.charAt(0), word)
						continue;
					}

					if (w.length > 1) {
						if (map.get(w.charAt(0) + w.charAt(1)) == undefined) {
							map.set(w.charAt(0) + w.charAt(1), word);
							continue;
						}
						let mapping = findSuffix((w.charAt(0) + w.charAt(1)), map, 4);
						if (mapping == null)
							continue;
						else {
							map.set(mapping, word);
							continue;
						}
					}

					else {
						let mapping = findSuffix((w.charAt(0)), map, 4);
						if (mapping == null)
							continue;
						else {
							map.set(mapping, word);
							continue;
						}
					}
				}
				console.log(map);
			});

			reader.readAsText(selectedFile);
		} else alert("Please choose a file!");
	};

	return <div style={{ margin: "20px", marginTop: "30px" }}>
		<h1 style={{ textAlign: "left" }}>File Upload</h1>
		<h2 style={{ textAlign: "center" }}>Upload Shortcuts file</h2>
		<br />
		<input type="file" name="file" onChange={fileChangeHandler} />
		<button onClick={handleSubmission}>Submit</button>
		<br />
		<br />
		<h2 style={{ textAlign: "center" }}>Add individual shortcuts:</h2>
		<input type="text" placeholder="Long text" name="String" onChange={longTextHandler} />
		<br />
		<input type="text" placeholder="Shortcut" name="Shortcut" onChange={shortcutHandler} />
		<button onClick={addPairToMap}>Click</button>
		<br />
		<h2 style={{ textAlign: "center" }}>Click this button to clear the short cuts:</h2>
		<button onClick={clearMap}>Click</button>
	</div>

}

export default UploadFiles;
