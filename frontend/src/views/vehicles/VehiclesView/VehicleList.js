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
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
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
        // 'https://95d67cb9b11f.ngrok.io/showVehicleData', {
        method: 'POST',
        data: { "email": localData.email },
        // data: { "email": "thirumal1206@gmail.com"},
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
                  {/* <TableCell algin="right">Parked Date</TableCell> */}
                  <TableCell >Vehicle License Plate Number</TableCell>
                  <TableCell >Vehicle Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.vehicles.map((row) => (
                  <TableRow key={row.carRegNumber}>
                    <TableCell component="th" scope="row">{row.carRegNumber}</TableCell>
                    <TableCell >{row.vehicleType}</TableCell>
                    {/* <TableCell align="right">{row.ownerShip}</TableCell>
                    <TableCell align="right">{row.parkingFine}</TableCell>
                    <TableCell align="right">{row.paymentStatus}</TableCell> */}
                    {/* <TableCell align="right">{row.protein}</TableCell> */}
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
