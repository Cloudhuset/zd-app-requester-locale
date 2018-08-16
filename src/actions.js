import ZAFClient from './misc/ZAFClient'

export const actions = {
    GET_REQUESTER: 'GET_REQUESTER',
    GET_REQUESTER_SUCCESS: 'GET_REQUESTER_SUCCESS',
    GET_REQUESTER_FAILED: 'GET_REQUESTER_FAILED',
    GET_LOCALES: 'GET_LOCALES',
    GET_LOCALES_SUCCESS: 'GET_LOCALES_SUCCESS',
    GET_LOCALES_FAILED: 'GET_LOCALES_FAILED',
    SET_REQUESTER_LOCALE: 'SET_REQUESTER_LOCALE',
    SET_REQUESTER_LOCALE_SUCCESS: 'SET_REQUESTER_LOCALE_SUCCESS',
    SET_REQUESTER_LOCALE_FAILED: 'SET_REQUESTER_LOCALE_FAILED',
    CHANGE_PAGE: 'CHANGE_PAGE',
    RESET_STORE: 'RESET_STORE',
}

export const getRequester = (id) => dispatch => {
    dispatch({
        type: actions.GET_REQUESTER,
    })

    var promise

    if (id) {
        promise = ZAFClient.request({
            url: '/api/v2/users/' + id + '.json'
        }).then(data => {
            return data.user
        })
    } else {
        promise = ZAFClient.get('ticket.requester').then(data => {
            return data['ticket.requester']
        })
    }

    return promise.then(function(requester) {
        return dispatch({
            type: actions.GET_REQUESTER_SUCCESS,
            requester: requester ? requester : null,
        })
    }).catch(() => {
        return dispatch({
            type: actions.GET_REQUESTER_FAILED,
        })
    });
}

export const getLocales  = () => dispatch => {
    dispatch({
        type: actions.GET_LOCALES,
    });

    return ZAFClient.request({
        url: '/api/v2/locales.json',
    }).then((data) => {
        return dispatch({
            type: actions.GET_LOCALES_SUCCESS,
            locales: data.locales,
        });
    }).catch(() => {
        return dispatch({
            type: actions.GET_LOCALES_FAILED,
        });
    });
}

export const setRequesterLocale = (requesterId, localeId) => dispatch => {
    dispatch({
        type: actions.SET_REQUESTER_LOCALE,
    });

    return ZAFClient.request({
        method: 'PUT',
        contentType: 'application/json',
        url: `/api/v2/users/${requesterId}.json`,
        data: JSON.stringify({
            user: {
                locale_id: localeId
            }
        })
    }).then((data) => {
        return dispatch({
            type: actions.SET_REQUESTER_LOCALE_SUCCESS,
        });
    }).catch(() => {
        return dispatch({
            type: actions.SET_REQUESTER_LOCALE_FAILED,
        });
    });
}

export const setAppHeight = height => {
    ZAFClient.invoke('resize', { width: '100%', height: (height) + 'px' });
}

export const resetStore = () => ({
    type: actions.RESET_STORE,
})
