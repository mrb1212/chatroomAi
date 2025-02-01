
import { useEffect, useRef } from 'react';

import {useSelector, useDispatch} from 'react-redux';
import type { AppDispatch, RootState  } from '@/src/stores/store';

import {useRouter} from 'next/router'


const Router = () => {

    const router = useRouter()

    const dispatch = useDispatch<AppDispatch>()
    const setting = useSelector((state : RootState) => state.setting);
    const historyUrl = setting.historyUrl
    const urlData = setting.urlData
    const selectedUrl = setting.selectedUrl
    const selectedUrlIndex = setting.selectedUrlIndex
    const mainUrl = setting.mainUrl

    const firstUpdate = useRef(true);
    useEffect(() =>{
        if(!router.isReady) return
        if(!firstUpdate.current){

            if(!historyUrl[2]) return // after adding pwa i needed this condition i have no idea why in dev mode only
            if(router.asPath === selectedUrl) return;
            
            router.push(selectedUrl) 
        }else{
        firstUpdate.current = false
        }
     return () => {}
    },[selectedUrl])

    const Set = (path) => {
        dispatch({
            type : "UPDATE_HISTORYURL",
            payload : {
                mode : "set",
                url : path
            }
        })
    }

    const back = () => {
        dispatch({
            type : "UPDATE_HISTORYURL",
            payload : {
                mode : "back"
            }
        })
    }
    const forward = () => {
        dispatch({
            type : "UPDATE_HISTORYURL",
            payload : {
                mode : "forward"
            }
        })
    }

    const data = {
        historyUrl,
        urlData,
        selectedUrl,
        selectedUrlIndex,
        mainUrl
    }

    return {Set, data, historyUrl, urlData, back, forward}

}

export {Router}
export default Router