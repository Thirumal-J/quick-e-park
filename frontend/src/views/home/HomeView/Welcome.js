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
import EmojiEmotionsSharpIcon from '@material-ui/icons/EmojiEmotionsSharp';
import FacebookIcon from 'src/icons/Facebook';
import GoogleIcon from 'src/icons/Google';
import Page from 'src/components/Page';
import phoneimage from 'src/images/phone-map.jpg';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  welcomebar:{
    height:'100%',
    verticalAlign: 'top',
  },
  welcometext: {
    // height: '100%',
    backgroundColor: theme.palette.background.dark,
    verticalAlign: 'top',
    textAlign: 'justify',
    fontStyle: 'italic',
    fontFamily: '-apple-system',
    justifyContent: 'top'
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

const Welcome = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Page
      className={classes.root}
      title="Welcome"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <div className={classes.welcomebar}>
          <div className={classes.welcometext}>
            <h1>Quick-E-Park</h1>
            <h4>An easy online parking website</h4>
            <br></br>
            <p>Quick-E-Park aims at helping the German citizens by easing down challenges in the existing parking ticket system. This project is a web application for online parking ticket system which offers various features such as pay and park online, online parking ticket extension online, parking ticket expiry notifications for both users and checkers and so on.</p>
            <br></br>
            <img src={phoneimage} ></img>
          </div>
          </div>
        </Container>
      </Box>
    </Page>
  );
};

export default Welcome;
