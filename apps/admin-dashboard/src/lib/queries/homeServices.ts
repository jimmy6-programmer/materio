export interface HomeService {
  id: string;
  image_url?: string;
  category: string;
  title: string;
  description?: string;
  price_from: number;
  status?: string;
  created_at?: string;
}

export default HomeService;
