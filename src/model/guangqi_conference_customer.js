import constant from '../util/constant';

export default {

    namespace: 'guangqi_conference_customer',

    state: {
        app_id: '',
        app_list: [],
        conference_customer_name: '',
        conference_customer_phone: '',
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