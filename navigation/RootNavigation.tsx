import * as React from 'react';
import { createRef } from 'react';
export const navigationRef = createRef<any>();
export function navigate(name:string, params:any) {
  navigationRef.current?.navigate(name, params);
}

