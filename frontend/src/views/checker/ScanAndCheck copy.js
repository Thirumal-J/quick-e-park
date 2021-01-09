import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { Alert, AlertTitle } from '@material-ui/lab';
import TakePicture from 'src/components/TakePicture';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));
const loginErrorText = ({
  loginError:{
    display:'none'
  }
});
let localData= {};
const getLocalData = (localDataKey) => {
  if (localStorage.getItem(localDataKey) != null){
    localData = JSON.parse(localStorage.getItem(localDataKey));
    return localData;
  }
};
const setLocalData = (localDataKey,localDataValue) => {
    localStorage.setItem(localDataKey, JSON.stringify(localDataValue));
    localData = JSON.parse(localStorage.getItem(localDataKey));
};
const ScanAndCheck = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showLoginError, setShowLoginError] = useState(false);
  localData = getLocalData("loginData")
  // const verfiyLogin = verifyLogin();
  return (
    <Page
      className={classes.root}
      title="ScanAndCheck"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        // justifyContent="center"
      >
        <Container maxWidth="sm">
        <TakePicture/>
        </Container>
      </Box>
    </Page>
  );
};

export default ScanAndCheck;
