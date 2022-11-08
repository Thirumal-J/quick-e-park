import {
  Box, Container, makeStyles, Paper, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Typography
} from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
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

const Fines = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  localData = getLocalData("loginData");
  const [state, setState] = useState({
    finesData: []
  });

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'http://localhost/viewFinesUser', {
        method: 'POST',
        data: { "email": localData.email },
        headers: {
          'Content-Type': 'application/json'
        }
      }
      ).then(response => {
        console.log(response.data);
        if (response.data.statusCode == 200) {
          setState({ finesData: response.data.data });
        }
        else {
        }
      })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
    fetchData();
    console.log("Inside Test-->", state.finesData);

  }, []);

  return (
    <Page
      className={classes.root}
      title="Fines"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
         <Container maxWidth="md">
          <Box mb={3}>
          <Typography
            color="primary"
            variant="h1"
          >
            List of fines received
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell >Parked Date</TableCell>
                  <TableCell >Parked Car No</TableCell>
                  <TableCell >Parking Fine</TableCell>
                  <TableCell >Payment Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.finesData.map((row) => (
                  <TableRow key={row.fineDate}>
                    <TableCell component="th" scope="row">{row.fineDate}</TableCell>
                    <TableCell >{row.carRegistrationNo}</TableCell>
                    <TableCell >{row.parkingFine}</TableCell>
                    <TableCell >{row.paidStatus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default Fines;
