import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Driver from '../../lib/driver/Driver';
import AssetList from '../Common/AssetList/AssetList';
import Sep7Handler from './Sep7Handler/Sep7Handler';
import { SESSION_STATE } from '../../lib/constants/sessionConstants';
import images from '../../images';

const tokenData = [
  {
    name: 'AFRO',
    description: 'One Africa Currency',
    imageSrc: 'https://res.cloudinary.com/dp7civtid/image/upload/v1692079822/AFRO_TOKEN_ndqlai.png', // Replace with the actual image source
    url: 'https://el-fort.xyz/El-Fort/payment-form/', // Replace with the actual URL
  },
  {
    name: 'ÇNB',
    description: 'Çannabis',
    imageSrc: 'https://res.cloudinary.com/dp7civtid/image/upload/v1695474886/CNB_bvlwjy.png', // Replace with the actual image source
    url: 'https://el-fort.xyz/El-Fort/payment-form/', // Replace with the actual URL
  },
  {
    name: 'LIFE',
    description: 'Life Support Token',
    imageSrc: 'https://res.cloudinary.com/dp7civtid/image/upload/v1691841326/life-800x600_m22ylm.png', // Replace with the actual image source
    url: 'https://el-fort.xyz/El-Fort/payment-form/', // Replace with the actual URL
  },
  {
    name: 'NATURE',
    description: 'Replenish The Earth',
    imageSrc: 'https://res.cloudinary.com/dp7civtid/image/upload/v1690650612/nature_pzqdla.png', // Replace with the actual image source
    url: 'https://el-fort.xyz/El-Fort/payment-form/', // Replace with the actual URL
  },
  {
    name: 'OSO',
    description: 'Osomba Token',
    imageSrc: 'https://res.cloudinary.com/dp7civtid/image/upload/v1695206993/oso_nwnm4h.png', // Replace with the actual image source
    url: 'https://el-fort.xyz/El-Fort/payment-form/', // Replace with the actual URL
  },
];

const BankTransferCard = () => {
  return (
    <div className="bank-transfer-card">
      <h1 className="payment-heading">Special Offer: Discounted LIFE Tokens for First 1,000 People</h1>
      <p className="payment-text">As a token of appreciation for your support, we are offering a limited-time discount on LIFE Tokens! You can purchase LIFE Tokens at a reduced rate to enable us to finish the development of the LIFE Smartchain and its eventful launch. Don't miss out on this exclusive opportunity to get involved in the LIFE Smartchain revolution at a discounted price.</p>
      <p className="payment-text">Stay tuned for updates when the LIFE Smartchain launches on January 1st, 2025!</p>

      <h1 className="payment-heading">Bank Transfer</h1>
      <p className="payment-text">You can make a payment directly into our bank account for the purchase of LIFE Tokens from the developers' faucet at discounted rates. Please use the following bank details:</p>

      <h3>Account Details</h3>
      <p className="payment-text">Bank Name: Stanbic IBTC Bank</p>
      <p className="payment-text">Account Name: EL-FORT GLOBAL SERVICES LTD.</p>
      <p className="payment-text">Account Number:0057979581 </p>

      <h3>Payment Details</h3>
      <p className="payment-text">Reference: Payment for LIFE</p>
      <p className="payment-text">Amount: ₦10,000.00 for 3,000 tokens </p>
      <p className="payment-text">Amount: ₦20,000.00 for 7,000 tokens </p>
      <p className="payment-text">Amount: ₦50,000.00 for 15,000 tokens </p>
      <p className="payment-text">Amount: ₦100,000.00 for 35,000 tokens </p>
      <p className="payment-text">Amount: ₦1,000,000.00 for 400,000 tokens </p>
      <p className="payment-text">After making the payment, please use the chat widget at the bottom-right corner of the page, or send an email to admin@el-fort.xyz with proof of payment and your public key, and our team will process your LIFE Token purchase. You can as well call +2349058528334.</p>
    </div>
  );
};

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.unsub = this.props.driver.session.event.sub(() => {
      this.forceUpdate();
    });
  }

  componentDidMount() {
    Sep7Handler(this.props.driver);
  }

  componentWillUnmount() {
    this.unsub();
  }

  renderHomePageActions() {
    const state = this.props.driver.session.state;
    if (state !== SESSION_STATE.OUT) {
      return '';
    }

    const signUpLinkClass = 'HomePage__lead__actions__sign-up-button HomePage__lead__actions__button s-button';
    return (
      <div className="HomePage__lead__actions">
        <Link className={signUpLinkClass} to="/signup/">New account</Link>
        &nbsp;
        <Link className="s-button HomePage__lead__actions__button" to="/account/">Log in</Link>
      </div>
    );
  }


  renderTokenCards() {
    return tokenData.map((token, index) => (
      <div className="token-card" key={index}>
        <a href={token.url} target="_blank" rel="noopener noreferrer">
          <img src={token.imageSrc} alt={`${token.name} Token`} width="150" height="150" />
        </a>
        <p>{`Buy ${token.name}`}</p>
        <p>{token.description}</p> {/* Render the description */}
      </div>
    ));
  }

  render() {
    return (
      <div>
        <div className="so-back islandBack">
          <div className="island">
            <div className="island__sub">
              <div className="token-cards-container">
                {this.renderTokenCards()}
              </div>
            </div>
          </div>
        </div>

      {/* Render BankTransferCard component */}
      <BankTransferCard />

  

        
        {/* Embedded YouTube Video */}
        <div className="video-card">
          <iframe
            width="640"
            height="360"
            src="https://www.youtube.com/embed/UsrBpqQl_Tg"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>

        {/* Announcement */}
        <div className="announcement">
          <p>
            
          </p>
        </div>

        <div className="HomePage__black">
          <div className="so-back">
            <div className="HomePage__lead">

              <h2 className="HomePage__lead__title">
                Trade on the <Link to="/exchange/">Stellar Decentralized Exchange</Link>
              </h2>

              <p className="HomePage__lead__summary">
                LIFE Smartchain will be launching on the 1st of January, 2024.
                Get ready for an exciting journey!
                LifeTrader is an <a href="https://github.com/El-Fort/stellarterm" target="_blank" rel="nofollow noopener noreferrer">
                open source</a> client for the <a href="https://www.stellar.org/" target="_blank" rel="nofollow noopener noreferrer">
                Stellar network</a>.
                <br />
                Send, receive, and <Link to="/exchange/">trade</Link> assets on the Stellar
                network easily with LifeTrader.
              </p>
              {this.renderHomePageActions()}
            </div>
          </div>
        </div>

        <div className="so-back islandBack HomePage__assetList">
          <div className="island">
            <AssetList d={this.props.driver} limit={10} />
            <Link to="/markets/" className="AssetListFooterAsLink">
              View more assets on the Markets page
              <img src={images['icon-arrow-right-green']} alt="" />
            </Link>
          </div>
        </div>

        <div className="so-back islandBack">
          <div className="island">
            <div className="island__sub">

              <div className="island__sub__division">
                <div className="HomePage__sideBlurb">
                  <p>
                    LifeTrader is just a client that can be used to
                    access the Stellar Decentralized Exchange. Neither
                    LifeTrader nor the developers of it are involved with
                    operating the Stellar network.
                  </p>
                  <p>
                    LifeTrader is developed by El-fort Global Services Ltd., the same
                    company that developed the YanHub, and YanMeets, Etc. The project is 
                    independent of the Stellar Development Foundation.
                  </p>
                </div>
              </div>

              <div className="island__sub__division">
                <div className="HomePage__sideBlurb">
                  <p>
                    LifeTrader is open source software.
                    To support the project, please{' '}
                    <a href="https://github.com/El-Fort" target="_blank" rel="nofollow noopener noreferrer">
                      star the project on GitHub
                    </a>.
                  </p>
                  <p>
                    The project is released under the
                    Apache-2.0 license and is released as is
                    without warranty.
                  </p>
                  <p>
                    LifeTrader is not a custodian of your assets.{' '}
                    We do not store any tokens, cryptoassets
                    or private keys on your behalf.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  driver: PropTypes.instanceOf(Driver).isRequired,
};


