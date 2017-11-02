import constant from '../util/constant';

export default {

    namespace: 'renault_member',

    state: {
        app_id: '',
        app_list: [],
        user_id: '',
        member_nick_name: '',
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