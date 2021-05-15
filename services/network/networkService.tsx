import axios from 'axios';
import {useEffect, useState} from 'react';
import { useAppContextStore } from '../../context/AppContext';
import {HttpMethod} from './http_methods';

interface NetRes<T>{
  data:T,
  error:string,
  isLoading:boolean
}

export function useNetworkService<T>(
  url: string,
  method: HttpMethod = HttpMethod.get,
  headers: Headers | null
){
  const initValue:NetRes<T> = {data:null, error:null , isLoading: false};
  const [res, setRes] = useState<NetRes<T>>(initValue);
  
//  Network here.
  useEffect(() => {
    setRes(prevState => ({...prevState, isLoading: true}));
    const instance = axios.create({
      baseURL: url,
      timeout: 1000,
      headers: headers,
    });
    console.log(method);
    switch (method) {
      case HttpMethod.get:
        instance
          .get('/longRequest')
          .then(response => {
            var jsonString = JSON.stringify(response.data);
            const res:T = JSON.parse(jsonString);
            setRes({data: res, isLoading: false, error: null});
          })
          .catch(err => {
            console.log(err);
            setRes({data: null, isLoading: false, error: err});
          });
        break;
      case HttpMethod.post:
        instance
          .post('/longRequest')
          .then(response => {
            var jsonString = JSON.stringify(response.data);
            const res:T = JSON.parse(jsonString);
            setRes({data: res, isLoading: false, error: null});
          })
          .catch(err => {
            console.log(err);
            setRes({data: null, isLoading: false, error: err});
          });
        break;
      case HttpMethod.patch:
        instance
          .post('/longRequest')
          .then(response => {
           var jsonString = JSON.stringify(response.data);
            const res:T = JSON.parse(jsonString);
            setRes({data: res, isLoading: false, error: null});
          })
          .catch(err => {
            console.log(err);
            setRes({data: null, isLoading: false, error: err});
          });
        break;
      default:
        break;
    }
    return () => {
      console.log("finish");
    }
  }, []);
 
  return res;
};
