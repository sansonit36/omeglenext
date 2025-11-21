import React, { useEffect, useRef } from 'react';

const AdsterraNativeBanner = () => {
    const bannerRef = useRef(null);

    useEffect(() => {
        if (bannerRef.current && !bannerRef.current.firstChild) {
            const script = document.createElement('script');
            script.src = '//jubileebread.com/bf4ad6e10808f31d16dd956ce8ce2c3e/invoke.js';
            script.async = true;
            script.dataset.cfasync = 'false';
            bannerRef.current.appendChild(script);

            const container = document.createElement('div');
            container.id = 'container-bf4ad6e10808f31d16dd956ce8ce2c3e';
            bannerRef.current.appendChild(container);
        }
    }, []);

    return (
        <div ref={bannerRef} className="flex justify-center my-4" />
    );
};

export default AdsterraNativeBanner;
