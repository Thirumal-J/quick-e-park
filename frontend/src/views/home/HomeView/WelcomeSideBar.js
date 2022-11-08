import {
  Box, Container, makeStyles
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import Page from 'src/components/Page';
import welcomesidebarimage from 'src/images/parkschein.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  sidebar: {

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

const ActiveTicket = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Page
      className={classes.root}
      title="Welcome Side Bar"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
      >
        <Container maxWidth="sm">
          <div className="sidebar">
              <h2>No need for any app download !!</h2><br></br>
              <h2>Login from anywhere using any device!</h2>
              <br></br>
            <img src={welcomesidebarimage}></img>
          </div>
        </Container>
      </Box>
    </Page>
  );
};

export default ActiveTicket;
