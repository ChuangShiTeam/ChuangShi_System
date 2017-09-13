import constant from '../util/constant';

export default {

    namespace: 'http',

    state: {
        app_id: '',
        app_list: [],
        http_url: '',
        http_code: '',
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