import React, { useState } from "react";
import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import { Co2Sharp } from "@mui/icons-material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Box } from "@mui/system";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import Fab from '@mui/material/Fab';




function Shortcuts() {
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
	//const [marker, setMarker] = useState('@');
	const [map, setMap] = useState(new Map());

	const refreshMap = () => {
		window.shortcutMap.getShortcutMap().then((result) => {
			setMap(result);
		});
	}

	refreshMap();

	const [currLongText, setCurrLongText] = useState("");
	const [currShortcut, setCurrShortcut] = useState("");

	const longTextHandler = (event) => {
		setCurrLongText(event.target.value);
	};

	const shortcutHandler = (event) => {
		setCurrShortcut(event.target.value);
	};

	const clearMap = () => {
		window.shortcutMap.clearShortcuts();
		refreshMap();
		console.log(map);
	};

	const fileChangeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	const addPairToMap = () => {
		if (currLongText !== "" && currShortcut !== "") {
			map.set(currShortcut, currLongText);
		}
		// console.log(map);
		window.shortcutMap.sendShortcut(map);

		setCurrLongText('');
		setCurrShortcut('');
	}

	const handleSubmission = () => {
		//console.log(map);
		if (isFilePicked) {
			let reader = new FileReader();

			reader.addEventListener('load', () => {
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
					let words = trimmedLine.split(":");
					for (let i = 0; i < words.length; i++)
						words[i] = words[i].trim();
					words = words.filter(removeEmpty);

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
					map.forEach(function (value) { if (value === word) wordContained = true; });

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

				window.shortcutMap.sendShortcut(map);
				console.log(map);
			});

			reader.readAsText(selectedFile);
		} else alert("Please choose a file!");
	};

	return <div style={{ margin: "20px", marginTop: "30px", display:"flex" }} >
			<Box sx={{flexGrow: '1', marginRight:'20px', height:'auto'}}>
				<Button onClick={() => console.log(map)}>map</Button>
				<h2>Shortcuts</h2>
				<List>
					{Array.from(map, (entry) =>
					<ListItem disablePadding key={entry[0]}>
						<ListItemButton onClick={() => {alert(entry[1])}}>
							<ListItemText>{entry[0]}</ListItemText>
						</ListItemButton>
					</ListItem>)}
				</List>
			</Box>


			<Stack
				sx={{flexGrow: '1'}}
				component="form"
				spacing={2}
				noValidate
				autoComplete="off"
				>
				<h2>Add a shortcut</h2>
				<TextField
					name="Long text"
					variant="outlined"
					label="Long text"
					fullWidth
					value={currLongText}
					onChange={longTextHandler}
				/>
				<TextField
					name="Shortcut"
					variant="outlined"
					label="Shortcut"
					fullWidth
					value={currShortcut}
					onChange={shortcutHandler}
				/>

				<Button variant="outlined" color="primary" onClick={addPairToMap}>Submit Pair</Button>
				<hr />

				<Button variant="outlined" color="warning" onClick={clearMap} endIcon={<ClearAllIcon />}>Clear short cuts</Button>

				<Button variant="outlined" sx={{flexGrow: 1, }} color="primary" endIcon={<InsertDriveFileIcon />} spacing={2}>
					Choose file
					<input type="file" name="file" onChange={fileChangeHandler} style={{ opacity: "0", top: "0", left: "0", width: "100%", height: "100%", position: "absolute" }} />
				</Button>
				{isFilePicked ?
					<Button variant="outlined" color="success" endIcon={<FileUploadIcon />} onClick={handleSubmission}>Upload</Button> :
					<Button variant="outlined" color="success" endIcon={<FileUploadIcon />} onClick={handleSubmission} disabled>Upload</Button>
				}

			<span style={{ textAlign: "center" }}>{isFilePicked ?
				<span>{selectedFile.name}</span> :
				<span></span>
			}</span>
			</Stack>



	</div>

}

export default Shortcuts;
