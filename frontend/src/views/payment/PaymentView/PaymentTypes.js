import {
    Box,
    Button, Container, FormControl,
    FormControlLabel,
    FormLabel, makeStyles, Radio,
    RadioGroup, TextField, Typography
} from '@material-ui/core';
import { Formik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Page from 'src/components/Page';
import * as Yup from 'yup';

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
        return JSON.parse(localStorage.getItem(localDataKey));
    }
};

const setLocalData = (localDataKey, localDataValue) => {
    localStorage.setItem(localDataKey, JSON.stringify(localDataValue));
    localData = JSON.parse(localStorage.getItem(localDataKey));
};

const PaymentTypes = () => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [value, setValue] = React.useState('paypal');

    const handleRadioChange = (event) => {
        setValue(event.target.value);
    };

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
                            variant="h1"
                        >
                            Payment Portal
                                </Typography>
                    </Box>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select a payment type </FormLabel>
                        <RadioGroup aria-label="paymentmode" name="paymentmode" value={value} onChange={handleRadioChange}>
                            <FormControlLabel value="paypal" control={<Radio />} label="Paypal" />
                            <FormControlLabel value="IBAN" control={<Radio />} label="IBAN" />
                            <FormControlLabel value="Debit" control={<Radio />} label="Debit" />
                            <FormControlLabel value="Credit" control={<Radio />} label="Credit" />
                        </RadioGroup>
                    </FormControl>
                    <Formik
                        initialValues={{
                            PaypalID: '',
                            password: ''
                        }}
                        validationSchema={Yup.object().shape({
                            PaypalID: Yup.string().email('Must be a valid paypal email id').max(255).required('Paypal ID is required'),
                            password: Yup.string().required("Please enter your password")
                                .matches(
                                    /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                                    "Password must contain at least 8 characters, one uppercase, one number and one special case character"
                                ),

                        })}
                        onSubmit={values => {
                        }
                        }
                    >
                        {({
                            errors,
                            handleBlur,
                            handleChange,
                            touched,
                            dirty,
                            isValid,
                            values
                        }) =>
                        (<form>
                            <Box mb={2}>
                                <TextField
                                    error={Boolean(touched.PaypalID && errors.PaypalID)}
                                    fullWidth
                                    required
                                    helperText={touched.PaypalID && errors.PaypalID}
                                    label="PaypalID"
                                    margin="dense"
                                    name="PaypalID"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.PaypalID}
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
    );
};

export default PaymentTypes;
