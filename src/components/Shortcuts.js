import React, { useState, useEffect, useRef } from "react";
import Button from '@mui/material/Button';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Box } from "@mui/system";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';




function Shortcuts() {


	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
	//const [marker, setMarker] = useState('@');
	const [map, setMap] = useState(new Map());
	
	const didMountRef = useRef(false);

	useEffect(() => {
		const mapJSON = JSON.stringify(Object.fromEntries(map));
		if (didMountRef.current) {
			window.localStorage.setItem("map", mapJSON);
		} else {
			didMountRef.current = true;
		}
	}, [map]);

	useEffect(() => {
		const mapJSON = window.localStorage.getItem("map");
		if (mapJSON && mapJSON != 'undefined') {
			console.log("mapJson", mapJSON, Boolean(mapJSON));
			const localStorageMap = new Map(Object.entries(JSON.parse(mapJSON)));
			setMap(localStorageMap);
			window.shortcutMap.sendShortcut(localStorageMap).then(refreshRemoteMap());
		}
	}, []);

	const refreshRemoteMap = () => {
		window.shortcutMap.getShortcutMap().then((result) => {
			setMap(result);
		});
	}


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
		refreshRemoteMap();
	};

	const fileChangeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	const addPairToMap = () => {
		if (currLongText !== "" && currShortcut !== "") {
			map.set(currShortcut, currLongText);
		}

		window.shortcutMap.sendShortcut(map).then(refreshRemoteMap());

		setCurrLongText('');
		setCurrShortcut('');
	}

	const handleUpload = () => {
		if (isFilePicked) {
			let reader = new FileReader();


			reader.addEventListener('load', async () => {
				const ext = selectedFile.name.split('.').slice(-1)[0];
				// Might have weird filenames that include '.'
				await window.fileExtractionAPI.processFile(
					ext,
					reader.result
					);

				refreshRemoteMap();

			});

			reader.readAsArrayBuffer(selectedFile);
		} else alert("Please choose a file!");
	};

	const ListMap = 
		<Box sx={{flexGrow: '1', marginRight:'20px', height:'auto'}}>
				<h1>Shortcuts</h1>
				<List>
					{Array.from(map, (entry) => {
						if (entry[0] != 'docx' && entry[0] != 'pptx' && entry[0] != 'pdf') {
							return <ListItem disablePadding key={entry[0]}>
										<ListItemButton onClick={() => {alert(entry[1])}}>
											<ListItemText>{entry[0]}</ListItemText>
										</ListItemButton>
									</ListItem>
						}
					})}
				</List>
			</Box>
	

	return <div style={{ margin: "20px", marginTop: "30px", display:"flex" }} >
			
			{ListMap}

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
					<Button variant="outlined" color="success" endIcon={<FileUploadIcon />} onClick={handleUpload}>Upload</Button> :
					<Button variant="outlined" color="success" endIcon={<FileUploadIcon />} onClick={handleUpload} disabled>Upload</Button>
				}

			<span style={{ textAlign: "center" }}>{isFilePicked ?
				<span>{selectedFile.name}</span> :
				<span></span>
			}</span>
			</Stack>



	</div>

}

export default Shortcuts;
