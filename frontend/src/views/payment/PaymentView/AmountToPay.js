import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import {
    Box,
    Button,
    Radio,
    RadioGroup,
    Container,
    Grid,
    Link,
    TextField,
    Select,
    InputLabel,
    FormControl,
    FormControlLabel,
    FormLabel,
    NativeSelect,
    Typography,
    makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        height: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
        fontStyle: 'italic',
        fontFamily: '-apple-system',

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

const isTicketAmount = (pendingAmountType) => {
    if (pendingAmountType=="ticketAmount") {
        return true;
    }
    return false;
};

const isFineAmount = (pendingAmountType) => {
    if (pendingAmountType=="fineAmount") {
        return true;
    }
    return false;
}

const AmountToPay = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    
    // const [value, setValue] = React.useState('');

    // const handleChange = (event) => {
    //     setValue(event.target.value);
    //     setLocalData("amountToPay", event.target.value);
    //     setLocalData("amountType", "")
    // };

    const [value, setValue] = React.useState('paypal');

    const handleRadioChange = (event) => {
        setValue(event.target.value);
    };
    localData = getLocalData("loginData");
    const[showPaymentPortal,setShowPaymentPortal] = useState(false);
    const [pendingPayment, setPendingPayment] = useState({
        ticketAmount: '',
        fineAmount: ''
    });
    useEffect(() => {
        async function fetchData() {
            const result = await axios(
                'http://localhost/getPendingPayment', {
                // ' https://95d67cb9b11f.ngrok.io/getPendingPayment', {
                method: 'POST',
                data: { "email": localData.email },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            ).then(response => {
                console.log(response.data);
                if (response.data.statusCode == 200) {
                    // setParkedCarRegNo(response.data.data.ParkedCarRegNo);
                    setPendingPayment(response.data.data);
                }
                else {
                    // this.loginError.display = "block"
                }
            })
                .catch(error => {
                    // this({ errorMessage: error.message });
                    console.error('There was an error!', error);
                });
        }
        fetchData();
        // setData(result.data);
    }, []);

    return (
        <Page
            className={classes.root}
            title="Payment"
        >
            <Box
                display="flex"
                flexDirection="column"
                height="100%"
            // justifyContent="center"
            >
                <Container maxWidth="md">
                    <Box mb={3}>
                        <Typography
                            color="primary"
                            variant="h3"
                        >
                            Pending Ticket Amount: {pendingPayment.ticketAmount}
                        </Typography>
                    </Box>

                    <Box mb={3}>
                        <Typography
                            color="primary"
                            variant="h3"
                        >
                            Pending Fine Amount: {pendingPayment.fineAmount}
                        </Typography>
                    </Box>
                    <Box mb={3}>
                        <Button onClick={() => setShowPaymentPortal(true)}
                                color="secondary"
                                variant="body1"
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                To Payment Portal
                            </Button>
                    </Box>
                </Container>
                {showPaymentPortal ? <Container maxWidth="md">
                    <Page
                        className={classes.root}
                        title="Payment"
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            height="100%"
                        // justifyContent="center"
                        >
                            <Container maxWidth="md">
                                <Box mb={3}>
                                    <Typography
                                        color="primary"
                                        variant="h1"
                                    >
                                        Payment Portal
                                </Typography>
                                </Box>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Select a payment type </FormLabel>
                                    <RadioGroup aria-label="paymentmode" name="paymentmode" value={value} onChange={handleRadioChange}>
                                        <FormControlLabel value="paypal" control={<Radio />} label="Paypal" />
                                        {/* <FormControlLabel value="IBAN" control={<Radio />} label="IBAN" />
                            <FormControlLabel value="Debit" control={<Radio />} label="Debit" />
                            <FormControlLabel value="Credit" control={<Radio />} label="Credit" /> */}
                                    </RadioGroup>
                                </FormControl>
                                <Formik
                                    initialValues={{
                                        paypalID: '',
                                        password: '',
                                        amount: '',
                                        pendingAmountType: '',
                                        email:localData.email
                                    }}
                                    validationSchema={Yup.object().shape({
                                        paypalID: Yup.string().email('Must be a valid paypal email id').max(255).required('Paypal ID is required'),
                                        password: Yup.string().required("Please enter your password"),
                                            // .matches(
                                            //     /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                                            //     "Password must contain at least 8 characters, one uppercase, one number and one special case character"
                                            // ),
                                        pendingAmountType: Yup.string().required("Please choose an option"),

                                    })}
                                    onSubmit={values => {
                                        if (values.pendingAmountType =="ticketAmount") {
                                            values.amount = pendingPayment.ticketAmount
                                        }
                                        else if (values.pendingAmountType =="fineAmount") {
                                            values.amount = pendingPayment.fineAmount
                                        }
                                        else {
                                            values.amount = ""
                                        }
                                        console.log("in submit payment-->", values)

                                        axios(
                                            'http://localhost/clearPayment', {
                                            //   ' https://95d67cb9b11f.ngrok.io/clearPayment', {
                                            method: 'POST',
                                            // data: { "email": localData.email, "timeToExtend": values.timeToExtend },
                                            data: values,
                                            headers: {
                                              'Content-Type': 'application/json'
                                            }
                                          }
                                          ).then(response => {
                                            console.log(response.data);
                                            if (response.data.statusCode == 200) {
                                              navigate("/app/parkingTicket");
                                              // setParkedCarRegNo(response.data.data.ParkedCarRegNo);
                                              // setActiveTicketData(response.data.data);
                                              // setShowActiveWindow(true);
                                              // setShowNoActiveWindow(false);
                                              // setShowExtensionOption(false);
                                            }
                                            else {
                                              // this.loginError.display = "block"
                                            }
                                          })
                                            .catch(error => {
                                              // this({ errorMessage: error.message });
                                              console.error('There was an error!', error);
                                            });
                                    }
                                    }
                                >
                                    {({
                                        errors,
                                        handleBlur,
                                        handleChange,
                                        handleSubmit,
                                        isSubmitting,
                                        touched,
                                        dirty,
                                        isValid,
                                        values
                                    }) =>
                                    (<form onSubmit={handleSubmit}>
                                        <Box mb={2}>
                                            <TextField
                                                error={Boolean(touched.paypalID && errors.paypalID)}
                                                fullWidth
                                                required
                                                helperText={touched.paypalID && errors.paypalID}
                                                label="PaypalID"
                                                margin="dense"
                                                name="paypalID"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.paypalID}
                                                variant="outlined"
                                            />
                                            <TextField
                                                error={Boolean(touched.password && errors.password)}
                                                fullWidth
                                                required
                                                helperText={touched.password && errors.password}
                                                label="Password"
                                                margin="normal"
                                                name="password"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="password"
                                                value={values.password}
                                                variant="outlined"
                                            />
                                        </Box>

                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel htmlFor="outlined-age-native-simple" required>Choose Amount</InputLabel>
                                            <Select
                                                native
                                                fullWidth
                                                required
                                                value={values.pendingAmountType}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                label="PendingAmountType"
                                                inputProps={{
                                                    name: 'pendingAmountType',
                                                    id: 'outlined-age-native-simple',
                                                }}
                                            >
                                                <option aria-label="None" value="" />
                                                {/* <option key="ticketAmount" value={pendingPayment.ticketAmount}>Pending Ticket Amount</option>
                                                <option key="fineAmount" value={pendingPayment.fineAmount}>Pending Fine Amount</option> */}
                                                <option value="ticketAmount" >Pending Ticket Amount</option>
                                                <option value="fineAmount" >Pending Fine Amount</option>
                                                
                                            </Select>
                                        </FormControl>
                                        { isTicketAmount(values.pendingAmountType) ?<TextField
                                            error={Boolean(touched.amount && errors.amount)}
                                            fullWidth
                                            disabled
                                            helperText={touched.amount && errors.amount}
                                            label="Amount"
                                            margin="normal"
                                            name="amount"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={pendingPayment.ticketAmount}
                                            variant="outlined"
                                        />:null}
                                        {isFineAmount(values.pendingAmountType) ?<TextField
                                            error={Boolean(touched.amount && errors.amount)}
                                            fullWidth
                                            disabled
                                            helperText={touched.amount && errors.amount}
                                            label="Amount"
                                            margin="normal"
                                            name="amount"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={pendingPayment.fineAmount}
                                            variant="outlined"
                                        />:null}
                                        <Box my={2}>
                                            <Button
                                                color="primary"
                                                disabled={!(isValid && dirty)}
                                                // fullWidth
                                                size="large"
                                                type="submit"
                                                variant="contained"
                                                name="payNowBtn"
                                            >
                                                Pay Now
                                </Button>
                                        </Box>
                                    </form>)}
                                </Formik>
                            </Container>
                        </Box>
                    </Page>
                </Container>:null}
            </Box>
        </Page>
    );
};

export default AmountToPay;
