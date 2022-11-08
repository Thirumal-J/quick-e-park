import {
  Box,
  Button,
  Container, FormControl, InputLabel, makeStyles, Select, Typography
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
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

function ActiveTicket() {

  const classes = useStyles();

  localData = getLocalData("loginData");
  
  const [state, setState] = useState({
    activeTicketCount:1,
    rows:[]
  });
  
  const [activeTicketData, setActiveTicketData] = useState({
    parkedCarRegNo: '',
    parkingFare: '',
    parkingLocation: '',
    parkingStartDate: '',
    remainingParkingDuration: ''
  });

  const [showActiveWindow, setShowActiveWindow] = useState(false);
  const [showNoActiveWindow, setShowNoActiveWindow] = useState(true);
  const [showExtensionOption, setShowExtensionOption] = useState(false);
  const [showExtensionError, setShowExtensionError] = useState(false);
  const [showExtensionSuccess, setShowExtensionSuccess] = useState(false);
  const [callActive, setCallActive] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'http://localhost/viewTicketUser', {
        method: 'POST',
        data: { "email": localData.email },
        headers: {
          'Content-Type': 'application/json'
        }
      }
      ).then(response => {
        console.log(response.data);
        if (response.data.statusCode == 200) {
          setState({activeTicketCount:response.data.data.length});
          setActiveTicketData(response.data.data);
          setShowActiveWindow(true);
          setShowNoActiveWindow(false);
        }
      })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
    fetchData();
  }, [callActive]);

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
        justifyContent="top"
      >
        <Box mb={3}>
          <Typography
            color="primary"
            variant="h1"
          >
            Active Parking Ticket {index+1}
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
        {showActiveWindow ? <Container maxWidth="sm">
          
          <Box mb={3}>
          <Typography
              color="textPrimary"
              variant="body1"
            >
              Parking Location : {activeTicketData[index].parkingLocation}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Parking Vehicle Number : {activeTicketData[index].parkedCarRegNo}
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
              Remaining Parking Duration : {activeTicketData[index].remainingParkingDuration}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Parking Fare Incurred : {activeTicketData[index].parkingFare}
            </Typography>
            </Box>
            <Box mb={3}>
            <Button onClick={() => { setShowExtensionOption(true) }}
              color="secondary"
              variant="body1"
              size="large"
              type="submit"
            >
              Extend Ticket
            </Button>
            </Box>
        </Container> : null}
        {showExtensionOption ? <Box mb={3}>
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
                  'http://localhost:5000/extendTicket', {
                  method: 'POST',
                  data: { "email": localData.email, "parkingEmail":activeTicketData[index].parkingEmail, "parkedCarRegNo":activeTicketData[index].parkedCarRegNo,"timeToExtend": values.timeToExtend },
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
                ).then(response => {
                  console.log(response.data);
                  if (response.data.statusCode == 200) {
                    setCallActive(true);
                    setShowExtensionSuccess(true);
                    setShowExtensionError(false);
                  }
                  else {
                    setShowExtensionSuccess(false);
                    setShowExtensionError(true);
                  }
                })
                  .catch(error => {
                    setShowExtensionSuccess(false);
                    setShowExtensionError(true);
                    console.error('There was an error!', error);
                  });
              }}
            >
              {({
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
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
                    </Box>
                    <Box mb={3}>
                    <Button
                      color="primary"
                      disabled={!(isValid && dirty) ||isSubmitting}
                      // fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      name="extendTicketBtn"

                    >
                      Confirm
                  </Button>
                  </Box>
                  {showExtensionSuccess ? <Box my={2}>
                  <Alert severity="success">
                    <AlertTitle>Parking Ticket is exteneded successfully</AlertTitle>
                    <strong>Please refresh the page to view ticket details</strong>
                  </Alert>
                </Box> : null}
                {showExtensionError ? <Box my={2}>
                  <Alert severity="error">
                    <AlertTitle>Something wrong</AlertTitle>
                    <strong>Please try again in sometime</strong>
                  </Alert>
                </Box> : null}
                </form>
              )}
            </Formik>
          </Container>
        </Box> : null}
      </Box>
    </Page >
    </div>
  )));
};

export default ActiveTicket;
