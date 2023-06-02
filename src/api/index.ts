import request from '../utils/request';

export const fetchData = () => {
    return request.post("./table.json",{})
};
