import React from 'react';
import ReactDOM from 'react-dom';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Select,
  InputLabel,
  FormControl,
  NativeSelect,
  Typography,
  makeStyles
} from '@material-ui/core';
import FacebookIcon from 'src/icons/Facebook';
import GoogleIcon from 'src/icons/Google';
import Page from 'src/components/Page';
import welcomesidebarimage from 'src/images/parkschein.jpg'
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  sidebar: {

  }
}));


let localData = {};
const getLocalData = (localDataKey) => {
  if (localStorage.getItem(localDataKey) != null) {
    return JSON.parse(localStorage.getItem(localDataKey));
  }
};

const setLocalData = (localDataKey, localDataValue) => {
  localStorage.setItem(localDataKey, JSON.stringify(localDataValue));
  localData = JSON.parse(localStorage.getItem(localDataKey));
};

const ActiveTicket = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Page
      className={classes.root}
      title="Welcome Side Bar"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
      // justifyContent="right"
      >
        <Container maxWidth="sm">
          <div className="sidebar">
            {/* <div className={classes.highlight}> */}
              <h2>No need for any app download !!</h2><br></br>
              <h2>Login from anywhere using any device!</h2>
              <br></br>
            {/* </div> */}
            <img src={welcomesidebarimage}></img>
          </div>
        </Container>
      </Box>
    </Page>
  );
};

export default ActiveTicket;
