import React from 'react';
import Close from '@mui/icons-material/Close';

import { openLink } from '@/utils/helperFunctions';
import { useAppDispatch, useAppSelector } from '@/webapp/redux/hooks';
import { updateBannerData, Banner } from './redux/bannerSlice';
import './UpdateBanner.scss';

const latestLink = 'https://github.com/coltoneshaw/3c-portfolio-manager/releases';

const returnBannerElement = (type: Banner, message: string) => {
  if (type === 'updateVersion') {
    return (
      <p>
        {' '}
        There is a new update available! Click
        {' '}
        <span
          onClick={() => openLink(`${latestLink}/tag/${message}`)}
          onKeyDown={() => openLink(`${latestLink}/tag/${message}`)}
          tabIndex={0}
          role="link"
        >
          here
        </span>
        {' '}
        to download
        {' '}
        {message}
        .
      </p>
    );
  }
  return <p>{message}</p>;
};

type BannerType = {
  type: Banner,
  message: string
};
const UpdateAvailableBanner: React.FC<BannerType> = ({ type, message }) => {
  const dispatch = useAppDispatch();

  return (
    <div
      className="update-mainDiv"
      style={{
        backgroundColor: (type === 'apiError') ? 'var(--color-red)' : '#93C5FD',
        color: (type === 'apiError') ? 'white' : undefined,
      }}
    >
      {returnBannerElement(type, message)}
      <Close
        className="closeIcon"
        onClick={() => dispatch(updateBannerData({ show: false, message: '', type: '' }))}
      />
    </div>
  );
};

const UpdateBanner = () => {
  const { show, message, type } = useAppSelector((state) => state.banner);

  if (show) return <UpdateAvailableBanner type={type} message={message} />;
  return null;
};

export default UpdateBanner;
