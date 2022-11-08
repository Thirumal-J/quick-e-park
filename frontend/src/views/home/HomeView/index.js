import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';

import Page from 'src/components/Page';
import Welcome from './Welcome';
import WelcomeSidebar from './WelcomeSideBar';

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

const Dashboard = (state,props) => {
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
          
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
