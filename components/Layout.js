
import React from "react";
import Header from './Header';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
 
const Layout = (props) => {
    return(
        <Container style={{width: "88%"}}>
            <Head>
                <link
                    rel="stylesheet"
                    href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
                ></link>
                <script src="/snarkjs.min.js" />
            </Head>

            <Header />
            {props.children}
        </Container>
    )
};
export default Layout;
