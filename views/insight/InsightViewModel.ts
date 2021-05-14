import { Episode } from '../home/Model';
export interface InsightViewModel{
    id:number,
    artwork:string,
    title:string,
    showNotes:string,
    episodes:Episode[]
}

export interface InsightHeaderViewModel{
    artwork:string,
    title:string,
    showNotes:string,
}