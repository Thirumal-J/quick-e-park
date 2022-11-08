import {
  Box,
  Button,
  Container, makeStyles, TextField,
  Typography
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';
import { Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from 'src/components/Page';
import * as Yup from 'yup';

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

const CheckerLoginView = () => {

  const classes = useStyles();
  const navigate = useNavigate();
  const [showLoginError, setShowLoginError] = useState(false);

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              empId: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              empId: Yup.number().required('Employee Id is required'),
              password: Yup.string().required("Please enter your password")
            })}
            onSubmit={values => 
              {
                console.log(values);
                axios('http://localhost/loginValidChecker', {
                  method: 'POST',
                  data : values,
                  headers: {
                   'Content-Type': 'application/json',
                   'Accept':'application/json'
                   }})
                  .then(response => {console.log(response.data);
                  if(response.data.data.authentication) { 
                      setLocalData("loginData", response.data.data);
                      console.log("Login Page after api call--->",localData);
                      navigate('/app/internal/home');
                  }
                  else {
                    setShowLoginError(true);
                    console.log(values)
                  }
                })
                      .catch(error => {
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
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h1"
                  >
                    Internal User Sign In
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in with your employee id and password
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.empId && errors.empId)}
                  fullWidth
                  helperText={touched.empId && errors.empId}
                  label="Employee Id"
                  margin="normal"
                  name="empId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.empId}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
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
                <Box my={2}>
                  <Button
                    color="primary"
                    size="large"
                    type="submit"
                    variant="contained"
                    name="signInBtn"
                    
                  >
                    Sign in now
                  </Button>
                </Box>
                
                {showLoginError ? <Container maxWidth="sm">
                <div className = "loginError">
                  <Alert severity="error">
                    <AlertTitle>Invalid Login</AlertTitle>
                    <strong> Employee ID or password is wrong</strong>
                  </Alert>
                </div>
                </Container> : null}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default CheckerLoginView;
