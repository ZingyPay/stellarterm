import React from 'react';
import PropTypes from 'prop-types';
import * as StellarSdk from '@stellar/stellar-sdk';
import Driver from '../../../../lib/driver/Driver';
import ErrorHandler from '../../../../lib/helpers/ErrorHandler';
import TransactionAuthorBlock from '../TransactionAuthorBlock/TransactionAuthorBlock';
import AccountModalBlock from '../AccountModalBlock/AccountModalBlock';
import Ellipsis from '../../../Common/Ellipsis/Ellipsis';
import AssetCardSeparateLogo from '../../../Common/AssetCard/AssetCardSeparateLogo/AssetCardSeparateLogo';
import Sep7GetBuiltTx from '../Sep7GetBuiltTx/Sep7GetBuiltTx';
import { AUTH_TYPE, SESSION_STATE, TX_STATUS } from '../../../../lib/constants/sessionConstants';

const images = require('./../../../../images');


export default class Sep7ChangeTrustModal extends React.Component {
    static clearUri() {
        window.history.pushState({}, null, '/');
    }

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            pending: false,
            desc: undefined,
            conditions: undefined,
            loaded: false,
            isLoadInProcess: false,
        };
        this.unsub = this.props.d.session.event.sub(() => {
            this.forceUpdate();
        });
    }

    componentDidMount() {
        const { d, submit } = this.props;
        const { line } = this.getTransactionDetails();
        if (!this.state.isLoadInProcess) {
            this.getDataFromToml(line, d, submit);
        }
    }

    componentWillUnmount() {
        this.unsub();
    }

    getTransactionDetails() {
        const { txDetails, d } = this.props;
        const { xdr, originDomain } = txDetails;
        const tx = new StellarSdk.Transaction(xdr, d.Server.networkPassphrase);
        const { value } = StellarSdk.Memo.fromXDRObject(tx._memo);
        const memo = value && value.toString();
        const [operation] = tx.operations;
        const { limit, line } = operation;

        return { line, limit, memo, originDomain };
    }

    getButtons() {
        const { submit, d } = this.props;
        const { state } = d.session;
        const { pending } = this.state;
        if (state !== SESSION_STATE.IN) {
            return null;
        }
        return (
            <div className="Modal_button-block">
                <button
                    className="cancel-button"
                    onClick={() => {
                        window.history.pushState({}, null, '/');
                        submit.cancel();
                    }}
                >
                    Cancel
                </button>
                <button
                    disabled={this.state.pending}
                    onClick={() => this.handleSubmit()}
                    className="s-button"
                >
                    Confirm{pending && <Ellipsis />}
                </button>
            </div>
        );
    }

    async getDataFromToml(asset, d, submit) {
        this.setState({ isLoadInProcess: true });
        try {
            const domain = await d.session.handlers.getDomainByIssuer(asset.issuer);
            const toml = await StellarSdk.StellarToml.Resolver.resolve(domain);
            const { CURRENCIES } = toml;
            if (!CURRENCIES) {
                return;
            }
            const currency = CURRENCIES.find(curr => (curr.code === asset.code && curr.issuer === asset.issuer));

            if (!currency) {
                submit.cancel();
                d.modal.handlers.activate('Sep7ErrorModal',
                    'Could not verify the asset connection to home domain.');
            }

            const { desc, conditions } = currency || '';
            this.setState({
                desc,
                conditions,
                loaded: true,
            });
        } catch (e) {
            this.setState({
                desc: '',
                conditions: '',
                loaded: true,
            });
        }
    }

    async handleSubmit() {
        this.setState({ pending: true });
        const { d, submit, txDetails } = this.props;
        const { authType } = d.session;

        if (authType === AUTH_TYPE.LEDGER) {
            submit.cancel();
        }

        try {
            const tx = await Sep7GetBuiltTx(txDetails, d);

            const bssResult = await d.session.handlers.signSubmit(tx);

            if (bssResult.status === TX_STATUS.SENT_TO_WALLET_CONNECT) {
                this.constructor.clearUri();
            }
            if (bssResult.status === TX_STATUS.AWAIT_SIGNERS) {
                submit.cancel();
                this.constructor.clearUri();
            }
            if (bssResult.status === TX_STATUS.FINISH) {
                await bssResult.serverResult;
                submit.cancel();
                this.constructor.clearUri();
            }
        } catch (e) {
            this.setState({
                error: e,
                pending: false,
            });
        }
    }

    render() {
        const { submit, d } = this.props;
        const { account } = d.session;
        const { line, limit, memo, originDomain } = this.getTransactionDetails();
        const buttons = this.getButtons();
        const { desc, conditions, loaded, error } = this.state;
        const balance = account && account.getBalance(line);

        if (!loaded) {
            return (
                <div className="Sep7ChangeTrustModal">
                    <div className="Modal_header">
                        <span>{parseFloat(limit) === 0 ? 'Remove asset' : 'Add new asset'}</span>
                        <img
                            src={images['icon-close']}
                            alt="X"
                            onClick={() => {
                                submit.cancel();
                                window.history.pushState({}, null, '/');
                            }}
                        />
                    </div>
                    <div className="Sep7ChangeTrustModal_loading">
                        Loading<Ellipsis />
                    </div>
                </div>
            );
        }

        return (
            <div className="Sep7ChangeTrustModal">
                <div className="Modal_header">
                    <span>{parseFloat(limit) === 0 ? 'Remove asset' : 'Add new asset'}</span>
                    <img
                        src={images['icon-close']}
                        alt="X"
                        onClick={() => {
                            submit.cancel();
                            window.history.pushState({}, null, '/');
                        }}
                    />
                </div>
                <div className="Sep7ChangeTrustModal_content">
                    <AssetCardSeparateLogo
                        d={d}
                        code={line.code}
                        issuer={line.issuer}
                    />
                    {desc &&
                        <div className="Sep7ChangeTrustModal_desc">
                            <span>{desc}</span>
                        </div>}
                    {conditions &&
                        <div className="Sep7ChangeTrustModal_conditions">
                            <span>Conditions</span>
                            <span>{conditions}</span>
                        </div>}
                    {memo &&
                        <div className="Sep7ChangeTrustModal_conditions">
                            <span>Memo</span>
                            <span>{memo}</span>
                        </div>
                    }

                    {parseFloat(limit) === 0 && balance &&
                        <div className="Sep7ChangeTrustModal_conditions">
                            <span>Balance</span>
                            <span>{balance} {line.code}</span>
                        </div>}

                    <TransactionAuthorBlock domain={originDomain} />
                    <AccountModalBlock d={d} />
                    {error &&
                        <div className="ErrorTransactionBlock">
                            <img src={images['icon-circle-fail']} alt="fail" />
                            <span>{ErrorHandler(error)}</span>
                        </div>}
                    {buttons}
                </div>
            </div>
        );
    }
}
Sep7ChangeTrustModal.propTypes = {
    d: PropTypes.instanceOf(Driver).isRequired,
    submit: PropTypes.objectOf(PropTypes.func),
    txDetails: PropTypes.objectOf(PropTypes.any),
};

