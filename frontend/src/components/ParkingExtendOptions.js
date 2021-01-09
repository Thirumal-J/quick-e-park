


const buildOptions = () => {
    var arr = [];
  
    for (let i = 2; i <= 24; i++) {
        arr.push(<option key={i} value="{i}">{i}{" hours"}</option>)
    }
  
    return arr; 
  };
  
function ParkingExtendOptions() {

    return (
        <Box mb={3}>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="outlined-age-native-simple">Parking Duration</InputLabel>
                <Select
                    native
                    fullWidth
                    required
                    value={values.parkingTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Parking Time Duration"
                    inputProps={{
                        name: 'parkingTime',
                        id: 'outlined-age-native-simple',
                    }}
                >
                    <option aria-label="None" value="" />
                    <option value={0.5}>30 mins</option>
                    <option value={1}>1 hour</option>
                    {buildOptions()}
                </Select>
            </FormControl>
        </Box>
    );
}

export default ParkingExtendOptions;