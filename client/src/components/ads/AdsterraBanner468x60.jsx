import React, { useEffect, useRef } from 'react';

const AdsterraBanner468x60 = () => {
    const bannerRef = useRef(null);

    useEffect(() => {
        if (bannerRef.current && !bannerRef.current.firstChild) {
            const confScript = document.createElement('script');
            confScript.type = 'text/javascript';
            confScript.innerHTML = `
                atOptions = {
                    'key' : '92ab75b654484c3f51b8dbcdc14293c0',
                    'format' : 'iframe',
                    'height' : 60,
                    'width' : 468,
                    'params' : {}
                };
            `;
            bannerRef.current.appendChild(confScript);

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//jubileebread.com/92ab75b654484c3f51b8dbcdc14293c0/invoke.js';
            bannerRef.current.appendChild(script);
        }
    }, []);

    return (
        <div ref={bannerRef} className="flex justify-center my-2 overflow-hidden" />
    );
};

export default AdsterraBanner468x60;
