import React from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import zafClient from '../misc/ZAFClient'

import {
  getRequester,
  setRequesterLocale,
  getLocales,
  resetStore,
  setAppHeight
} from '../actions'

const Main = props => {
  const { requester, locales, isLoading, isSettingLocale, setRequesterLocale } = props

  React.useEffect(() => {
    zafClient.get(['ticket', 'currentUser', 'currentAccount']).then(function (data) {
      const {
        currentUser: {
          id: user_id,
          locale: user_locale,
        },
        currentAccount: {
          subdomain: zendesk_domain,
          planName: subscription_plan
        }
      } = data
    
      window.gtag('config', 'G-BNK08B4B6S', { user_id, cookie_flags: 'SameSite=None;Secure', send_page_view: false })
      window.gtag('set', 'user_properties', { zendesk_domain, subscription_plan, user_locale })
      
      const isNewTicket = data.ticket.isNew
      if (isNewTicket) return
    
      const {
        ticket: {
          id: ticket_id,
          type,
          priority,
          status,
          via: { channel },
          createdAt: ticket_created_at,
          requester: { locale: requester_locale },
          brand: {
            hasHelpCenter: brand_has_help_center,
            name: brand_name,
            subdomain: brand_subdomain,
          }
        }
      } = data
      const eventData = { ticket_id, type, priority, status, channel, created_at: new Date(ticket_created_at), requester_locale, brand_name, brand_subdomain, brand_has_help_center }
      
      window.gtag('event', 'view_ticket', eventData)
    })

    Promise.all([
      props.getRequester(),
      props.getLocales()
    ]).then(() => {
      setTimeout(() => {
        const height = document.getElementById('app').clientHeight;
        setAppHeight(height);
      }, 100);
    })

    zafClient.on('ticket.requester.id.changed', id => {
      props.getRequester(id).then(() => {
        setTimeout(() => {
          const height = document.getElementById('app').clientHeight;
          setAppHeight(height);
        }, 100);
      })
    })
  }, [])

  const handleLanguageChange = e => {
    const value = e.target.value;
    setRequesterLocale(requester.id, value).then(() => {
      getRequester(requester.id)
    });
  }

  if (isLoading || !locales) {
    return <div>Loading, please wait...</div>
  }

  if (!requester) {
    return (
      <div style={{ paddingTop: '10px', textAlign: 'center' }}>
        Please add a requester to the ticket
        <Footer />
      </div>
    )
  }

  const localeArr = locales.filter(loc => loc.locale === requester.locale)

  return <div style={{ overflow: 'hidden' }}>
    <select
      onChange={handleLanguageChange}
      value={(requester && localeArr.length === 1) && localeArr[0].id}
      style={{ width: '100%', height: '30px', marginTop: '10px' }}
    >
      {locales.map(locale => {
        return <option key={locale.id} value={locale.id}>
          {locale.name}
        </option>
      })}
    </select>
    {isSettingLocale &&
      <div style={{ width: '25px', height: '25px', position: 'absolute', bottom: 0, right: 0 }}>
        <svg className="spinner" viewBox="0 0 50 50">
          <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
      </div>}
    <Footer />
  </div>
}

const mapStateToProps = state => ({
  requester: state.requester,
  locales: state.locales,
  isLoading: state.isLoadingRequester && state.isLoadingLocales,
  isSettingLocale: state.isSettingLocale
})

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    getRequester,
    setRequesterLocale,
    getLocales,
    resetStore
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)

const Footer = () => (
  <footer>
    <a target="_blank" href="https://www.cloudhuset.dk">Made with <img src="heart-icon.png" style={{ verticalAlign: 'middle', width: '16px' }} /> and <img src="coffee-icon.png" style={{ verticalAlign: 'middle', width: '16px' }} /> by Cloudhuset</a>
  </footer>
)