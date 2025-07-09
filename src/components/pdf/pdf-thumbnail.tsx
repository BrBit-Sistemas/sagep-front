import '@react-pdf-viewer/core/lib/styles/index.css';

import type { ViewerProps } from '@react-pdf-viewer/core';

import * as React from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';

import { pageThumbnailPlugin } from './pdf-thumbnail-plugin';

interface PdfThumbnailProps extends Omit<ViewerProps, 'fileUrl'> {
  fileUrl: string;
  pageIndex: number;
  width?: number;
}

export const PdfThumbnail: React.FC<PdfThumbnailProps> = ({
  fileUrl,
  pageIndex,
  width,
  ...props
}) => {
  const thumbnailPluginInstance = thumbnailPlugin();
  const { Cover } = thumbnailPluginInstance;

  const pageThumbnailPluginInstance = pageThumbnailPlugin({
    PageThumbnail: <Cover width={width} getPageIndex={() => pageIndex} />,
  });

  return (
    <Viewer
      fileUrl={fileUrl}
      plugins={[pageThumbnailPluginInstance, thumbnailPluginInstance]}
      {...props}
    />
  );
};
