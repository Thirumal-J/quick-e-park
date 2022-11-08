import {
  Box,
  Button,
  Container, makeStyles, Typography
} from '@material-ui/core';
import axios from 'axios';
import { useState } from 'react';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
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

// function TakePicture (props) {
const IssueFines = (props) => {
  const classes = useStyles();

  const [showCamera, setShowCamera] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [file, setFile] = useState('');

  localData = getLocalData("loginData")
  
  function getLicenseNumber(base64Img) {
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
        if (response.data.data.authentication) {

        }
        else {
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }
  function handleTakePhoto(dataUri) {
    setBase64Img(dataUri);
    console.log('takePhoto', base64Img);
    setShowDetail(true);
    setCaptureImagePreviewUrl(dataUri)
    getLicenseNumber(base64Img);
    setShowConfirmButton(true);
    setShowPreview(true);
  }

  function handleTakePhotoAnimationDone(dataUri) {
    console.log('takePhotoAnimation');

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
        <Container maxWidth="sm">
          <Box mb={3}>
            <Button onClick={() => { setShowCamera(true) }}
              color="secondary"
              variant="body1"
              size="large"
              type="submit"
              startIcon={<ScannerIcon />}
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
                <img src={captureImagePreviewUrl} >
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

export default IssueFines;
