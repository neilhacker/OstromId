import React from 'react';
import { Navbar } from 'react-bootstrap';

import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

const Header = () => {
    return (
        <Navbar className="menu">
            <Link route='/'>
                <a className="menuOption">Verify</a>
            </Link>

            <Link route='/about'>
                    <a className="menuOption">About</a>
            </Link>

            <Link route='/checkAddress'>
                    <a className="menuOption">Check Address</a>
            </Link>

        </Navbar>
    )
}

export default Header;