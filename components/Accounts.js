
import React from "react";
 
const AccountMessage = (props) => {

    var accountBoxSetting = "accountBoxNormal"
    var networkSetting = "networkNormal"

    if (props.verified) {
        accountBoxSetting = "accountBoxVerified"
        networkSetting = "networkVerified"
    }
    

    return(
        <p className={accountBoxSetting}>
        
            <p className={networkSetting}>
            {props.network}
            </p>   

            <p> {props.account}</p>

            {
            props.verified ? 
            <p className="verifiedText">
                Your account is verified
                {props.name}
            </p>
            : null
            }
        </p>
    )
};
export default AccountMessage;

