import React from 'react';
import {
    Container,
    Grid,
    makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import VehicleList from './VehicleList';
import AddNewVehicle from './AddNewVehicle';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
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

const VehiclesView = (state, props) => {
    const classes = useStyles();
    localData = getLocalData("loginData");
    return (
        <Page
            className={classes.root}
            title="Dashboard"
        >
            <Container maxWidth={false}>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        lg={10}
                        sm={12}
                        xl={10}
                        xs={12}
                    >
                        <VehicleList />
                    </Grid>
                    <Grid
                        item
                        lg={10}
                        sm={12}
                        xl={10}
                        xs={12}
                    >
                        <AddNewVehicle />
                    </Grid>
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

export default VehiclesView;
