import constant from '../util/constant';

export default {

    namespace: 'exception',

    state: {
        app_id: '',
        app_list: [],
        exception_is_confirm: '',
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