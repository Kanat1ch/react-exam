import axios from 'axios';
import {API_FORMAT, API_URL} from "../../FB_API/API";
import {RENDER_SHOP_SUCCESS} from "./actionTypes";

export function renderShop() {
    return async dispatch => {
        try {
            const response = await axios.get(`${API_URL}/shop${API_FORMAT}`);

            const data = Object.entries(response.data).map(item => {
                return {
                    ...item[1],
                    id: item[0],
                    key: item[0]
                }
            });

            data.sort((a,b) => a.status - b.status);

            dispatch(renderShopSuccess(data))
        } catch (e) {
            console.log(e)
        }
    }
}

export function renderShopSuccess(shop) {
    return{
        type: RENDER_SHOP_SUCCESS,
        shop
    }
}