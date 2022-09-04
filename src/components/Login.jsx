import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { Stack, styled, Paper, Container, Alert } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { isLogin } from '../redux/Notes/notes.actions'
import Contact from '../reuseble/Constant'
import fetchApi from '../reuseble/fetchApi';
import Contant from '../reuseble/Constant';
import Notes from './Notes';
const clientId = Contact.client_id;

function Login() {
    const dispatch = useDispatch();
    const Login = useSelector((state) => state.notes);
    const [showloginButton, setShowloginButton] = useState(true);
    const [showlogoutButton, setShowlogoutButton] = useState(false);
    const onLoginSuccess = (res) => {
        getUserData(res.profileObj);
        setShowloginButton(false);
        setShowlogoutButton(true);
    };

    const getUserData = async (res) => {
        const response = await fetchApi({
            method: 'post',
            reqUrl: Contant.USER_CREATE,
            data: res,
        });
        console.log('response',response.data.code)
        if (response.data.code == 200) {
            console.log('response', response);
            console.log('userToken', response.data.data.userToken)
            localStorage.setItem('userToken', response.data.data.userToken)
            localStorage.setItem('id', response.data.data._id
            )
            dispatch(isLogin(true))
            alert(response.data.message);
        } else alert(response.data.message);
    }

    const onLoginFailure = (res) => {
        dispatch(isLogin(false))
    };

    const onSignoutSuccess = () => {
        console.clear();
        setShowloginButton(true);
        setShowlogoutButton(false);
        dispatch(isLogin(false));
        logOutUser();
    };

    const logOutUser = async () => {

        const response = await fetchApi({
            method: 'post',
            reqUrl: Contant.USER_LOGOUT,
            data: {},
        });
        console.log('response', response.data.message)
        alert(response.data.message);
        localStorage.clear();
    }


    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <Container maxWidth='lg'>
            <Stack spacing={2}>
                <Item>
                    {showloginButton ?
                        <GoogleLogin
                            clientId={clientId}
                            buttonText="Sign In"
                            onSuccess={onLoginSuccess}
                            onFailure={onLoginFailure}
                            cookiePolicy={'single_host_origin'}
                            isSignedIn={true}
                        /> : null}

                    {showlogoutButton ?
                        <GoogleLogout
                            clientId={clientId}
                            buttonText="Sign Out"
                            onLogoutSuccess={onSignoutSuccess}
                        >
                        </GoogleLogout> : null
                    }
                </Item>
            </Stack>
            {
                Login.islogin ?
                    <Notes />
                    : <Alert severity="success" color="warning" sx={{ width: '80&', margin: '10px', padding: '2px' }}>
                        Please Login to Access Data
    </Alert>
            }
        </Container>
    );
}
export default Login;