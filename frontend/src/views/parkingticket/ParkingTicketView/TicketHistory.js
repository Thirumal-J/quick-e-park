import {
  Box, Container, makeStyles, Paper, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Typography
} from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  table: {
    minWidth :256
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
    arr.push(<option key={i} value={i * 60}>{i}{" hours"}</option>)
  }

  return arr;
};

function TicketHistory() {
  const classes = useStyles();
  
  localData = getLocalData("loginData");
  
  const [state, setState] = React.useState({
    oldTicketCount: 0,
    rows: []
  });
  
  const [oldTicketData, setOldTicketData] = useState({
    parkedCarRegNo: '',
    parkingEndDate: '',
    parkingFare: '',
    parkingLocation: '',
    parkingStartDate: '',
    remainingParkingDuration: '',
    notificationEmail: ''
  });

  const [showActiveWindow, setShowActiveWindow] = useState(false);
  const [showNoActiveWindow, setShowNoActiveWindow] = useState(true);
  const [showExtensionOption, setShowExtensionOption] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'http://localhost/getTicketHistory', {
        method: 'POST',
        data: { "email": localData.email },
        headers: {
          'Content-Type': 'application/json'
        }
      }
      ).then(response => {
        console.log(response.data);
        if (response.data.statusCode == 200) {
          setState({ activeTicketCount: response.data.data.length });
          setOldTicketData(response.data.data);
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
    <Page
      className={classes.root}
      title="Ticket Histrory"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
      >
        <Container maxWidth="lg">
          <Box mb={3}>
            <Typography
              color="primary"
              variant="h1"
            >
              Old Ticket History
                  </Typography>
          </Box>
          {showNoActiveWindow ? <Container maxWidth="sm">
            <Typography
              color="textPrimary"
              variant="body1"
            >
              Currently no tickets found in history
          </Typography>
          </Container> : null}
          {showActiveWindow ?
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell algin="right">Parked Location</TableCell>
                    <TableCell align="right">Parked Vehicle Number</TableCell>
                    <TableCell align="right">Parking Start Time</TableCell>
                    <TableCell align="right">Parking End Time</TableCell>
                    <TableCell align="right">Notification Email</TableCell>
                    <TableCell align="right">Parking Fare</TableCell>
                    <TableCell align="right">Payment Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {oldTicketData.map((row,index) => (
                    <TableRow key={index}>
                      <TableCell algin="right" component="th" scope="row">{row.parkingLocation}</TableCell>
                      <TableCell align="right">{row.parkedCarRegNo}</TableCell>
                      <TableCell align="right">{row.parkingStartDate}</TableCell>
                      <TableCell align="right">{row.parkingEndDate}</TableCell>
                      <TableCell align="right">{row.parkingEmail}</TableCell>
                      <TableCell align="right">{row.parkingFare}</TableCell>
                      <TableCell align="right">{row.paymentStatus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            : null}
        </Container>
      </Box>
    </Page >
    // </div>
    // )));
  );
};

export default TicketHistory;
