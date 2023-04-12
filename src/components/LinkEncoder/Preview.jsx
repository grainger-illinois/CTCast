import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import PropTypes from 'prop-types';

function PreviewDialog(props) {
    const { onClose, contents, open } = props;

    return (
        <Dialog onClose={onClose} open={open} scroll={'paper'} >
            <DialogTitle>Preview</DialogTitle>
            <DialogContent dividers='true'>
                <DialogContentText id="alert-dialog-description" sx={{overflowWrap:'break-word'}} >
                    {contents}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}

PreviewDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    contents: PropTypes.string.isRequired,
}

export default PreviewDialog;