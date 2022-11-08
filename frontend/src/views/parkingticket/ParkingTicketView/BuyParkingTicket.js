import {
  Box,
  Button,
  Checkbox,
  Container, FormControl,
  FormControlLabel, InputLabel, Link, makeStyles,
  Modal, Select, TextField, Typography
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'src/components/Page';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2)
  },
  formControl: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    height: '100%',
    minWidth: 256,
  },
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

const buildOptions = () => {
  var arr = [];
  for (let i = 2; i <= 24; i++) {
    arr.push(<option key={i} value={i * 60}>{i}{" hours"}</option>)
  }
  return arr;
};

const BuyParkingTicket = () => {
  const classes = useStyles();

  localData = getLocalData("loginData");
  const [state, setState] = useState({
    vehicles: [],
  });

  const [showTicket, setShowTicket] = useState(false);
  const [showTicketInfo, setShowTicketInfo] = useState(false);
  const [showTicketError, setShowTicketError] = useState(false);
  const [ticketInfoMessage, setTicketInfoMessage] = useState('');

  const handleEmailCBChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    async function fetchVehicles() {
      const result = await axios(
        'http://localhost/showVehicleData', {
        method: 'POST',
        data: { "email": localData.email },
        headers: {
          'Content-Type': 'application/json'
        }
      }
      ).then(response => {
        console.log(response.data);
        if (response.data.statusCode == 200) {
          setState({ vehicles: response.data.data });
        }
        else {
        }
      })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
    fetchVehicles();

  }, []);

  const vehiclesInProfile = () => {
    var vehiclesRegNoList = [];
    if (state.vehicles) {
      for (let i = 0; i < state.vehicles.length; i++) {
        vehiclesRegNoList.push(<option key={i} value={state.vehicles[i].carRegNumber}>{state.vehicles[i].carRegNumber}</option>)
      }
    }
    return vehiclesRegNoList;
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
      title="BuyParkingTicket"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
      >
        <Container maxWidth="lg">
          <Formik
            initialValues={{
              parkedLocation: '',
              parkedCarRegNo: '',
              parkingDuration: 0,
              email: '',
              parkingEmail: '',
              emailCheckBox: true
            }}
            validationSchema={Yup.object().shape({
              parkedLocation: Yup.string().max(255).required('Enter a valid location'),
              parkedCarRegNo: Yup.string().max(10).required('Enter a valid vehicle license plate number'),
              parkingDuration: Yup.string().required('Choose a parking duration'),
              parkingEmail: Yup.string().email(),
            })}
            onSubmit={values => {
              console.log(values);
              values.email = localData.email;
              if (values.parkingEmail == '') {
                values.parkingEmail = localData.email;
              }
              axios('http://localhost/buyParkingTicket', {
                method: 'POST',
                data: values,
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then(response => {
                console.log(response.data.data);
                if (response.data.statusCode == 200) {
                  setOpen(true);
                  setShowTicket(true);
                  setShowTicketInfo(false);
                  setShowTicketError(false);
                  
                }
                else if (response.data.statusCode == 243) {
                  setShowTicket(false);
                  setShowTicketInfo(true);
                  setTicketInfoMessage(response.data.statusDesc);
                  setShowTicketError(false);
                }
                else {
                  setShowTicket(false);
                  setShowTicketInfo(false);
                  setShowTicketError(true);
                }
              }).catch(error => {
                setShowTicket(false);
                setShowTicketInfo(false);
                setShowTicketError(true);
                console.error('There was an error!', error);
              });
            }
            }
            onChange={values => {
              values.emailCheckBox = false
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              touched,
              dirty,
              isValid,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="primary"
                    variant="h1"
                  >
                    Buy New Parking Ticket
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Fields with * are mandatory
                  </Typography>
                </Box>
                <Box mb={3}>
                  <TextField
                    error={Boolean(touched.parkedLocation && errors.parkedLocation)}
                    fullWidth
                    required
                    helperText={touched.parkedLocation && errors.parkedLocation}
                    label="Parking Location"
                    margin="normal"
                    name="parkedLocation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.parkedLocation}
                    variant="outlined"
                  />
                </Box>
                <Box mb={3}>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple">Choose vehicle</InputLabel>
                    <Select
                      native
                      fullWidth
                      required
                      variant="outlined"
                      value={values.parkedCarRegNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Select vehicle"
                      inputProps={{
                        name: 'parkedCarRegNo',
                        id: 'outlined-age-native-simple',
                      }}
                    >
                      <option aria-label="None" value="" />
                      {vehiclesInProfile()}
                    </Select>
                    <Typography
                      color="textSecondary"
                      variant="body1"
                    >
                      <Link
                        component={RouterLink}
                        to="/app/vehicles"
                        variant="h6"
                      >
                        Want to add a new vehicle, click here?
                  </Link>
                    </Typography>
                  </FormControl>
                </Box>
                <Box mb={3}>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel htmlFor="outlined-age-native-simple">Parking Duration</InputLabel>
                    <Select
                      native
                      fullWidth
                      required
                      value={values.parkingDuration}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Parking Time Duration"
                      inputProps={{
                        name: 'parkingDuration',
                        id: 'outlined-age-native-simple',
                      }}
                    >
                      <option aria-label="None" value="" />
                      <option value={10}>10 mins</option>
                      <option value={30}>30 mins</option>
                      <option value={60}>1 hour</option>
                      {buildOptions()}
                    </Select>
                  </FormControl>
                </Box>
                <Box my={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.emailCheckBox}
                        defaultChecked
                        onChange={handleChange}
                        name="emailCheckBox"
                        color="primary"
                      />
                    }
                    label="Use logged in user email for notifications"
                  />
                </Box>
                {!values.emailCheckBox ? <Box mb={2}>
                  <TextField
                    error={Boolean(touched.parkingEmail && errors.parkingEmail)}
                    fullWidth
                    helperText={touched.parkingEmail && errors.parkingEmail}
                    label="Email Address for Notification"
                    margin="normal"
                    name="parkingEmail"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="email"
                    value={values.parkingEmail}
                    variant="outlined"
                  />
                </Box> : null}
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={!(isValid && dirty)}
                    size="large"
                    type="submit"
                    variant="contained"
                    name="buyTicketBtn"
                  >
                    Buy Ticket
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
                    <AlertTitle>Parking Ticket is successfully taken</AlertTitle>
                    <strong>Please click refresh the page to view ticket details</strong>
                    <Button 
                    onClick={() => {window.location.reload()}}
                    color="primary"
                    size="large"
                    variant="contained"
                    name="refreshBtn"
                    >Refresh
                    </Button>
                  </Alert>
                </Modal>
                </Container>
                {showTicket ? <Box my={2}>
                  <Alert severity="success">
                    <AlertTitle>Parking Ticket is successfully taken</AlertTitle>
                    <strong>Please refresh the page to view ticket details</strong>
                  </Alert>
                </Box> : null}
                {showTicketInfo ? <Box my={2}>
                  <Alert severity="info">
                    <AlertTitle>Wrong Info</AlertTitle>
                    <strong>{ticketInfoMessage}</strong>
                    <br></br>
                    <strong>choosen vehicle number is having an active ticket</strong>
                  </Alert>
                </Box> : null}
                {showTicketError ? <Box my={2}>
                  <Alert severity="error">
                    <AlertTitle>Something went wrong</AlertTitle>
                    <strong>We apologize for the incovenience.</strong>
                    <strong>Kindly try again in sometime!</strong>
                  </Alert>
                </Box> : null}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page >
  );
};

export default BuyParkingTicket;
