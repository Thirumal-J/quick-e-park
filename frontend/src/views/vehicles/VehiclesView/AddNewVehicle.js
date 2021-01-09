import React, { useEffect, useState } from 'react';
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
  Checkbox,
  Link,
  TextField,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  NativeSelect,
  Typography,
  Modal,
  makeStyles
} from '@material-ui/core';
import FacebookIcon from 'src/icons/Facebook';
import GoogleIcon from 'src/icons/Google';
import Page from 'src/components/Page';
import { Alert, AlertTitle } from '@material-ui/lab';

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

const AddNewVehicle = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  localData = getLocalData("loginData");
  const [state, setState] = useState({
    ownerCheckBox: false,
    // showSuccessMessage: false,
    // showErrorMessage:false,
    vehicleAlreadyAdded:'',
    // showVehicleAlreadyAddedMessage:false
  });

  const [ showSuccessMessage, setShowSuccessMessage ] = useState(false);
  const [ showErrorMessage, setShowErrorMessage ] = useState(false);
  const [ showVehicleInfo, setShowVehicleInfo ] = useState(false);
  const [ vehicleInfoMessage, setVehicleInfoMessage ] = useState('');
  
  const handleOwnerCheckBoxChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Page
      className={classes.root}
      title="ActiveTicket"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        // justifyContent="center"
      >
        <Container maxWidth="lg">
          <Formik
            initialValues={{
              carRegNumber: '',
              vehicleType:'temporary',
              email:localData.email
              // email:"thirumal1206@gmail.com"
            }}
            validationSchema={Yup.object().shape({
              // email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              carRegNumber: Yup.string().max(255).required('carRegNumber is required')

            })}
            onSubmit={values => {
              console.log("Test Add new vehcile-->",state.ownerCheckBox);
              if (state.ownerCheckBox) {
                values.vehicleType="owner";
              }
              axios(
                'http://localhost:5000/addVehicle', {
                // 'https://95d67cb9b11f.ngrok.io/addVehicleData', {
                method: 'POST',
                data: values,
                // data: { "email": "thirumal1206@gmail.com"},
                headers: {
                  'Content-Type': 'application/json'
                }
              }
              ).then(response => {
                console.log(response.data);
                if (response.data.statusCode == 200) {
                  // setState({vehicles: []});
                  setState({vehicles: response.data.data});
                  setShowSuccessMessage(true);
                  setShowErrorMessage(false);
                  setShowVehicleInfo(false);
                }
                else if (response.data.statusCode == 201) {
                  setShowSuccessMessage(false);
                  setShowErrorMessage(false);
                  setShowVehicleInfo(true);
                  setVehicleInfoMessage(response.data.data.registrationMsg)
                  // setState({vehicleInfoMessage:response.data.data.registrationMsg});
                }
                else {
                  setShowSuccessMessage(false);
                  setShowErrorMessage(false);
                  setShowVehicleInfo(true);
                  setVehicleInfoMessage(response.data.data.registrationMsg)
                }
              })
                .catch(error => {

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
              dirty,
              isValid,
              values
            }) =>
            (<form onSubmit={handleSubmit}>
              <Box mb={3}>
                <Typography
                  color="primary"
                  variant="h1"
                >
                  Adding New Vehicle to Profile
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
                  error={Boolean(touched.vehicleLicensePlateNumber && errors.vehicleLicensePlateNumber)}
                  // fullWidth
                  required
                  helperText={touched.vehicleLicensePlateNumber && errors.vehicleLicensePlateNumber}
                  label="Vehicle reg number"
                  margin="normal"
                  name="carRegNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.carRegNumber}
                  variant="outlined"
                /> 
                <Box>
                 <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.ownerCheckBox}
                        // defaultChecked
                        onChange={handleOwnerCheckBoxChange}
                        name="ownerCheckBox"
                        color="primary"
                      />
                    }
                    label="Are you the owner of the vehicle?"
                  />
                  </Box>
                  <Box my={2}>
                  <Button
                    color="primary"
                    // disabled = {!Formik.isValid}
                    // disabled={isSubmitting || !dirty}
                    disabled={!(isValid && dirty)}
                    // fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    name="addVehicleBtn"
                  >
                    Add Vehicle 
                  </Button>
                </Box>
                <Container maxWidth="sm" style={{justifyContent:"center"}}>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <Alert maxWidth="sm" style={{display:"table", margin:"auto"}} severity="success">
                  <AlertTitle>Vehicle added to the profile successfully</AlertTitle>
                    <strong>Please refresh the page to view added vehicle details</strong>
                    <Button 
                    onClick={() => {window.location.reload()}}
                    color="primary"
                    size="large"
                    // type="submit"
                    variant="contained"
                    name="refreshBtn"
                    >Refresh
                    </Button>
                  </Alert>
                </Modal>
                </Container>
                {showSuccessMessage ? <Box my={2}>
                  <Alert severity="success">
                    <AlertTitle>Vehicle added to the profile successfully</AlertTitle>
                    <strong>Please refresh the page to view added vehicle details</strong>
                  </Alert>
                </Box> : null}
                {showVehicleInfo ? <Box my={2}>
                  <Alert severity="info">
                    <AlertTitle>Can't add this vehicle</AlertTitle>
                    <strong>{vehicleInfoMessage}</strong>
                    <strong> Kindly try with a different number!</strong>
                  </Alert>
                </Box> : null}
                {showErrorMessage ? <Box my={2}>
                  <Alert severity="error">
                    <AlertTitle>Something went wrong</AlertTitle>
                    <strong>We apologize for the incovenience.</strong>
                    <strong>Kindly try again in sometime!</strong>
                  </Alert>
                </Box> : null}
            </form>)}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default AddNewVehicle;
