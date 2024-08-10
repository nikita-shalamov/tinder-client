import { useState } from "react";
// import { authCheck } from "../../service/authCheck";
import { createUser as create } from "../../service/createUser";

export default function StartPage() {
    const [pageCounter, setPageCounter] = useState(0);
    // const [newUser, setNewUser] = useState(false);
    // const [createUser, setCreateUser] = useState(false);

    const onChangePageCounter = () => {
        setPageCounter((prevPageCounter) => prevPageCounter + 1);
        // authStatus(pageCounter);
    };

    // const authStatus = async (id: number) => {
    //     const userStatus = await authCheck().checkAuth(id);
    //     setNewUser(userStatus);
    // };

    // const createUserMethod = async (telegramId: number, username: string) => {
    //     const user = await create().createRandomUser({ telegramId, username });
    //     setCreateUser(user);
    //     console.log(user);
    // };

    const data = [
        {
            numPage: 1,
            img: "/photos/cat.png",
            title: "Lorem ipsum dolor sit amet",
            descr: "Lorem ipsum dolor sit amet, consectetur adipisicingelit. Veritatis sapiente iure, debitis",
        },
        {
            numPage: 2,
            img: "/photos/cat.png",
            title: "Lorem ipsum dolor sit amet 2",
            descr: "Lorem ipsum dolor sit amet, consectetur adipisicingelit. Veritatis sapiente iure, debitis 2",
        },
    ];

    return (
        <div className="start-page">
            <div className="start-page__wrapper">
                <div className="start-page__image">
                    <img src={data[pageCounter].img} alt="" className="start-page__image" />
                </div>
                <div className="start-page__title">{data[pageCounter].title}</div>
                <div className="start-page__descr">{data[pageCounter].descr}</div>
            </div>
        </div>
    );
}
