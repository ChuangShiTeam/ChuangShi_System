import constant from '../util/constant';

export default {

    namespace: 'guangqi_new_year_customer',

    state: {
        app_id: '',
        app_list: [],
        new_year_customer_car_model: '',
        new_year_customer_name: '',
        new_year_customer_phone: '',
        new_year_customer_province: '',
        new_year_customer_city: '',
        new_year_customer_dealer: '',
        new_year_customer_from: '',
        total: 0,
        page_index: 1,
        page_size: constant.page_size,
        list: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};