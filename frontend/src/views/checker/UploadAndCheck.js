import {
    Box,
    Button,
    Container, makeStyles, TextField,
    Typography
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Alert, AlertTitle } from '@material-ui/lab';
import axios from 'axios';
import { useState } from 'react';
import 'react-html5-camera-photo/build/css/index.css';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        height: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    },
    cameraStyle: {
        maxwidth: 256,
        width: '50%',
        height: '50%'
    },
    input: {
        display: 'none',
    },
    avatar: {
        height: 100,
        width: 100
    },
    imgPreview: {
        align: "center",
        height: '200px',
        width: '500px',
        img: {
            width: '100px',
            height: '300px'
        }
    }
}));

let localData = {};
const getLocalData = (localDataKey) => {
    if (localStorage.getItem(localDataKey) != null) {
        localData = JSON.parse(localStorage.getItem(localDataKey));
        return localData;
    }
};

const setLocalData = (localDataKey, localDataValue) => {
    localStorage.setItem(localDataKey, JSON.stringify(localDataValue));
    localData = JSON.parse(localStorage.getItem(localDataKey));
};

const UploadAndCheck = (props) => {
    const classes = useStyles();
    const [base64Img, setBase64Img] = useState('');
    const [showUploadButton, setShowUploadButton] = useState(false);
    const [showUploadModule, setShowUploadModule] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [licenseNumber, setLicenseNumber] = useState('');
    const [showIssueFine, setShowIssueFine] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showTicketFound, setShowTicketFound] = useState(false);
    const [showTicketNotFound, setShowTicketNotFound] = useState(false);
    const [showOwnerDetails, setShowOwnerDetails] = useState(false);
    const [ownerEmail, setOwnerEmail] = useState('');
    const [fineAmount, setFineAmount] = useState('');
    const [showOwnerNotFound, setShowOwnerNotFound] = useState(false);
    const [showIssueFineSuccess, setShowIssueFineSuccess] = useState(false);
    const [showIssueFineError, setShowIssueFineError] = useState(false);

    localData = getLocalData("loginData")
    const [activeTicketData, setActiveTicketData] = useState({
        parkedCarRegNo: '',
        parkingFare: '',
        parkingLocation: '',
        parkingStartDate: '',
        remainingParkingDuration: ''
    });

    const [file, setFile] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    
    function getLicenseNumber() {
        setShowUploadModule(false);
         axios('http://localhost/getLicenseNumber', {
            method: 'POST',
            data: { "image": base64Img },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'multipart'
            }
        })
            .then(response => {
                console.log(response.data);
                if (response.data.status == 200) {
                    setLicenseNumber(response.data.RetrivedLisNummer);
                    setShowIssueFine(true);
                }
                else {
                    setShowInfo(true);
                    setShowIssueFine(false);
                    setShowError(false);
                }
            })
            .catch(error => {
                setShowError(true);
                setShowInfo(false);
                setShowIssueFine(false);
                console.error('There was an error!', error);
            });
    }

    function getTicketStatus() {
        console.log("Inside get ticket status");
            axios('http://localhost/viewTicketChecker', {
            method: 'POST',
            data: { "parkedCarRegNo": licenseNumber },
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log(response.data);
                if (response.data.statusCode == 200) {
                    setShowTicketFound(true);
                    setActiveTicketData(response.data.data);
                }
                else {
                    setShowTicketNotFound(true);
                    setShowTicketFound(false);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    function checkOwner() {
            axios('http://localhost/checkOwner', {
            method: 'POST',
            data: { "carRegNumber": licenseNumber },
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log(response.data);
                if (response.data.statusCode == 200) {
                    setOwnerEmail(response.data.data.ownerEmail);
                    setShowOwnerDetails(true);
                    setShowOwnerNotFound(false);
                    setShowError(false);
                }
                else if (response.data.statusCode == 201) {
                    setShowOwnerNotFound(true);
                    setShowOwnerDetails(false);
                    setShowError(false);
                }
                else {
                    setShowError(true);
                    setShowOwnerNotFound(false);
                    setShowOwnerDetails(false);
                }
            })
            .catch(error => {
                setShowError(true);
                console.error('There was an error!', error);
            });
    }

    function issueFine() {
        console.log("FINEAMOUNT-->", fineAmount);
            axios('http://localhost/issueFine', {
            method: 'POST',
            data: { "userEmail": ownerEmail, "parkingFine": fineAmount, "parkedCarRegNo": licenseNumber, "empId": localData.empId },
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log(response.data);
                if (response.data.statusCode == 200) {
                    setShowIssueFineSuccess(true);
                    setShowIssueFineError(false);
                }
                else {
                    setShowIssueFineSuccess(false);
                    setShowIssueFineError(true);
                }
            })
            .catch(error => {
                setShowIssueFineSuccess(false);
                setShowIssueFineError(true);
                console.error('There was an error!', error);
            });
    }

    const handlefineAmountChange = (event) => {
        console.log("*********handlefineAmountChange-->", event.target);
        console.log("*********fineAmount-->", fineAmount);

    };
 
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('handle uploading-', file);
        getLicenseNumber();
    }

    const handleImageChange = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            console.log("inside on loadend");
            setFile(file);
            setImagePreviewUrl(reader.result);
            setBase64Img(reader.result);
            setShowPreview(true);
        }

        reader.readAsDataURL(file);
        setShowUploadButton(true);
        console.log("***********uploaded image-->",base64Img);
    }

    return (
        <Page
            className={classes.root}
            title="UploadAndCheck"
        >
            <Box
                display="flex"
                flexDirection="column"
                height="100%"
            >
                <Container maxWidth="md">
                    <Box mb={3}>
                        <Button onClick={() => { setShowUploadModule(true); setShowIssueFine(false); }}
                            color="secondary"
                            variant="body1"
                            size="large"
                            type="submit"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload a picture
                        </Button>
                    </Box>

                    {showUploadModule ?
                        <Box mb={3}>
                            <div className="previewComponent">
                                <form onSubmit={(e) => handleSubmit(e)}>

                                    <input
                                        accept="image/*"
                                        className="fileInput"
                                        type="file"
                                        name="Choose image"
                                        onChange={(e) => handleImageChange(e)} />
                                    {showUploadButton ?
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            component="span"
                                            size="large"
                                            type="submit"

                                            onClick={(e) => handleSubmit(e)}>Confirm upload</Button>
                                        : null}
                                </form>
                                {showPreview ? <div className={classes.imgPreview}>
                                    <Typography
                                        color="textSecondary"
                                        variant="body2"
                                    >
                                        Preview of the Image
                                    </Typography>
                                    <img src={imagePreviewUrl}  style={{width:"256px"}} >
                                    </img>
                                </div> : null}
                            </div>
                        </Box> : null}
                    {showIssueFine ? <Container maxWidth="md">
                        <TextField
                            fullWidth
                            disabled
                            label="Vehicle License Number"
                            margin="normal"
                            name="licenseNumber"
                            value={licenseNumber}
                            variant="outlined"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            size="large"
                            type="submit"

                            onClick={(e) => getTicketStatus()}>Get Ticket Status</Button>
                        {showTicketNotFound ? <Container maxWidth="md">
                            <Box mb={3}>
                                <Typography
                                    color="primary"
                                    variant="h1"
                                >
                                    No Active Parking Ticket Found
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                    size="large"
                                    type="submit"
                                    onClick={(e) => checkOwner()}>
                                    Look for Owner
                                </Button>
                                {showOwnerDetails ? <Container maxWidth="md">
                                    <TextField
                                        fullWidth
                                        disabled
                                        label="Vehicle License Number"
                                        margin="normal"
                                        name="licenseNumber"
                                        value={licenseNumber}
                                        variant="outlined"
                                    />
                                    <TextField
                                        fullWidth
                                        disabled
                                        label="Owner of the Vehicle"
                                        margin="normal"
                                        name="ownerEmail"
                                        type="email"
                                        value={ownerEmail}
                                        variant="outlined"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Fine Amount"
                                        margin="normal"
                                        name="fineAmount"
                                        type="number"
                                        onChange={event => setFineAmount(event.target.value)}
                                        value={fineAmount}
                                        variant="outlined"
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="span"
                                        size="large"
                                        type="submit"

                                        onClick={(e) => issueFine()}>
                                        Issue Fine
                                    </Button>
                                    {showIssueFineSuccess ? <Box my={2}>
                                        <Alert severity="success">
                                            <AlertTitle>Fine Issued Successfully</AlertTitle>
                                        </Alert>
                                    </Box> : null}
                                    {showIssueFineError ? <Box my={2}>
                                        <Alert severity="error">
                                            <AlertTitle>Unable to issue fine</AlertTitle>
                                            <strong>Please try again</strong>
                                        </Alert>
                                    </Box> : null}

                                </Container> : null}
                            </Box>
                        </Container> : null}
                        {showOwnerNotFound ? <Box my={2}>
                            <Alert severity="info">
                                <AlertTitle>Owner not registered in our db</AlertTitle>
                                <strong>Stick the bill</strong>
                            </Alert>
                        </Box> : null}
                        {showTicketFound ?
                            <Container maxWidth="md">

                                <Box mb={3}>
                                    <Typography
                                        color="primary"
                                        variant="h1"
                                    >
                                        Active Parking Ticket Found
                                </Typography>
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                    >
                                        Parking Location : {activeTicketData.parkingLocation}
                                    </Typography>
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                    >
                                        Parking Vehicle Number : {activeTicketData.parkedCarRegNo}
                                    </Typography>
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                    >
                                        Parking Start Time : {activeTicketData.parkingStartDate}
                                    </Typography>
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                    >
                                        Notification Email : {activeTicketData.parkingEmail}
                                    </Typography>
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                    >
                                        Remaining Parking Duration : {activeTicketData.remainingParkingDuration}
                                    </Typography>
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                    >
                                        Parking Fare Incurred : {activeTicketData.parkingFare}
                                    </Typography>
                                </Box>
                            </Container>
                            : null
                        }
                        {showInfo ? <Box my={2}>
                            <Alert severity="info">
                                <AlertTitle>Wrong Info</AlertTitle>
                                <strong>Photo quality is not good. Try again</strong>
                            </Alert>
                        </Box> : null}
                        {showError ? <Box my={2}>
                            <Alert severity="error">
                                <AlertTitle>Something went wrong</AlertTitle>
                                <strong>We apologize for the incovenience.</strong>
                                <strong>Kindly try again in sometime!</strong>
                            </Alert>
                        </Box> : null}

                    </Container> : null}
                </Container>
            </Box>
        </Page>
    );
};

export default UploadAndCheck;
