import React, { useEffect } from 'react';
import { driver } from 'driver.js';
import './driver.css';
import 'driver.js/dist/driver.css';

export default function DriverComponent({ steps, isAtivo, setShowTutorial }) {
    useEffect(() => {
        const driverObj = driver({
            popoverClass: 'driverjs-theme',
            nextBtnText: 'Próximo',
            prevBtnText: 'Anterior',
            doneBtnText: 'Fechar',
            overlayColor: '#006b33',
            showProgress: true,
            overlayOpacity: 0.8,
            stagePadding: 2,
            stageRadius: 5,
            smoothScroll: true,
            allowClose: false,
            onDestroyed: () => setShowTutorial(false),
        });
        if (isAtivo) {
            driverObj.setSteps(steps);
            driverObj.drive();
        }
        return () => {
            driverObj.destroy();
        };
    }, [steps, isAtivo, setShowTutorial]);

    return null;
}