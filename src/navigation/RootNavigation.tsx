import * as React from 'react';
import { createRef } from 'react';
export const navigationRef = createRef<any>();
export const  navigate = (name:string, params:any) => {
  navigationRef.current?.navigate(name, params);
}

