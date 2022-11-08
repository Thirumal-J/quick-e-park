import {
  Box,
  Button, Container, makeStyles, TextField,
  Typography
} from '@material-ui/core';
import axios from 'axios';
import { Formik } from 'formik';
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

const RegisterView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Page
      className={classes.root}
      title="Register"
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
              email: 'thirumal120@gmail.com',
              password: '',
              confirmPassword:''
            }}
            validationSchema={
              Yup.object().shape({
                password: Yup.string().max(255).required('password is required'),
                confirmPassword: Yup.string().required().label('Confirm Password').test('passwords-match', 'Both Passwords should match', function(value) {
                                    return this.parent.password === value;
                }),
              })
            }
            onSubmit={values => {
              axios('http://localhost/updatePassword', {
                  method: 'POST',
                  data : values,
                  headers: {
                   'Content-Type': 'application/json'
                   }})
                  .then(response => {console.log(response.data);
                  if(response.data.status_code==200) { 
                    navigate('/', { replace: true });
                    // this.props.history.push({'pathname':'/dashboard',state:this.state});			
                  }
                //   else {
                //     navigate('/', { replace: true });
                //   }
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
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Update New Password
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    you can now update your password
                  </Typography>
                </Box>
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
                <TextField
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  fullWidth
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
                <Box my={2}>
                  <Button
                    color="primary"
                    // disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Update New Password
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;
