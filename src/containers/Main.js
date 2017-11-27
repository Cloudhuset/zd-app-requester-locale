import React from "react";
import { render } from 'react-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
    getRequester,
    setRequesterLocale,
    getLocales,
    resetStore,
    setAppHeight
} from '../actions'

@connect(
    state => ({
        requester: state.requester,
        locales: state.locales,
        isLoading: state.isLoadingRequester && state.isLoadingLocales,
        isSettingLocale: state.isSettingLocale
    }),
    dispatch => ({
        ...bindActionCreators({
            getRequester,
            setRequesterLocale,
            getLocales,
            resetStore
        }, dispatch),
    })
)
export default class Main extends React.Component {

    constructor(props) {
        super(props)

        props.resetStore()
        props.getRequester().then(() => {
            return props.getLocales();
        }).then(() => {
            setTimeout(() => {
                const height = document.getElementById('app').clientHeight;
                setAppHeight(height);
            }, 100);
        })
    }

    render() {
        const { requester, locales, isLoading, isSettingLocale } = this.props

        if(isLoading || locales === null || requester === null) {
            return (
                <div>
                    Loading, please wait...
                </div>
            )
        }

        const imgStyle = {verticalAlign: 'middle'};
        return <div style={{overflow: 'hidden'}}>
            <select
                onChange={this.handleLanguageChange.bind(this)}
                defaultValue={locales.filter(loc => loc.locale === requester.locale)[0].id}
                style={{width: '100%', height: '30px', marginTop: '10px'}}
            >
                {locales.map(locale => {
                    return (
                        <option key={locale.id} value={locale.id}>
                            {locale.name}
                        </option>
                    )
                })}
            </select>
            {isSettingLocale &&
            <div style={{width: '25px', height: '25px', position: 'absolute', bottom: 0, right: 0}}>
                <svg className="spinner" viewBox="0 0 50 50">
                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
            </div>}
            <footer>
                <a target="_blank" href="https://www.cloudhuset.dk">Made with <img src="heart-icon.png" style={{verticalAlign: 'middle', width: '16px'}} /> and <img src="coffee-icon.png" style={{verticalAlign: 'middle', width: '16px'}} /> by Cloudhuset</a>
            </footer>
        </div>
    }

    handleLanguageChange(e) {
        const { setRequesterLocale, requester } = this.props;

        const value = e.target.value;
        setRequesterLocale(requester.id, value);
    }
}
