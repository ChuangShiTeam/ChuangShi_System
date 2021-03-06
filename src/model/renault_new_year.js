import constant from '../util/constant';

export default {

    namespace: 'renault_new_year',

    state: {
        app_id: '',
        app_list: [],
        new_year_name: '',
        new_year_phone: '',
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