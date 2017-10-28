import constant from '../util/constant';

export default {

    namespace: 'uni_apply',

    state: {
        app_id: '',
        app_list: [],
        apply_name: '',
        apply_mobile: '',
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