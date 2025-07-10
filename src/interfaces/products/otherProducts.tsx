import { IProducts } from "./products";
import { IReviews } from "../reviews/reviews";
export interface IRandomProductResult {
    products: IProducts[];
    reviews: IReviews[];
  }