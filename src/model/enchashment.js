import constant from '../util/constant';

export default {

    namespace: 'enchashment',

    state: {
        app_id: '',
        app_list: [],
        user_id: '',
        enchashment_status: '',
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