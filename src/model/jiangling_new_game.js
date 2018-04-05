import constant from '../util/constant';

export default {

    namespace: 'jiangling_new_game',

    state: {
        app_id: '',
        app_list: [],
        system_create_time: '',
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