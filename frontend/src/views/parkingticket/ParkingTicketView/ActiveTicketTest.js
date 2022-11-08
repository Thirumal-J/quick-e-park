import {
  Box,
  Button,
  Container, FormControl, InputLabel, makeStyles, Select, Typography
} from '@material-ui/core';
import axios from 'axios';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
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
    arr.push(<option key={i} value={i}>{i}{" hours"}</option>)
  }

  return arr;
};

function ActiveTicket() {
  const classes = useStyles();

  localData = getLocalData("loginData");
  const [state, setState] = React.useState({
    activeTicketCount:1,
    responseItems:[],
    showExtendOptions:[],
    timeToExtendList:[]
  });

  const [activeTicketData, setActiveTicketData] = useState({
    parkedCarRegNo: '',
    parkingEndDate: '',
    parkingFare: '',
    parkingLocation: '',
    parkingStartDate: '',
    remainingParkingDuration: ''
  });
  const [showActiveWindow, setShowActiveWindow] = useState(false);
  const [showNoActiveWindow, setShowNoActiveWindow] = useState(true);
  const [showExtensionOption, setShowExtensionOption] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'http://localhost:5000/getActiveTicket', {
        method: 'POST',
        data: { "email": "thirumal1206@gmail.com" },
        headers: {
          'Content-Type': 'application/json'
        }
      }
      ).then(response => {
        if (response.data.statusCode == 200) {
          state.activeTicketCount = response.data.data.length;
          console.log("Ticket count-->",state.activeTicketCount);
          if (state.responseItems.length!=0) {
            state.responseItems = [];
          }
          state.responseItems = response.data.data;
          for (let i =0; i<state.responseItems.length;i++)
          {
            state.showExtendOptions[i] = false;
          }
          setShowActiveWindow(true);
          setShowNoActiveWindow(false);
        }
      })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
    fetchData();
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
        justifyContent="top"
      >
        <Box mb={3}>
          <Typography
            color="primary"
            variant="h1"
          >
            Active Parking Ticket
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
              Ticket No. {index+1}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Parking Location : {state.responseItems[index].parkingLocation}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Parking Vehicle Number : {state.responseItems[index].parkedCarRegNo}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Parking Start Time : {state.responseItems[index].parkingStartDate}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Parking End Time : {state.responseItems[index].parkingEndDate}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Remaining Parking Duration : {state.responseItems[index].remainingParkingDuration}
            </Typography>
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Parking Fare Incurred : {state.responseItems[index].parkingFare}
            </Typography>
          </Box>
        </Container> : null}
        
        <Box mb={3}>
          <Container maxWidth="lg">
            <Formik
              initialValues={{
                timeToExtend: ''
              }}
              validationSchema={Yup.object().shape({
                timeToExtend: Yup.string().required('Choose a parking duration')
              })}
              onSubmit={values => {
                console.log("**state.timeToExtendList[index]-->",state.timeToExtendList[index]);
                axios(
                  'http://localhost:5000/extendActiveParking', {
                  method: 'POST',
                  data: { "email": "thirumal1206@gmail.com", "timeToExtend": state.timeToExtendList[index] },
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
                ).then(response => {
                  console.log(response.data);
                  if (response.data.statusCode == 200) {
                    setActiveTicketData(response.data.data);
                    setShowActiveWindow(true);
                    setShowNoActiveWindow(false);
                    console.log(state.showExtendOptions[index]);
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
              }) => (

                <form onSubmit={handleSubmit}>
                  <Box mb={3}>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel htmlFor="outlined-age-native-simple">Parking Duration</InputLabel>
                      <Select
                        native
                        fullWidth
                        required
                        value={state.timeToExtendList[index]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Parking Time Duration"
                        inputProps={{
                          name: 'timeToExtend',
                          id: 'outlined-age-native-simple',
                        }}
                      >
                        <option aria-label="None" value="" />
                        <option value={0.5}>30 mins</option>
                        <option value={1}>1 hour</option>
                        {buildOptions()}
                      </Select>
                    </FormControl>

                    <Button
                      color="primary"
                      disabled={!(isValid && dirty)}
                      // fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      name="extendTicketBtn"

                    >
                      Extend Ticket
                  </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Container>
        </Box>
      </Box>
    </Page >
    </div>
  )));
};

export default ActiveTicket;
