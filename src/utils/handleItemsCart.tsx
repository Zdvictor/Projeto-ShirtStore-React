import { toast } from "react-toastify"
import { addQtdCart, updateCart } from "../redux/reducers/cartReducer"


interface IHandleItems {
    id: number,
    qtdItems: { id: number, qtd: number }[],
    setQtdItems: React.Dispatch<React.SetStateAction<{ id: number, qtd: number }[]>>,
    setPrice: React.Dispatch<React.SetStateAction<{ id: number, price: number }[]>>,
    pricePerItem: { id: number, pricePerItem: number }[],
    operation: "add" | "remove",
    dispatch: React.Dispatch<unknown>
}

export const handleItemsCart = ({ id, qtdItems, setQtdItems, setPrice, pricePerItem, operation, dispatch }: IHandleItems): void => {
    // Encontra o item na lista
    const item = qtdItems.find(item => item.id === id)
    if (!item) return // Item não existe, nada a fazer

    if (operation === "add") {
        if (item.qtd >= 10) {
            toast.error("Quantidade máxima atingida!")
            return
        }
        
        // Atualiza a quantidade usando map
        const updatedQtdItems = qtdItems.map(i => 
            i.id === id 
                ? { ...i, qtd: i.qtd + 1 } 
                : i
        )

        const qtd = updatedQtdItems.find(i => i.id === id)?.qtd ?? 0
        dispatch(updateCart({id: id, qtd: qtd}))
        dispatch(addQtdCart({id, updatedQtdItems}))

        
        setQtdItems(updatedQtdItems)

        const itemPrice = pricePerItem.find(p => p.id === id)?.pricePerItem ?? 0
        setPrice(prev => 
            prev.map(p => 
                p.id === id 
                    ? { ...p, price: Number(p.price) + Number(itemPrice) } 
                    : p
            )
        )
    }

    if (operation === "remove") {
        if (item.qtd === 1) return

        // Atualiza a quantidade usando map
        const updatedQtdItems = qtdItems.map(i => 
            i.id === id 
                ? { ...i, qtd: i.qtd - 1 } 
                : i
        )

        const qtd = updatedQtdItems.find(i => i.id === id)?.qtd ?? 0
        dispatch(updateCart({id: id, qtd: qtd}))
        dispatch(addQtdCart({id, updatedQtdItems}))
        setQtdItems(updatedQtdItems)

        const itemPrice = pricePerItem.find(p => p.id === id)?.pricePerItem ?? 0
        setPrice(prev => 
            prev.map(p => 
                p.id === id 
                    ? { ...p, price: Number(p.price) - Number(itemPrice) } 
                    : p
            )
        )
    }
}
