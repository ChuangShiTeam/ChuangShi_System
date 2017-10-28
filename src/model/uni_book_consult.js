import constant from '../util/constant';

export default {

    namespace: 'uni_book_consult',

    state: {
        app_id: '',
        app_list: [],
        book_consult_name: '',
        book_consult_mobile: '',
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