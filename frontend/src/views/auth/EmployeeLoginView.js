import {
  Box,
  Button,
  Container, Link, makeStyles, TextField,
  Typography
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';
import { Formik } from 'formik';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <Page
      className={classes.root}
      title="Employee Login"
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
              email: '',
              password: '',
              signInBtn:''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={values => 
              {
                console.log(values);
                axios('http://localhost:5000/employeeLogin', {
                  method: 'POST',
                  data : values,
                  headers: {
                   'Content-Type': 'application/json'
                   }})
                  .then(response => {console.log(response.data);
                  if(response.data.data.authentication) { 
                      setLocalData("loginData", response.data.data);
                      console.log("Login Page after api call--->",localData);
                      navigate('/app/home');
                  }
                  else {
                    alert("Invalid Login email or password");
                    console.log(values)
                  }
                }).catch(error => {
                       console.error('There was an error!', error);
                  });            
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
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in with the registered email
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
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
                <div className="loginError" style={{display:"none"}}>
                  <Alert severity="error">
                    <AlertTitle>Login Error</AlertTitle>
                    Invalid Login email or password — <strong>check it out!</strong>
                  </Alert>
                </div>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Sign up
                  </Link>
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/forgotPassword"
                    variant="h6"
                  >
                    Forgot Password?
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
