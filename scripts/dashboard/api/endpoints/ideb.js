import api from '../axios.js';

api.get('/ideb', {
    params: {ano: 2019, id: 7}
}).then(response => {
    console.log(response.data);
});