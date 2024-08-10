import { Routes, Route } from "react-router-dom";
import PersonalInfo from "../pages/Profile/PersonalInfo";
import Descr from "../pages/Profile/Descr";
import Profile from "../pages/Profile";
import PhotosProfile from "../pages/Profile/PhotosProfile";
import { useEffect } from "react";
import { useUserContext } from "../context/UserContext";

const ProfileRoutes = () => {
    const { userData, userPhotos, getMissingFields, missingFields } = useUserContext();

    useEffect(() => {
        console.log(userData, userPhotos);
        getMissingFields();
        console.log(missingFields);
    }, [userData, userPhotos]);

    return (
        <Routes>
            <Route path="/" element={<Profile />}></Route>
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route path="aboutme" element={<Descr />} />
            <Route path="photos" element={<PhotosProfile />} />
        </Routes>
    );
};

export default ProfileRoutes;
