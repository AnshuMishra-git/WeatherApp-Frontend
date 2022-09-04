import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import React, { useEffect, useState } from 'react'
import {
    Alert, IconButton,
    Collapse,
    Typography, Button, Modal, Box, Container, Stack, Grid, Divider,
    TextField,
    Chip
} from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { isLogin } from '../redux/Notes/notes.actions'
import fetchApi from '../reuseble/fetchApi';
import Contant from '../reuseble/Constant';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import moment from 'moment'


function Notes() {
    const dispatch = useDispatch();
    const Login = useSelector((state) => state.notes);
    const [note, setnote] = useState([])
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const setWeatherModelOpen = () => setWeatherModel(true);
    const setWeatherModelClose = () => {
        setWeatherModel(false);
        setWeatherData(null);
    }
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('');
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [Message, setMessage] = useState('');
    const [showData, setShowData] = useState(0);
    const [weatherModel, setWeatherModel] = useState(false);
    const [spinner, setSpinner] = useState(true);
    const [weatherData, setWeatherData] = useState(null);
    const [token, setToken]= useState(localStorage.getItem("userToken"))

    const citySelectItems = [
        { label: 'Show All City List', value: 0 },
        { label: 'Added By Me Only', value: 1 },
    ];

    useEffect(() => {
        if(token){
            getNotes();
        }
    }, [showData]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const getNotes = async () => {
        let obj = {
            isShowAll: showData
        }
        const response = await fetchApi({
            method: 'post',
            reqUrl: Contant.MYCITY,
            data: obj,
        });
        await setnote(response.data.data.data)
    }


    const addCity = async () => {
        let obj = {
            city: city,
            country: country,
        }
        const response = await fetchApi({
            method: 'post',
            reqUrl: Contant.CITY_CREATE,
            data: obj,
        });
        if (response.data.code == 200) {
            setAlert(response.data.message)
            getNotes()
            handleClose()
            setCountry('')
            setCountry('');
            resetAlert()
        } else {
            setAlert(response.message);
            resetAlert()
        }
    }

    const setAlert = (message) => {
        setMessage(message);
        setAlertOpen(true);
    }

    const resetAlert = () => {
        setTimeout(() => {
            setMessage('');
            setAlertOpen(false);
        }, 3000);
    }

    const showWeather = async (rowData) => {
        setWeatherModelOpen();
        const updatedUrl = `${rowData.city}${Contant.CITY_WEATHER}`;
        const response = await fetchApi({ method: 'get', param: updatedUrl });
        if (response.status == 200) {
            setWeatherData(response.data)
        }
        setSpinner(false);
    }


    const statusBodyTemplate = (rowData) => {
        return <Button style={{ marginTop: '10px', padding: '5px' }} variant="contained" onClick={() => showWeather(rowData)}>{`${rowData.city} Weather`}</Button>

    }

    const countryBodyTemplate = (rowData) => {
        return rowData?.country;

    }

    const ciyyBodyTemplate = (rowData) => {
        return rowData?.city;

    }

    const sNoBodyTemplate = (rowData, rowIndex) => {
        return rowIndex.rowIndex + 1;
    }

    const header = (
        <div className="table-header">
            <span>City List Data: {' '}</span>

            {/* <Button icon="pi pi-refresh" /> */}
            <Dropdown value={showData} options={citySelectItems} onChange={(e) => setShowData(e.value)} placeholder="Select a City" />

            <Button onClick={handleOpen} style={{ float: 'right' }}>Add City + </Button>
        </div>
    );
    const footer = `In total there are ${note ? note.length : 0} note.`;


    return (
        <Container>
            <Collapse in={alertOpen}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setAlertOpen(false);
                            }}
                        >
                            {/* <CloseIcon fontSize="inherit" /> */}
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {Message}
                </Alert>
            </Collapse>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Stack>
                    <Box sx={style}>
                        <TextField id="standard-basic" required label="Country" variant="standard" value={country} onChange={(e) => setCountry(e.target.value)} />
                        <TextField id="standard-basic" required label="City" variant="standard" value={city} onChange={(e) => setCity(e.target.value)} />
                        <br></br>
                        <Button style={{ marginTop: '10px', padding: '5px' }} variant="contained" disabled={!(country.length && city.length)} onClick={() => addCity()}>Add City</Button>
                    </Box>
                </Stack>
            </Modal>
            <Modal
                open={weatherModel}
                onClose={setWeatherModelClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Stack>
                    {
                        spinner ?
                            <Box sx={style}>
                                <ProgressSpinner />
                            </Box>
                            :
                            <Box sx={style}>
                                <Box sx={{ my: 3, mx: 2 }}>
                                    <Grid container alignItems="center">
                                        <Grid item xs>
                                            <ListItem button>
                                                <ListItemText primary={'Temprature'} secondary={`${weatherData?.current.temp_c} °C `} />
                                                <ListItemText primary={`Feels Like`} secondary={`${weatherData?.current.feelslike_c} °C `} />
                                            </ListItem>
                                            <ListItem button>
                                                <ListItemText primary={'Temprature'} secondary={`${weatherData?.current.temp_f} °F `} />
                                                <ListItemText primary={`Feels Like`} secondary={`${weatherData?.current.feelslike_f} °F `} />
                                            </ListItem>
                                            <ListItem button>
                                                <ListItemText primary={`Humidity`} secondary={`${weatherData?.current.humidity}% `} />
                                                <ListItemText primary={`Wind KPH`} secondary={`${weatherData?.current.wind_kph} khp `} />
                                            </ListItem>
                                            <ListItem button>
                                                <Chip
                                                    sx={{ width: 150, height: 100, marginLeft: "35px" }}
                                                    avatar={<Avatar alt="Weather Image"
                                                        src={`${weatherData?.current?.condition?.icon.slice(2)}`} />}
                                                    label={weatherData?.current?.condition?.text}
                                                    variant="outlined"
                                                />
                                            </ListItem>
                                        </Grid>

                                    </Grid>

                                    <Grid item>


                                    </Grid>
                                </Box>
                                <Divider variant="middle" />
                                <Box sx={{ m: 2 }}>

                                    <Stack direction="row" spacing={1}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <LocationOnIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={`${weatherData?.location.name}, ${weatherData?.location?.region}, 
                                            ${weatherData?.location?.country}`} secondary={moment(weatherData?.location.localtime).format('MMMM Do YYYY, h:mm:ss a')} />
                                        </ListItem>
                                    </Stack>
                                </Box>
                            </Box>
                    }
                </Stack>
            </Modal>
            {/* <Container style={{ float: 'right', marginTop: '10px' }}> */}
            <div className="datatable-templating-demo">
                <div className="card">
                    <DataTable value={note} header={header} footer={footer} responsiveLayout="scroll">
                        <Column header="Sno" body={sNoBodyTemplate}></Column>
                        <Column field="country" header="Country" body={countryBodyTemplate}></Column>
                        <Column field="city" header="City" body={ciyyBodyTemplate}></Column>
                        <Column header="Action" body={statusBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
            {/* {
                    note && note.map((data, i) => (
                        <Paper variant="outlined" square key={i} >
                            <Card sx={{ minWidth: 275 }} sx={{ margin: '10px', padding: '2px' }}>
                                <CardContent >
                                    <Stack key={i}>
                                        <Typography sx={{ fontSize: 20 }} color="text.danger" gutterBottom>
                                            {data.title}
                                        </Typography>
                                        <Typography sx={{ mb: 2.5 }} color="text.secondary">
                                            {data.body}
                                        </Typography>

                                    </Stack>
                                </CardContent>
                            </Card>
                        </Paper>
                    ))
                } */}

            {/* </Container> */}
        </Container>
    )
}

export default Notes


 // <Card sx={{ minWidth: 275 }}>
                //     {
            //         note ? note.map((data, i) => {
            //             <h1>{i}</h1>
            //             // <CardContent key={i}>
                    //             //     {data.body}
            //             //     <Typography sx={{ fontSize: 20 }} color="text.danger" gutterBottom>
                        //             //         df
            //             //     </Typography>
            //             //     <Typography sx={{ mb: 2.5 }} color="text.secondary">
                        //             //         {i + 1}
            //             //     </Typography>
            //             // </CardContent>
            //         })
            //             : null
            //     }
            // </Card>