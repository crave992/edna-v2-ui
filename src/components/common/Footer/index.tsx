import siteMetadata from '@/constants/siteMetadata';
import packageInfo  from '../../../../package.json';

const Footer = () => {
    return (
        <p>{siteMetadata.shortName} v{packageInfo.version}</p>
    );
}

export default Footer;