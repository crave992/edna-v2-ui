import packageInfo  from '../../../../package.json';

const Footer = () => {
  return (
    <footer className="tw-absolute tw-bottom-0 tw-left-1/2 tw-transform -tw-translate-x-1/2 tw-text-xs-regular tw-text-quarterary tw-pb-4xl">
      Version {packageInfo.version}
    </footer>
  );
};

export default Footer;