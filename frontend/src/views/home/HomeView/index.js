import React, {useEffect, useState} from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';

import Page from 'src/components/Page';
import Welcome from './Welcome';
import WelcomeSidebar from './WelcomeSideBar';
// import GeoLocation from './GeoLocation';
// import useCurrentLocation from "src/views/geo/GeoLocationView/useCurrentLocation";
// import useWatchLocation from "src/views/geo/GeoLocationView/useWatchLocation";
// import { geolocationOptions } from "src/views/geo/GeoLocationView/geolocationOptions";
// import MapContainer from "./MapContainer";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

let localData= {};
const getLocalData = (localDataKey) => {
  if (localStorage.getItem(localDataKey) != null){
    return JSON.parse(localStorage.getItem(localDataKey));
  }
};
const setLocalData = (localDataKey,localDataValue) => {
    localStorage.setItem(localDataKey, JSON.stringify(localDataValue));
    localData = JSON.parse(localStorage.getItem(localDataKey));
};

// const successHandler = position => console.log(position.coord);

// const errorHandler = error => console.error(error.message);

// const geolocationOptions = {
//   enableHighAccuracy: true,
//   timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
//   maximumAge: 1000 * 3600 * 24 // 24 hour
// };
const Dashboard = (state,props) => {
  const classes = useStyles();
  localData = getLocalData("loginData");
  // const { location: currentLocation, error: currentError } = useCurrentLocation(geolocationOptions);
  // const { location, cancelLocationWatch, error } = useWatchLocation(geolocationOptions);
  // const [isWatchinForLocation, setIsWatchForLocation] = useState(true);

  // useEffect(() => {
  //   if (!location) return;

  //   // Cancel location watch after 3sec
  //   setTimeout(() => {
  //     cancelLocationWatch();
  //     setIsWatchForLocation(false);
  //   }, 3000);
  // }, [location, cancelLocationWatch]);

  // console.log({currentLocation});
  // const locationWatchId = navigator.geolocation.watchPosition(successHandler, errorHandler, geolocationOptions);
  // console.log(locationWatchId);

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      {/* <div>{GeoLocation}</div> */}
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={5}
            sm={12}
            xl={1}
            xs={12}
          >
            <Welcome />
          </Grid>
          <Grid
            item
            lg={5}
            sm={10}
            xl={5}
            xs={12}
          >
            <WelcomeSidebar />
          </Grid>
          {/* <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <MapContainer />
          </Grid> */}

          {/* <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalCustomers />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TasksProgress />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalProfit />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TrafficByDevice />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <LatestProducts />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <LatestOrders />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
