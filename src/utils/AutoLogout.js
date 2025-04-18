import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { logoutMyAccount } from "../services/api";

const AutoLogout = () => {
    const navigate = useNavigate();
    let logoutTimer;

    const resetTimer = () => {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(() => {
            sessionStorage.clear();
            logoutMyAccount();
            Swal.fire({
                title: "Session Expired",
                text: "You have been logged out due to inactivity.",
                icon: "warning",
                confirmButtonText: "Login Again"
            }).then(() => {
                navigate("/login");
            });
        }, 50 * 60 * 1000);
    };

    useEffect(() => {
        resetTimer();
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);

        return () => {
            clearTimeout(logoutTimer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
        };
    }, [navigate]);

    return null;
};

export default AutoLogout;
