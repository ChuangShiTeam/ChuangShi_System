import constant from '../util/constant';

export default {

    namespace: 'role',

    state: {
        app_id: '',
        app_list: [],
        role_name: '',
        role_code: '',
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