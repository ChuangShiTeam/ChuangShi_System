import constant from '../util/constant';

export default {

    namespace: 'sql',

    state: {
        app_id: '',
        app_list: [],
        sql_table: '',
        sql_action: '',
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