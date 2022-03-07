import React from "react";
import { useState, useContext } from "react";

const UserContext = React.createContext<string>('');
const UpdateUserContext = React.createContext((name: string)=>{});

export function User() {
    return useContext(UserContext);
}

export function UpdateUser() {
    return useContext(UpdateUserContext);
}

export const UserProvider: NextPage = (props: any) => {
    const [username, setUsername] = useState<string>('No Username')
    function updateUser(name: string) {
        setUsername(name);
    }

    return (
        <UserContext.Provider value={username}>
            <UpdateUserContext.Provider value={updateUser}>
                {props.children}
            </UpdateUserContext.Provider>
        </UserContext.Provider>
    );
}