import {
  Box,
  Button,
  Container, makeStyles, Typography
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ScannerIcon from '@material-ui/icons/Scanner';
import axios from 'axios';
import { useState } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useNavigate } from 'react-router-dom';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  cameraStyle: {
    maxWidth: "256",
    display:"block",
    margin: "auto"
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

const ScanAndCheck = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [base64Img, setBase64Img] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [captureImagePreviewUrl, setCaptureImagePreviewUrl] = useState('');

  localData = getLocalData("loginData")
  const [file, setFile] = useState('');
  function getLicenseNumber(base64Img) {
    // axios('https://09b6f28e955a.ngrok.io/getLicenseNumber', {
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
        if (response.data.statusCode == 200) {

        }
        else {
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }
  function handleTakePhoto(dataUri) {
    // Do stuff with the photo...
    setBase64Img(dataUri);
    console.log('takePhoto', base64Img);
    // setShowCamera(false);
    setShowDetail(true);
    setCaptureImagePreviewUrl(dataUri)
    getLicenseNumber(base64Img);
    setShowConfirmButton(true);
    setShowPreview(true);
    // }
  }

  function handleTakePhotoAnimationDone(dataUri) {
    // Do stuff with the photo...
    console.log('takePhotoAnimation');
    // axios('http://localhost:5000/sendPlate', {

  }

  function handleCameraError(error) {
    console.log('handleCameraError', error);
  }

  function handleCameraStart(stream) {
    console.log('handleCameraStart');
  }

  function handleCameraStop() {
    console.log('handleCameraStop');
  }

  return (
    <Page
      className={classes.root}
      title="ScanAndCheck"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
      >
        <Container maxWidth="md">
          <Box mb={3}>
            <Button onClick={() => { setShowCamera(true) }}
              color="secondary"
              variant="body1"
              size="large"
              type="submit"
              startIcon={<ScannerIcon />}
              style={{display:"flex",margin:"auto"}}
            >
              Scan vehicle number
            </Button>
          </Box>
          {showCamera ?
            <Box md={3}>
              <Camera className={classes.cameraStyle}
                onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
                onCameraError={(error) => { handleCameraError(error); }}
                idealFacingMode={FACING_MODES.ENVIRONMENT}
                idealResolution={{ width: 640, height: 480 }}
                imageType={IMAGE_TYPES.JPG}
                imageCompression={0.97}
                isMaxResolution={true}
                isImageMirror={false}
                isSilentMode={false}
                isDisplayStartCameraError={true}
                isFullscreen={false}
                sizeFactor={1}
                onCameraStart={(stream) => { handleCameraStart(stream); }}
                onCameraStop={() => { handleCameraStop(); }}
              />
              {showPreview ?<div className={classes.imgPreview}>
                <Typography
                  color="textSecondary"
                  variant="body2"
                >
                  Preview of the Image
                </Typography>
                <img src={captureImagePreviewUrl} style={{width:"256px"}}>
                </img>
              </div> :null}
            </Box>
            : null}
          {showConfirmButton ? <Box mb={3}>
            <Button onClick={() => { setShowCamera(true) }}
              color="secondary"
              variant="body1"
              size="large"
              type="submit"
              startIcon={<CloudUploadIcon />}
            >
              Confirm 
            </Button>
          </Box> : null}
        </Container>
        {showDetail ? <Container maxWidth="sm">

        </Container> : null}
      </Box>
    </Page>
  );
};

export default ScanAndCheck;
