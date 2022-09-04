
    import { ISLOGIN } from './notes.types';

    export const isLogin = (payload) => {

        return {

           type: ISLOGIN,
           payload : payload

        };

    };