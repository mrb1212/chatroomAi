import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import type { AppDispatch, RootState  } from '@/src/stores/store';
import axios from 'axios';

function useAuthImage(url ?: any, reloadOn ?: any) {
   const auth = useSelector((state : RootState) => state.auth)

   const [image, setImage] = useState("")
  console.log(url)
   if(!url) return
   if(!auth.isAuthenticated)  return
   
       (async () => {
           if(!url) return;
            if(!auth.isAuthenticated)  return;
            if(!auth.token) return;

            const config : any = {
                headers: {},
                responseType : "blob"
             }
             if (auth.token) {
                config.headers["x-auth-token"] = auth.token;
              }

            await axios.get(url,config)
            .then(res=> {
                var reader = new FileReader();
                reader.onload = (onLoadEvent) => {
                    let _revFile : any = onLoadEvent.target?.result
                    setImage(_revFile)
                }
                reader.readAsDataURL(res.data);
            })
            .catch(err=>{
                console.log(err)
            })

        })()

    return image;
  }


  export default useAuthImage