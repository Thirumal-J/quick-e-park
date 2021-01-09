import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Page from 'src/components/Page';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  Container,
  Link,
  Typography
} from '@material-ui/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles(() => ({
  root: {}
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
const ProfileDetails = ({ className, ...rest }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  localData = getLocalData("loginData");

  const [showUpdateError, setShowUpdateError] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
      // justifyContent="center"
      >
        <Container maxWidth="md">
          <Formik
            initialValues={{
              firstName: localData.firstName,
              lastName: localData.lastName,
              licenseNumber: localData.licenseNumber,
              // email: localData.email,
              email:"thirumal1206@gmail.com",
              mobileNumber: localData.mobileNumber
            }}
            validationSchema={Yup.object().shape({
              // email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
            })}
            onSubmit={values => {
              console.log(values);
              // axios('http://localhost:5000/updateProfile', {
                axios('https://95d67cb9b11f.ngrok.io/updateProfileData',{
                method: 'POST',
                data: values,
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              })
                .then(response => {
                  console.log(response.data);
                  if (response.data.statusCode == 200) {
                    setShowUpdateError(false);
                    setShowUpdateMessage(true);
                    setMessage(response.data.statusDesc);
                    // setLocalData("loginData", response.data.data);
                    // console.log("Login Page after api call--->", localData);
                    // navigate('/app/home');

                  }
                  else {
                    // setShowLoginError(true);
                    setShowUpdateError(true);
                    setShowUpdateMessage(false);
                    setMessage(response.data.statusDesc);
                    // console.log(values)
                  }
                })
                .catch(error => {
                  // this({ errorMessage: error.message });
                  console.error('There was an error!', error);
                });
              // }

            }
            }
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader
                    subheader="The information can be edited"
                    title="Profile"
                  />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={6}
                    >
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          helperText="Your first name"
                          label="First name"
                          name="firstName"
                          onChange={handleChange}
                          value={values.firstName}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          helperText="Your last name"
                          label="Last name"
                          name="lastName"
                          onChange={handleChange}
                          value={values.lastName}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          disabled
                          label="License number"
                          name="licenseNumber"
                          onChange={handleChange}
                          required
                          value={values.licenseNumber}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.email && errors.email)}
                          // fullWidth
                          disabled
                          required
                          helperText={touched.email && errors.email}
                          label="Email Address"
                          margin="normal"
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="email"
                          value={values.email}
                          variant="outlined"
                        />

                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          fullWidth
                          label="Mobile Number"
                          name="mobileNumber"
                          onChange={handleChange}
                          // type="number"
                          value={values.mobileNumber}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <Box my={2}>
                          <Button
                            color="primary"
                            // disabled={isSubmitting}
                            // fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            name="updateProfile"

                          >
                            Update Profile
                          </Button>
                        </Box>
                      </Grid>
                      <Divider />

                      {showUpdateMessage ? <Container maxWidth="sm">
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <div className="Update Success">
                          <Alert severity="success">
                            <AlertTitle>Updated Successfully</AlertTitle>
                            <strong>{message}</strong>
                          </Alert>
                        </div>
                        </Grid>
                      </Container> : null}
                      {showUpdateError ? <Container maxWidth="sm">
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <div className="Update Error">
                          <Alert severity="error">
                            <AlertTitle>Update Error</AlertTitle>
                            <strong>{message}</strong>
                          </Alert>
                        </div>
                        </Grid>
                      </Container> : null}
                    </Grid>
                  </CardContent>
                </Card>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
