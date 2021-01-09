import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  FormHelperText,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

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
const VehicleRegistrationView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  localData = getLocalData("newRegistrationData");
  console.log(localData);

  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [showInfoMsg, setShowInfoMsg] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="top"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              licenseNumber: '',
              vehicleLicensePlateNumber: '',
              policy: false,
              email: '',
              fullName: '',
              mobileNumber: '',
              password: '',
              confirmPassword: ''
              
            }}
            validationSchema={Yup.object().shape({
              // email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              // licenseNumber: Yup.string().max(12).required('Enter a valid license number'),
              licenseNumber: Yup.string().max(255).required('License Number is required'),
              policy: Yup.boolean().oneOf([true], 'This field must be checked')
            })}
            onSubmit={(values) => {
              values.email = localData.email;
              values.firstName = localData.firstName;
              values.lastName = localData.lastName;
              values.mobileNumber = localData.mobileNumber;
              values.password = localData.password;
              values.confirmPassword = localData.confirmPassword;
              // axios('http://localhost:5000/addNewRegistration', {
                
                axios('https://95d67cb9b11f.ngrok.io/addNewRegistration', {
                method: 'POST',
                data: values,
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(response => {
                  console.log(response.data);
                  if (response.data.statusCode == 200) {
                    // alert("Successfully Registered, Please Login!");
                    setShowSuccessMsg(true);
                    setShowErrorMsg(false);
                    setShowInfoMsg(false);
                    // navigate('/', { replace: true });
                  }
                  else if (response.data.statusCode == 201){
                    setShowSuccessMsg(false);
                    setShowErrorMsg(false);
                    setShowInfoMsg(true);
                  }
                  else {
                    setShowSuccessMsg(false);
                    setShowErrorMsg(true);
                    setShowInfoMsg(false);
                  }
                })
                .catch(error => {
                    setShowSuccessMsg(false);
                    setShowErrorMsg(true);
                    setShowInfoMsg(false);
                  console.error('There was an error!', error);
                });

            }}
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
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h1"
                  >
                    License and Vehicle Registration
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Fields with * are mandatory
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.licenseNumber && errors.licenseNumber)}
                  fullWidth
                  required
                  helperText={touched.licenseNumber && errors.licenseNumber}
                  label="License number"
                  margin="normal"
                  name="licenseNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.licenseNumber}
                  variant="outlined"
                />
                {/* <TextField
                  error={Boolean(touched.vehicleLicensePlateNumber && errors.vehicleLicensePlateNumber)}
                  fullWidth
                  helperText={touched.vehicleLicensePlateNumber && errors.vehicleLicensePlateNumber}
                  label="vehicle License Plate number"
                  margin="normal"
                  name="vehicleLicensePlateNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.vehicleLicensePlateNumber}
                  variant="outlined"
                /> */}
                <Box
                  alignItems="center"
                  display="flex"
                  ml={-1}
                >
                  <Checkbox
                    checked={values.policy}
                    name="policy"
                    onChange={handleChange}
                  />
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    I have read the
                    {' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                </Box>
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>
                    {errors.policy}
                  </FormHelperText>
                )}
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign Up
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/"
                    variant="h6"
                  >
                    Sign in
                  </Link>
                </Typography>
                {showSuccessMsg ? <Box my={2}>
                  <Alert severity="success">
                    <AlertTitle>Registration is done successfully</AlertTitle>
                    <strong>Please go to the login page</strong>
                  </Alert>
                </Box> : null}
                {showInfoMsg ? <Box my={2}>
                  <Alert severity="info">
                    <AlertTitle>Wrong Info</AlertTitle>
                    {/* <strong>{ticketInfoMessage}</strong> */}
                    <strong>Registration Unsuccessful, license number or email already exists</strong>
                  </Alert>
                </Box> : null}
                {showErrorMsg ? <Box my={2}>
                  <Alert severity="error">
                    <AlertTitle>Wrong Info</AlertTitle>
                    <strong>Try again in sometime</strong>
                  </Alert>
                </Box> : null}
              </form>
              
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default VehicleRegistrationView;
