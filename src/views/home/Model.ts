import { DownloadProgress } from './../../services/download/DownloadModel';

export interface PodCast{
    id:number,
    title:string,
    slug:string,
    short_description:string,
    description:string,
    artwork:string,
    company_logo:string,
    public_email:string,
    linkedin:string,
    twitter:string,
    instagram:string,
    facebook: string,
    created_at:string,
    updated_at:string,
    episodes:Episode[]
}

export interface Episode {
    id: number,
    uid:string,
    isDownloaded:DownloadProgress,
    cachedUrl:string,
    podcast_id: number,
    title:string|null,
    sub_title: string|null,
    slug: string,
    description: string,
    episode_kind: string,
    explicit_content: boolean,
    season: string,
    episode_number: string,
    audio_file: string,
    audio_file_original_name: string,
    artwork: string,
    artwork_original_name: string,
    duration: string,
    audio_size: string,
    guests: string,
    publication_date: string,
    created_at: string,
    updated_at: string
}