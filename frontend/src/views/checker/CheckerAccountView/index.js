import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import CheckerProfile from './CheckerProfile';
import CheckerProfileDetails from './CheckerProfileDetails';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

function CheckerAccountView() {
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
            <CheckerProfile />
          </Grid>
          <Grid
            item
            lg={8}
            md={10}
            xs={12}
          >
            <CheckerProfileDetails />
          </Grid>
          
        </Grid>
      </Container>
    </Page>
  );
};

export default CheckerAccountView;
