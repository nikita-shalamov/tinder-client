import SettingsList from "../components/SettingsList/SettingsList";
import { useUserContext } from "../context/UserContext";
import useRegisterData from "../hooks/userData/registerData.hook";
import dayjs from "dayjs";

function calculateAge(birthdateString: string) {
    const birthdate = dayjs(birthdateString);
    const today = dayjs();
    return today.diff(birthdate, "year");
}

const Profile = () => {
    const { userData, userPhotos } = useUserContext();
    console.log("profile userPhotos", userPhotos);

    return (
        <div className="profile">
            <div className="profile__wrapper">
                <div className="profile__photo">{userPhotos.length > 0 && <img src={URL.createObjectURL(userPhotos[0])} alt="" />}</div>
                <div className="profile__name">
                    {userData.name}, {calculateAge(userData.birthDate)}
                </div>
                <SettingsList />
            </div>
        </div>
    );
};

export default Profile;
