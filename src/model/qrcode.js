import constant from '../util/constant';

export default {

    namespace: 'qrcode',

    state: {
        app_id: '',
        app_list: [],
        qrcode_type: '',
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