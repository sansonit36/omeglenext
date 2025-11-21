import React, { useEffect, useRef } from 'react';

const AdsterraBanner160x600 = () => {
    const bannerRef = useRef(null);

    useEffect(() => {
        if (bannerRef.current && !bannerRef.current.firstChild) {
            const confScript = document.createElement('script');
            confScript.type = 'text/javascript';
            confScript.innerHTML = `
                atOptions = {
                    'key' : '8ce4488ebf7b4178f96f498519dc924a',
                    'format' : 'iframe',
                    'height' : 600,
                    'width' : 160,
                    'params' : {}
                };
            `;
            bannerRef.current.appendChild(confScript);

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//jubileebread.com/8ce4488ebf7b4178f96f498519dc924a/invoke.js';
            bannerRef.current.appendChild(script);
        }
    }, []);

    return (
        <div ref={bannerRef} className="flex justify-center my-4" />
    );
};

export default AdsterraBanner160x600;
