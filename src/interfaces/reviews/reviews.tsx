
export interface IReviews {

    reviews: [
        {

            id: number,
            id_user: number,
            id_product: number,
            stars: number,
            commentary: string,
            name: string,
            image: string,
            created_at: string,
            updated_at: string

        }
    ]

    averageStars: [

        {

            stars: number,
            percentage: number

        }
    ],

    stars: number


}

export interface AllReviews {

        id: number;
        id_user: number;
        id_product: number;
        stars: number;
        commentary: string;
        name: string;
        image: string;
        created_at: string;
        updated_at: string;
        

}