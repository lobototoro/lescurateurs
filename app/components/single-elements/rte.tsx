'use client';
import dynamic from 'next/dynamic';
import React, { useState, useMemo, useEffect } from 'react';

import 'react-quill-new/dist/quill.snow.css';
import './rte.css';

export default function RTE(props: {
  'field-id': string;
  'aria-label': string;
  className?: string;
  'data-testid': string;
  getMainContent: (v: string) => void;
  watch: (
    names?: string | string[] | ((data: any, options: any) => void)
  ) => unknown;
  register: (
    name: string,
    options?: any
  ) => { onChange: any; onBlur: any; name: any; ref: any };
}) {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill-new'), { ssr: false }),
    []
  );

  useEffect(() => {
    props.register('main');
  }, [props.register]);

  const onChange = (mainState: string) => {
    props.getMainContent(mainState);
  };

  const mainContent = props.watch('main');

  return (
    <ReactQuill
      id={props['field-id']}
      theme="snow"
      value={mainContent as string}
      onChange={onChange}
    >
      <div
        aria-label={props['aria-label']}
        className={`custom-text-area ${props.className}`}
        data-testid={props['data-testid']}
      />
    </ReactQuill>
  );
}
