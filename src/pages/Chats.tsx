import ChatsList from "../components/ChatsList/ChatsList";
import Matches from "../components/Matches/Matches";

const Chats = () => {
    return (
        <div className="background">
            <div className="background__wrapper">
                <Matches />
                <ChatsList />
            </div>
        </div>
    );
};

export default Chats;
