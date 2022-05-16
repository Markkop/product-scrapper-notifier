export type Product = {
  id: string | null;
  title: string | null | undefined;
  image: string | undefined;
  showcase: string[];
  url: string | null | undefined;
  price: string | null | undefined;
  isAvailable: boolean;
}