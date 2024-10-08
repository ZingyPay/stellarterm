import React from 'react';
import Generic from '../Common/Generic/Generic';

export default () => (
    <Generic title="Privacy Policy">
        <p>This policy may be updated or revised without notice. It is the responsibility of the user to stay
            informed about privacy policy changes.</p>
        <p>LifeTrader does not track your actions on this client.</p>
        <p>LifeTraderdoes not store cookies and the website does not contain any analytics scripts.</p>
        <p>LifeTrader developers never see your private keys.</p>
        <p>However, el-fort.xyz is hosted on GitHub, AWS, and Cloudflare infrastructure. They may and do
            have their own tracking systems on their servers. Those services have their own privacy policies and
            they are not covered by this privacy policy.</p>
        <p>While LifeTrader does not track you, this does not mean your actions are private. Take note of other
            privacy issues that may affect you:</p>
        <ul className="privacy__ul">
            <li>Stellar is a public ledger. Anyone can see anything that happens on the network.</li>
            <li>Your inflation vote is publicly visible.</li>
            <li>Your computer might be compromised.</li>
            <li>The LifeTrader website might be compromised.</li>
        </ul>
    </Generic>
);
