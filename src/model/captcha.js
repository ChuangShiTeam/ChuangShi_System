import constant from '../util/constant';

export default {

    namespace: 'captcha',

    state: {
        app_id: '',
        app_list: [],
        captcha_type: '',
        captcha_mobile: '',
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