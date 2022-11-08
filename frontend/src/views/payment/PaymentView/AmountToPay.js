import {
    Box,
    Button, Container, FormControl,
    FormControlLabel,
    FormLabel, InputLabel, makeStyles, Radio,
    RadioGroup, Select, TextField, Typography
} from '@material-ui/core';
import axios from 'axios';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from 'src/components/Page';
import * as Yup from 'yup';

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
    const [value, setValue] = React.useState('paypal');
    const[showPaymentPortal,setShowPaymentPortal] = useState(false);
    const [pendingPayment, setPendingPayment] = useState({
        ticketAmount: '',
        fineAmount: ''
    });
    localData = getLocalData("loginData");

    const handleRadioChange = (event) => {
        setValue(event.target.value);
    };

    
    useEffect(() => {
        async function fetchData() {
            const result = await axios(
                'http://localhost/getPendingPayment', {
                method: 'POST',
                data: { "email": localData.email },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            ).then(response => {
                console.log(response.data);
                if (response.data.statusCode == 200) {
                    setPendingPayment(response.data.data);
                }
            })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
        fetchData();
        
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
                                            method: 'POST',
                                            data: values,
                                            headers: {
                                              'Content-Type': 'application/json'
                                            }
                                          }
                                          ).then(response => {
                                            console.log(response.data);
                                            if (response.data.statusCode == 200) {
                                              navigate("/app/parkingTicket");
                                            }
                                          })
                                            .catch(error => {
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
