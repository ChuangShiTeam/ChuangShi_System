import constant from '../util/constant';

export default {

    namespace: 'express',

    state: {
        app_id: '',
        app_list: [],
        express_no: '',
        express_receiver_name: '',
        express_sender_name: '',
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