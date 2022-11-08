import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import UpdatePassword from './UpdatePassword';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Account = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Account"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={8}
            xs={10}
          >
            <Profile />
          </Grid>
          <Grid
            item
            lg={6}
            md={8}
            xs={10}
          >
            <UpdatePassword />
          </Grid>
          <Grid
            item
            lg={8}
            md={10}
            xs={12}
          >
            <ProfileDetails />
          </Grid>
          
        </Grid>
      </Container>
    </Page>
  );
};

export default Account;
