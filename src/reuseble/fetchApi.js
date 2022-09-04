import axios from 'axios';
const url = process.env.REACT_APP_SERVER_URL ? process.env.REACT_APP_SERVER_URL : 'http://localhost:50111/';
const weather_Url = process.env.REACT_APP_WEATHER_APP ?
  process.env.REACT_APP_WEATHER_APP : 'http://api.weatherapi.com/v1/current.json'

const api_Key = process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : '606c40ed1f3a430a95445948220409'



const userToken = localStorage.getItem('userToken');
let val;
if (userToken) {
  val = {
    headers: {
      'authorization': userToken,
      'Content-Type': 'application/json',
    },
  };
}

const fetchApi = async (serviceType) => {
  if (serviceType.method === 'get') {
    return axios
      .get(`${weather_Url}?key=${api_Key}&q=${serviceType.param}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  }
  if (serviceType.method === 'post') {
    return axios
      .post(`${url}${serviceType.reqUrl}`, serviceType.data, val)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          return err.response;
        } else {
          return err.response;
        }
      });
  }
};
export default fetchApi;
