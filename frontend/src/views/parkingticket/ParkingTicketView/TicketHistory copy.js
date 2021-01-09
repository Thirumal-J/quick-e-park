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
  Link,
  TextField,
  Select,
  InputLabel,
  FormControl,
  NativeSelect,
  Typography,
  makeStyles
} from '@material-ui/core';
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

const buildOptions = () => {
  var arr = [];

  for (let i = 2; i <= 24; i++) {
    arr.push(<option key={i} value={i*60}>{i}{" hours"}</option>)
  }

  return arr;
};

function TicketHistory() {
  const classes = useStyles();
  const navigate = useNavigate();
  localData = getLocalData("loginData");
  // const [state, setState] = React.useState({
  //   activeTicketCount:1
  // });
  const [state, setState] = React.useState({
    activeTicketCount:1,
    rows:[]
  });
  // const [ParkedCarRegNo, setParkedCarRegNo] = useState('');
  const [activeTicketData, setActiveTicketData] = useState({
    parkedCarRegNo: '',
    // parkingEndDate: '',
    parkingFare: '',
    parkingLocation: '',
    parkingStartDate: '',
    remainingParkingDuration: ''
  });
  const [showActiveWindow, setShowActiveWindow] = useState(false);
  const [showNoActiveWindow, setShowNoActiveWindow] = useState(true);
  const [showExtensionOption, setShowExtensionOption] = useState(false);
  // const [extendParkingTime, setExtendParkingTime] = useState('');
  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'http://localhost:5000/getActiveTicket', {
        // 'https://d88390afeebf.ngrok.io/viewTicketUser', {
        method: 'POST',
        data: { "email": localData.email },
        headers: {
          'Content-Type': 'application/json'
        }
      }
      ).then(response => {
        console.log(response.data);
        if (response.data.statusCode == 200) {
          // setParkedCarRegNo(response.data.data.ParkedCarRegNo);
          setState({activeTicketCount:response.data.data.length});
          setActiveTicketData(response.data.data);
          setShowActiveWindow(true);
          setShowNoActiveWindow(false);
        }
        else {
          // this.loginError.display = "block"
        }
      })
        .catch(error => {
          // this({ errorMessage: error.message });
          console.error('There was an error!', error);
        });
    }
    fetchData();
    // setData(result.data);
  }, []);

  return (
[...Array(state.activeTicketCount)].map((elementInArray, index) =>(
  <div className="" key={index}>
    <Page
      className={classes.root}
      title="ActiveTicket"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Box mb={3}>
          <Typography
            color="primary"
            variant="h1"
          >
            Old Ticket {index+1}
                  </Typography>
        </Box>
        {showNoActiveWindow ? <Container maxWidth="sm">
          <Typography
            color="textPrimary"
            variant="body1"
          >
            Currently no active tickets found
          </Typography>
        </Container> : null}
        {showActiveWindow ? <Container maxWidth="md">
          
          <Box mb={3}>
          <Typography
              color="textPrimary"
              variant="body1"
            >
              Parked Location : {activeTicketData[index].parkingLocation}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Parked Vehicle Number : {activeTicketData[index].parkedCarRegNo}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Parking Start Time : {activeTicketData[index].parkingStartDate}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
             Notification Email : {activeTicketData[index].parkingEmail}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Parking End Time : {activeTicketData[index].remainingParkingDuration}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Parking Fare : {activeTicketData[index].parkingFare}
            </Typography>
            {/* <Button onClick={() => { setShowExtensionOption(true) }}
              color="secondary"
              variant="body1"
              size="large"
              type="submit"
              variant="contained"
            >
              Extend Ticket
            </Button> */}
          </Box>
        </Container> : null}
        {/* {showExtensionOption ? <Box mb={3}>
          <Container maxWidth="lg">
            <Formik
              initialValues={{
                timeToExtend: ''
              }}
              validationSchema={Yup.object().shape({
                timeToExtend: Yup.string().required('Choose a parking duration')
              })}
              onSubmit={values => {
                axios(
                  'http://localhost:5000/extendActiveParking', {
                    // 'https://d88390afeebf.ngrok.io/extendTicket'?, {
                  method: 'POST',
                  data: { "email": localData.email, "parkingEmail":activeTicketData[index].parkingEmail, "parkedCarRegNo":activeTicketData[index].parkedCarRegNo,"timeToExtend": values.timeToExtend },
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
                ).then(response => {
                  console.log(response.data);
                  if (response.data.statusCode == 200) {
                    // setParkedCarRegNo(response.data.data.ParkedCarRegNo);
                    // setActiveTicketData(response.data.data);
                    // setShowActiveWindow(true);
                    // setShowNoActiveWindow(false);
                    // setShowExtensionOption(false);
                  }
                  else {
                    // this.loginError.display = "block"
                  }
                })
                  .catch(error => {
                    // this({ errorMessage: error.message });
                    console.error('There was an error!', error);
                  });
              }
                // extendParkTime();
                // setActiveTicketData({ParkedCarRegNo: 'DE 1235'});
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
              }) => (

                <form onSubmit={handleSubmit}>
                  <Box mb={3}>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel htmlFor="outlined-age-native-simple">Parking Duration</InputLabel>
                      <Select
                        native
                        fullWidth
                        required
                        value={values.timeToExtend}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Parking Time Duration"
                        inputProps={{
                          name: 'timeToExtend',
                          id: 'outlined-age-native-simple',
                        }}
                      >
                        <option aria-label="None" value="" />
                        <option value={0.5*60}>30 mins</option>
                        <option value={1*60}>1 hour</option>
                        {buildOptions()}
                      </Select>
                    </FormControl>

                    <Button
                      color="primary"
                      // disabled = {!Formik.isValid}
                      // disabled={isSubmitting || !dirty}
                      disabled={!(isValid && dirty)}
                      // fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      name="extendTicketBtn"

                    >
                      Confirm
                  </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Container>
        </Box> : null} */}
      </Box>
    </Page >
    </div>
  )));
};

export default TicketHistory;
