import React from 'react'
import PropTypes from 'prop-types';
import { Box } from "@mui/system";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function ListMap(props) {
    return (
        <Box sx={{ flexGrow: '1', marginRight: '20px', height: 'auto' }}>
            <h1>Shortcuts</h1>
            <List>
                {Array.from(props.map, (entry) => {
                    if (entry[0] != 'docx' && entry[0] != 'pptx' && entry[0] != 'pdf') {
                        return (
                            <ListItem disablePadding key={entry[0]}>
                                <ListItemButton onClick={() => { alert(entry[1]) }}>
                                    <ListItemText>{entry[0]}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        )
                    }
                })}
            </List>
        </Box>
    );
}

ListMap.propTypes = {
    map: PropTypes.object,
}

export default ListMap;