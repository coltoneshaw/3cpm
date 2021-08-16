import React from 'react';

import './icon.scss'

const LoaderIcon = () => {

  return (
    <svg id="loadingIcon" version="1.1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px"
      width="24px" height="24px" viewBox="0 0 24 30">
      <rect x="0" y="0" width="4" height="10">
        <animateTransform attributeType="xml"
          attributeName="transform" type="translate"
          values="0 0; 0 20; 0 0"
          begin="0" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="10" y="0" width="4" height="10">
        <animateTransform attributeType="xml"
          attributeName="transform" type="translate"
          values="0 0; 0 20; 0 0"
          begin="0.2s" dur="0.6s" repeatCount="indefinite" />
      </rect>
      <rect x="20" y="0" width="4" height="10">
        <animateTransform attributeType="xml"
          attributeName="transform" type="translate"
          values="0 0; 0 20; 0 0"
          begin="0.4s" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>

  )
}

export default LoaderIcon;