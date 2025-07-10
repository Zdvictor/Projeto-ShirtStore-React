import React from "react";
import {toast} from "react-toastify"

interface IHandleItems {

    qtdItems: number,
    setQtdItems: React.Dispatch<React.SetStateAction<number>>,
    setPrice: React.Dispatch<React.SetStateAction<number>>,
    pricePerItem: number,
    operation: "add" | "remove"

}

export const handleItems =  ({qtdItems, setQtdItems, setPrice, pricePerItem, operation}: IHandleItems ): void => {

    if (operation === "add") {

        if (qtdItems === 10) {

            toast.error("Quantidade máxima atingida!");
            return
        }



        setQtdItems((prev) => prev + 1)
        setPrice((prev) => prev + pricePerItem)
        return
    }

    if (operation === "remove") {

        if (qtdItems === 1) {

            return

        }

        setQtdItems((prev) => prev - 1)
        setPrice((prev) => prev - pricePerItem)
        return
    }


}