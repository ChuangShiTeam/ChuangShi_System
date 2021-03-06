export default {

    namespace: 'website_menu',

    state: {
        app_id: '',
        app_list: [],
        website_menu_name: '',
        list: [],
        page_list: [],
        expandedRowKeys: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};