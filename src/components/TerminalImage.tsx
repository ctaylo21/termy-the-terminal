import React from 'react';

interface ImageProps {
  src: string;
}

const TerminalImage: React.FC<ImageProps> = ({ src }): JSX.Element => (
  <img src={src} />
);

export default TerminalImage;
