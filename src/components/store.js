import { createStore } from 'vuex';
const store = createStore({
    state() {
        return {
            searchQuery: '',
        };
    },
    mutations: {
        updateSearchQuery(state, payload) {
            state.searchQuery = payload;
        },
    },
    actions: {
        setSearchQuery(context, payload) {
            context.commit('updateSearchQuery', payload);
        },
    },
    getters: {
        getSearchQuery(state) {
            return state.searchQuery;
        },
    },
});

export default store;