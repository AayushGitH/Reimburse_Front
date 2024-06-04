import axios from 'axios';
import BASE_URL from '../api/apiurl';

export const postRequest = (api, payload, headers, callback) => {
    axios.post(BASE_URL + api, payload, {
        headers: {
            "Content-Type": 'application/json',
        }
    })
        .then((response) => {
            callback(response);
        })
        .catch((error) => {
            callback(error);
        })
}
export const putRequest = (api, payload, headers, callback) => {
    axios.put(BASE_URL + api, payload, {
        headers: {
            // "Content-Type": 'application/json',
        }
    })
        .then((response) => {
            callback(response);
        })
        .catch((error) => {
            callback(error);
        })
}
export const getRequest = (api, headers, callback) => {
    axios.get(BASE_URL + api, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => {
            if (res?.status === 200) {
                callback(res);
            }
        })
        .catch((error) => {
            callback(error?.response)
        })
}
export const deleteRequest = (api, callback) => {
    axios.delete(BASE_URL + api, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((response) => {
            if (response?.status === 200) {
                callback(response)
            }
        })
        .catch((error) => {
            callback(error)
        })
}

export const getImage = (image) => {
    return axios.get(`${BASE_URL}/claim/image/${image}`)
}

export const updateClaim = (data) => {
    return axios.put(`${BASE_URL}/claim/updateClaim`, data)
}

export const assignEmployee = (payload) => {
    return axios.post(`${BASE_URL}/employee/assign`, payload)
}