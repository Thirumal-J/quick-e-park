import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { Alert, AlertTitle } from '@material-ui/lab';
// import TakePicture from 'src/components/TakePicture';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ScannerIcon from '@material-ui/icons/Scanner';

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
  // upload: {
  //   '& > *': {
  //     margin: theme.spacing(1),
  //     justifyContent: "center"
  //   }
  // },
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
      // width: '25%',
      // height: '25%'
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

// function TakePicture (props) {
const ScanAndCheck = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showLoginError, setShowLoginError] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [base64Img, setBase64Img] = useState('');
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [showUploadModule, setShowUploadModule] = useState(false);
  const [captureImagePreviewUrl, setCaptureImagePreviewUrl] = useState('');

  localData = getLocalData("loginData")
  // const verfiyLogin = verifyLogin();

  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  function getLicenseNumber(base64Img) {
    // axios('https://09b6f28e955a.ngrok.io/getLicenseNumber', {
    axios('http://localhost:5000/getLicenseNumber', {
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
          setLocalData("loginData", response.data.data);
          console.log("Login Page after api call--->", localData);
          navigate('/app/internal/home');
        }
        else {
          setShowLoginError(true);
        }
      })
      .catch(error => {
        // this({ errorMessage: error.message });
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

  const fileSelectedHandler = event => {
    setSelectedImage(event.target.files[0]);
  };
  const uploadHandler = () => {
    const fd = new FormData();
    fd.append('image', selectedImage);
    console.log(fd);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    setImagePreviewUrl('');
    console.log('handle uploading-', file);
    getLicenseNumber(base64Img);
  }

  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result);
      setBase64Img(reader.readAsDataURL(file));
      // console.log("test image--->",base64Img);
    }

    reader.readAsDataURL(file);
    setShowUploadButton(true);
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
      // justifyContent="center"
      >
        {/* <Container maxWidth="sm"> */}
        <Box mb={3}>
          <Button onClick={() => { setShowCamera(true) }}
            color="secondary"
            variant="body1"
            size="large"
            type="submit"
            variant="contained"
          >
            Scan vehicle number
            </Button>
            </Box>
          <Box mb={3}>
            <Button onClick={() => { setShowUploadModule(true); setShowCamera(false); setCaptureImagePreviewUrl(''); }}
              color="secondary"
              variant="body1"
              size="large"
              type="submit"
              variant="contained"
            >
              Upload a picture
            </Button>
            </Box>
            {showCamera ?
              <Box md={3}>
                <Camera className={classes.cameraStyle}
                  onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
                  // onTakePhotoAnimationDone={(dataUri) => { handleTakePhotoAnimationDone(dataUri); }}
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
                <div className={classes.imgPreview}>
                  <img src={captureImagePreviewUrl} >
                  </img>
                </div>
              </Box>
              : null}
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
                <div className={classes.imgPreview}>
                  <img src={imagePreviewUrl} >
                  </img>
                </div>
            </div>
          </Box>:null}
          {/* <TakePicture /> */}

          {showDetail ? <Container maxWidth="sm">

          </Container> : null}
        {/* </Box> */}
  </Page>
);
};

export default ScanAndCheck;
