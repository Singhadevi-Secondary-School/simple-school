export interface PageContentProps {
  staff: Array<{
    id: string;
    position: string;
    name?: string;
    slug?: string;
    photo?: string;
    [key: string]: unknown;
  }>;
  schoolName: string;
}
