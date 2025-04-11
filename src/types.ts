export interface Creative {
    creative_id: string;
    type: string;
    auto_endcard: boolean;
    file_url: string;
  }
  
export interface CreativeGroup {
    creative_group_id: string;
    name: string;
    creative_ids: string[];
    creatives?: Creative[];
    impressions?: number;
    clicks?: number;
    conversions?: number;
  }
  
export interface Campaign {
    campaign_id: string;
    name: string;
    creative_group_ids: string[];
    status: string;
    impressions: number;
    creative_groups?: CreativeGroup[];
  }