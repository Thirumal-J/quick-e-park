import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import Applogo from "src/images/quick-e-park-logo.jpg"
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const user = {
  avatar: {Applogo},
  fullName: '',
  empId:''
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      justifyContent:"center"
    },
  },
  input: {
    display: 'none',
  },
  avatar: {
    height: 100,
    width: 100
  }
}));

let localData= {};
const getLocalData = (localDataKey) => {
  if (localStorage.getItem(localDataKey) != null){
    return JSON.parse(localStorage.getItem(localDataKey));
  }
};
const setLocalData = (localDataKey,localDataValue) => {
    localStorage.setItem(localDataKey, JSON.stringify(localDataValue));
    localData = JSON.parse(localStorage.getItem(localDataKey));
};

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();
  localData = getLocalData("loginData");
  user.firstName = localData.firstName
  user.empId = localData.empId
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Avatar
            className={classes.avatar}
            src={user.avatar}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {user.firstName}
          </Typography>
          <Typography
            color="primary"
            gutterBottom
            variant="h4"
          >
            Checker ID {user.empId}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <div className={classes.root}>
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Upload
        </Button>
      </label>
      <input accept="image/*" className={classes.input} id="icon-button-file" type="file" />
    </div>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
