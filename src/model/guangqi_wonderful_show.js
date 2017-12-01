import constant from '../util/constant';

export default {

    namespace: 'guangqi_wonderful_show',

    state: {
        app_id: '',
        app_list: [],
        app_id: '',
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