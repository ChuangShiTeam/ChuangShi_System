import constant from '../util/constant';

export default {

    namespace: 'user_level',

    state: {
        app_id: '',
        app_list: [],
        user_level_name: '',
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