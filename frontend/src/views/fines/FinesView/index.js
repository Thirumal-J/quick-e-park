import {
    makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Fines from './Fines';

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

const FinesView = (state, props) => {
    const classes = useStyles();
    localData = getLocalData("loginData");
    return (
        <Page
            className={classes.root}
            title="Dashboard"
        >
          <Fines/>
        </Page>
    );
};

export default FinesView;
