import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
  makeStyles,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid
} from '@material-ui/core';
import Page from 'src/components/Page';
import { Alert, AlertTitle } from '@material-ui/lab';
// import { values } from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
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

const UpdatePassword = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  localData = getLocalData("loginData");
  const [showUpdateError, setShowUpdateError] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <Page
      className={classes.root}
      title="Register"
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
              email: localData.email,
              password: '',
              confirmPassword: ''
            }}
            validationSchema={
              Yup.object().shape({
                password: Yup.string().max(255).required('password is required'),
                confirmPassword: Yup.string().required().label('Confirm Password').test('passwords-match', 'Both Passwords should match', function (value) {
                  return this.parent.password === value;
                }),
              })
            }
            onSubmit={values => {
              axios('http://localhost:5000/updateNewPassword', {
                method: 'POST',
                data: values,
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(response => {
                  console.log(response.data);
                  if (response.data.status_code == 200) {
                    setShowUpdateError(false);
                    setShowUpdateMessage(true);
                    setMessage(response.data.statusDesc);
                    // this.props.history.push({'pathname':'/dashboard',state:this.state});			
                  }
                  else {
                    setShowUpdateError(true);
                    setShowUpdateMessage(false);
                    setMessage(response.data.statusDesc);
                  }
                })
                .catch(error => {
                  // this({ errorMessage: error.message });
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
                <Card>
                  <CardHeader
                    subheader="You can update your password here"
                    title="Update New Password"
                  />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.password && errors.password)}
                          fullWidth
                          required
                          helperText={touched.password && errors.password}
                          label="Password"
                          margin="normal"
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="password"
                          value={values.password}
                          variant="outlined"
                        />

                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                          fullWidth
                          required
                          helperText={touched.confirmPassword && errors.confirmPassword}
                          label="Confirm Password"
                          margin="normal"
                          name="confirmPassword"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="password"
                          value={values.confirmPassword}
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
                          >
                            Update Password
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

export default UpdatePassword;
