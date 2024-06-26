import React from 'react';
import PropTypes from 'prop-types';
import * as StellarSdk from '@stellar/stellar-sdk';
import Driver from '../../../../../../lib/driver/Driver';
import Ellipsis from '../../../../../Common/Ellipsis/Ellipsis';
import { TX_STATUS } from '../../../../../../lib/constants/sessionConstants';
import ErrorHandler from '../../../../../../lib/helpers/ErrorHandler';

export default class RemoveTrustLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'ready', // Can be: ready, pending, error
        };
    }

    handleRemoveTrust(e) {
        e.preventDefault();
        const { code, issuer } = this.props.balance;

        this.props.d.session.handlers.removeTrust(code, issuer).then(({ status, serverResult }) => {
            if (status !== TX_STATUS.FINISH) {
                return null;
            }

            this.setState({ status: 'pending' });
            return serverResult
                .then(res => console.log('Successfully removed trust', res))
                .catch((err) => {
                    this.props.d.toastService.error('Can’t remove asset', ErrorHandler(err));
                    console.log('Errored when removing trust', err);
                    this.setState({ status: 'error' });
                });
        });
    }

    render() {
        const { status } = this.state;
        const { account } = this.props.d.session;
        const { balance, code, issuer } = this.props.balance;
        const balanceIsZero = balance === '0.0000000';
        const orderExists = account.isOrderExists(new StellarSdk.Asset(code, issuer));

        if (!balanceIsZero) {
            return <span className="BalancesTable__row__removeLink"> Asset can be removed when balance is 0</span>;
        } else if (orderExists) {
            return <span className="BalancesTable__row__removeLink"> Close all orders to remove asset</span>;
        }

        if (status === 'ready') {
            return (
                <a className="BalancesTable__row__removeLink" onClick={e => this.handleRemoveTrust(e)}>
                    Remove asset
                </a>
            );
        } else if (status === 'pending') {
            return (
                <span className="BalancesTable__row__removeLink">
                    Removing asset
                    <Ellipsis />
                </span>
            );
        }
        return (
            <a className="BalancesTable__row__removeLink" onClick={e => this.handleRemoveTrust(e)}>
                Errored when removing asset
            </a>
        );
    }
}

RemoveTrustLink.propTypes = {
    d: PropTypes.instanceOf(Driver).isRequired,
    balance: PropTypes.objectOf(PropTypes.any).isRequired,
    code: PropTypes.string,
    issuer: PropTypes.string,
};
