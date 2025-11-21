import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = 'Zingle - Talk to Strangers | Random Video Chat';
    const defaultDescription = 'Experience the next generation of random video chat. Connect globally, stay anonymous, and find your vibe instantly on Zingle.';
    const defaultKeywords = 'random video chat, talk to strangers, omegle alternative, video chat app, anonymous chat, zingle';
    const siteUrl = 'https://zingle.chat'; // Replace with actual domain
    const defaultImage = 'https://zingle.chat/og-image.jpg'; // Replace with actual image URL

    return (
        <Helmet>
            <title>{title ? `${title} | Zingle` : siteTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || siteUrl} />
            <meta property="og:title" content={title ? `${title} | Zingle` : siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url || siteUrl} />
            <meta property="twitter:title" content={title ? `${title} | Zingle` : siteTitle} />
            <meta property="twitter:description" content={description || defaultDescription} />
            <meta property="twitter:image" content={image || defaultImage} />

            <link rel="canonical" href={url || siteUrl} />
        </Helmet>
    );
};

export default SEO;
