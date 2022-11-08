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
  table:{
    minWidth:256
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

const VehicleList = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  localData = getLocalData("loginData");
  const [state, setState] = useState({
    vehicles: []
  });

  useEffect(() => {
    async function fetchData() {
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
          setState({vehicles: []});
          setState({vehicles: response.data.data});
        }
        else {
        }
      })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
    fetchData();
    console.log("Inside Test-->", state.vehicles);

  }, []);

  return (
    <Page
      className={classes.root}
      title="VehiclesList"
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
            List of Vehicles in the Profile
          </Typography>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell >Vehicle License Plate Number</TableCell>
                  <TableCell >Vehicle Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.vehicles.map((row) => (
                  <TableRow key={row.carRegNumber}>
                    <TableCell component="th" scope="row">{row.carRegNumber}</TableCell>
                    <TableCell >{row.vehicleType}</TableCell>
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

export default VehicleList;
